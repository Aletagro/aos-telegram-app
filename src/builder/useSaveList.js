import React, {useCallback, useEffect, useReducer, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from '../components/Modal'
import Button from '../components/Button'
import ToggleRow from '../components/ToggleRow'
import FloatingLabelInput from '../components/FloatingLabelInput'
import Constants from '../Constants'
import {roster, main} from '../utilities/appState'
import {getWoundsCount, getDropsCount} from '../utilities/utils'
import {hasListsLimit, openSupportPage} from '../utilities/support'

import map from 'lodash/map'
import get from 'lodash/get'
import size from 'lodash/size'
import filter from 'lodash/filter'

import Styles from './styles/Export.module.css'

const rorKeys =  ['id', 'name', 'regimentOfRenownPointsCost']

const manifistationsKeys =  ['id', 'name']

// Сохранение списка на сервер: окно с названием, проверка регистрации и лимита списков.
// Общее для экрана билдера и экспорта. Возвращает обработчик кнопки «Сохранить» и готовое окно, его нужно вывести на экране
const useSaveList = () => {
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [listName, setListName] = useState(roster.name || `List-${size(main.rosters)}`)
    const [isListPublic, setIsListPublic] = useState(true)
    const [saveAsNew, setSaveAsNew] = useState(false)
    const [isDisableSaveButton, setIsDisableSaveButton] = useState(false)
    const unitsKeys =  ['id', 'name', 'points', 'modelCount', 'isReinforced', 'heroicTrait', 'artefact', 'otherWarscrollOption', 'marksOfChaos', ...roster.otherEnhancements, 'weaponOptions'] 

    useEffect(() => {
        if (main.showSaveListModal) {
            main.showSaveListModal = false
            setIsModalOpen(true)
        }
        handleGetLists()
    // eslint-disable-next-line
    }, [])

    const pickKeys = (unit, keys) => {
        return keys.reduce((acc, key) => {
            if (unit.hasOwnProperty(key)) {
                acc[key] = unit[key]
            }
            return acc;
        }, {})
    }

    const getShortUnits = (units = [], keys) => {
        if (size(units)) {
            return map(units, (unit) => {
                return pickKeys(unit, keys)
            })
        }
        return null
    }

    const getShortRegiments = () => {
        return map(roster.regiments, (regiment) => {
            const units = getShortUnits(regiment.units, unitsKeys)
            return JSON.stringify({...regiment, units})
        })
    }

    const handleSaveList = async () => {
        setIsDisableSaveButton(true)
        const wounds = getWoundsCount(roster)
        const drops = getDropsCount(roster)
        const data = {
            name: listName,
            allegiance: roster.allegiance,
            allegiance_id: roster.allegianceId,
            auxiliary_units: JSON.stringify(getShortUnits(roster.auxiliaryUnits, unitsKeys)),
            battle_formation: roster.battleFormation,
            faction_terrain: roster.factionTerrain,
            general_regiment_index: roster.generalRegimentIndex,
            grand_alliance: roster.grandAlliance,
            manifestation_lore: roster.manifestationLore,
            manifestations_list: JSON.stringify(getShortUnits(roster.manifestationsList, manifistationsKeys)),
            points: JSON.stringify(roster.points),
            points_limit: roster.pointsLimit,
            prayers_lore: roster.prayersLore,
            regiment_of_renown: roster.regimentOfRenown ? JSON.stringify(pickKeys(roster.regimentOfRenown, rorKeys)) : '',
            regiments: JSON.stringify(getShortRegiments()),
            regiments_of_renown_units: JSON.stringify(getShortUnits(roster.regimentsOfRenownUnits, unitsKeys)),
            spells_lore: roster.spellsLore,
            tactics: JSON.stringify(map(roster.tactics, 'name')),
            user_id: main.user?.id,
            is_public: isListPublic,
            note: roster.id && roster.note ? JSON.stringify({...JSON.parse(roster.note), noteText: roster.noteText, wounds, drops}) : JSON.stringify({...roster.note, noteText: roster.noteText, wounds, drops}),
        }
        try {
            if (roster.id && !saveAsNew) {
                await fetch(`${Constants.domain}/rosters_db/update_roster?roster_id=${roster.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': "application/json, text/javascript, /; q=0.01"
                    }
                })
            } else {
                await fetch(`${Constants.domain}/rosters_db/new_roster`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': "application/json, text/javascript, /; q=0.01"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    roster.id = get(data, 'roster_id')
                })
                .catch(error => console.error(error))
            }
        } catch (err) {
            console.error(err.message)
        }
        handleCloseModal()
        toast.success('List Saved', Constants.toastParams)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleClickSaveButton = () => {
        if (!get(main, 'user.id')) {
            navigate('/registration')
        } else {
            setIsModalOpen(true)
        }
    }

    const handleDeleteList = (listId) => async () => {
        await fetch(`${Constants.domain}/rosters_db/delete_roster?roster_id=${listId}&user_id=${main.user?.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json, text/javascript, /; q=0.01"
            }
        })
            .then(() => {
                main.rosters = filter(main.rosters, roster => roster.id !== listId)
                toast.success('List deleted', Constants.toastParams)
                forceUpdate()
            })
            .catch(error => console.error(error))
    }

    const handleGetLists = useCallback(async () => {
        const urlQuery = main.tgId ? `tgId=${main.tgId}` : `vkId=${main.vkId}`
        fetch(`${Constants.domain}/rosters_db/rosters_by_user?${urlQuery}`)
            .then(response => response.json())
            .then(data => {
                main.rosters = data.rosters
                forceUpdate()
            })
            .catch(error => console.error(error))
      }, [])


    const renderList = (list) => <button type='button' key={list.id} className={Styles.listDeleted} onClick={handleDeleteList(list.id)}>
        <div>
            <p className={Styles.listDeletedTitle}>{list.name}</p>
            <p className={Styles.listDeletedSubtitle}>{list.allegiance}</p>
        </div>
        <span className={Styles.listDeletedMark} aria-label='Delete'>&times;</span>
    </button>

    const handleBlurName = (e) => {
        setListName(e.target.value)
    }

    const handleChangePublic = () => {
        setIsListPublic(!isListPublic)
    }

    const handleChangeAsNew = () => {
        setSaveAsNew(!saveAsNew)
    }

    const isListsLimit = size(main.rosters) >= Constants.listsMax && !roster.id && hasListsLimit(main.user, main.tgId)

    const renderModalContent = () => {
        if (isListsLimit) {
            return <>
                <p className={Styles.modalText}>You can delete one of your lists or support the app from 1 EUR to remove the limit for a month.</p>
                <Button className={Styles.modalSave} onClick={openSupportPage}>Support the app</Button>
                {map(main.rosters, renderList)}
            </>
        }
        return <>
            <FloatingLabelInput
                style={inputStyles.listName}
                onBlur={handleBlurName}
                label='List Name'
                defaultValue={listName}
            />
            <ToggleRow label='Save as public' hint='Other users will be able to see this list.' checked={isListPublic} onChange={handleChangePublic} />
            {roster.id && (size(main.rosters) < Constants.listsMax || !hasListsLimit(main.user, main.tgId))
                ? <ToggleRow label='Save as new List' checked={saveAsNew} onChange={handleChangeAsNew} />
                : null
            }
            <Button className={Styles.modalSave} disabled={!listName || isDisableSaveButton} onClick={handleSaveList}>Save</Button>
        </>
    }

    const saveModal = <Modal
        visible={isModalOpen}
        title={isListsLimit ? 'You have reached limit of saved lists' : 'Save Roster'}
        onClose={handleCloseModal}
        Content={renderModalContent}
    />

    return {handleClickSaveButton, saveModal}
}

export default useSaveList

const inputStyles = {
    listName: {
        '--Input-minHeight': '48px',
        '--Input-focusedHighlight': '#b0953f',
        borderRadius: '14px',
        'border-color': '#c9b36a',
        background: '#fff',
        color: '#1d1810',
        'box-shadow': 'none',
        'font-family': 'Minion Pro Bold'
    }
}
