import {t} from '../utilities/i18n'
import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Constants from '../Constants'
import Button from '../components/Button'
import {main} from '../utilities/appState'
import {sortByName} from '../utilities/utils'
import {decodeRosterCode} from '../utilities/rosterCode'
import ImageCard from '../components/ImageCard'
import TacticsPick from './TacticsPick'
import {gameDraft, listToArmy, manualArmy, pickArmy, getListTacticIds, SOURCE_SAVED, SOURCE_CODE} from './gameDraft'
import {fetchRoster} from './api'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'

import Styles from './styles/Dashboard.module.css'
import ListStyles from '../builder/styles/UserLists.module.css'

const dataBase = require('../utilities/db')

const TAB_MINE = 'mine'
const TAB_CODE = 'code'
const TAB_MANUAL = 'manual'

// Армии гранд-альянса. Орков разделяем на отдельные книги, как и в билдере
const getAllegiances = (grandAlliance) => {
    let allegiances = filter(dataBase.data.faction_keyword, faction => faction.parentFactionKeywordId === grandAlliance.id)
    if (grandAlliance.name === 'Destruction') {
        const orrukWarclansId = find(allegiances, ['name', 'Orruk Warclans'])?.id
        const orrukAllegiances = filter(dataBase.data.faction_keyword, faction => faction.parentFactionKeywordId === orrukWarclansId && !faction.armyOfRenown)
        allegiances = [...filter(allegiances, allegiance => allegiance.name !== 'Orruk Warclans'), ...orrukAllegiances]
    }
    sortByName(allegiances)
    return allegiances
}

// Выбор армии одного игрока: свои списки, список по коду или армия вручную
const GameChooseArmy = () => {
    const navigate = useNavigate()
    const index = useLocation().state?.index ?? 0
    const [tab, setTab] = useState(TAB_MINE)
    const [lists, setLists] = useState(main.rosters || [])
    const [code, setCode] = useState('')
    const [codeError, setCodeError] = useState('')
    const [loading, setLoading] = useState(false)
    const [grandAlliance, setGrandAlliance] = useState(Constants.grandAlliances[0])

    useEffect(() => {
        if (tab !== TAB_MINE) return
        let active = true
        const query = main.tgId ? `tgId=${main.tgId}` : `vkId=${main.vkId}`
        fetch(`${Constants.domain}/rosters_db/rosters_by_user?${query}`)
            .then(response => response.json())
            .then(data => {
                if (!active) return
                main.rosters = data.rosters || []
                setLists(main.rosters)
            })
            .catch(() => {})
        return () => { active = false }
    }, [tab])

    // Армия, ждущая выбора тактик, лежит в черновике: так она переживает переход на экран описания тактики
    const [pending, setPending] = useState(() => gameDraft.pending?.index === index ? gameDraft.pending : null)

    const updatePending = (value) => {
        gameDraft.pending = value
        setPending(value)
    }

    const choose = (army, tactics) => {
        if (tactics.length === 2) {
            pickArmy(index, army, tactics)
            navigate(-1)
        } else {
            updatePending({index, army, tactics})
        }
    }

    const handleTacticsDone = () => {
        pickArmy(index, pending.army, pending.tactics)
        gameDraft.pending = null
        navigate(-1)
    }

    const handleFind = async () => {
        const id = decodeRosterCode(code)
        if (!id) {
            setCodeError(t('Invalid roster code'))
            return
        }
        setLoading(true)
        setCodeError('')
        const list = await fetchRoster(id)
        setLoading(false)
        if (!list) {
            setCodeError(t('List not found. Check the code'))
            return
        }
        choose(listToArmy(list, SOURCE_CODE), getListTacticIds(list))
    }

    const renderList = (list) => {
        const army = find(dataBase.data.faction_keyword, ['id', list.allegiance_id])
        return <div id={ListStyles.listContainer} key={list.id}>
            <button id={ListStyles.button} onClick={() => choose(listToArmy(list, SOURCE_SAVED), getListTacticIds(list))}>
                <img src={army?.moreInfoImage} alt={army?.name} id={ListStyles.image} />
                <div id={ListStyles.textContainer}>
                    <p id={ListStyles.text}>{list.name}</p>
                    <p id={ListStyles.armyText}>{army?.name}</p>
                </div>
            </button>
        </div>
    }

    const renderMine = () => lists.length
        ? <div id={ListStyles.buttonContainer}>{map(lists, renderList)}</div>
        : <p className={Styles.muted}>{t('You have no saved lists yet. Build one in the Builder or choose an army manually.')}</p>

    const renderCode = () => <div className={Styles.gap}>
        <div className={Styles.card}>
            <h3 className={Styles.cardTitle}>{t('How to share a list')}</h3>
            <p className={Styles.muted}>{t('Your opponent opens a saved list and taps «Copy roster code» in the export screen. Paste the code here.')}</p>
            <p className={Styles.muted}>{t('The list is only read: it is not added to your saved lists.')}</p>
        </div>
        <input className={Styles.input} value={code} placeholder={t('Roster code')} onChange={event => setCode(event.target.value)} />
        {codeError ? <p className={Styles.errorText}>{codeError}</p> : null}
        <Button disabled={!code.trim() || loading} onClick={handleFind}>{loading ? t('Loading...') : t('Find list')}</Button>
    </div>

    const renderManual = () => <div className={Styles.gap}>
        <div className={Styles.chips}>{map(Constants.grandAlliances, alliance => <button type='button' key={alliance.id}
            className={`${Styles.chip} ${grandAlliance.id === alliance.id ? Styles.chipActive : ''}`} onClick={() => setGrandAlliance(alliance)}>{alliance.name}</button>)}</div>
        {map(getAllegiances(grandAlliance), allegiance => <ImageCard
            key={allegiance.id}
            title={allegiance.name}
            image={allegiance.selectFactionImage}
            onClick={() => choose(manualArmy(allegiance), gameDraft.players[index].army?.allegianceId === allegiance.id ? gameDraft.players[index].tactics : [])}
        />)}
    </div>

    return <div className={Styles.page}>
        <div className={Styles.tabs}>
            {map([[TAB_MINE, t('My lists')], [TAB_CODE, t('By code')], [TAB_MANUAL, t('Manually')]], ([id, label]) =>
                <button type='button' key={id} className={`${Styles.tab} ${tab === id ? Styles.tabActive : ''}`} onClick={() => setTab(id)}>{label}</button>)}
        </div>
        {tab === TAB_MINE ? renderMine() : tab === TAB_CODE ? renderCode() : renderManual()}
        <TacticsPick visible={Boolean(pending)} selected={pending?.tactics || []}
            onChange={tactics => updatePending({...pending, tactics})} onDone={handleTacticsDone} onClose={() => updatePending(null)} />
    </div>
}

export default GameChooseArmy
