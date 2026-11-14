import React, {useReducer} from 'react'
import {useNavigate} from 'react-router-dom'
import Button from '../components/Button'
import InfoIcon from '../icons/InfoIcon'
import {getStringAfterDash} from '../utilities/utils'
import {gameDraft} from './gameDraft'
import {getTacticCard} from './missionData'

import map from 'lodash/map'
import find from 'lodash/find'

import Styles from './styles/Dashboard.module.css'

const dataBase = require('../utilities/db')

// Шаг 1: армии обоих игроков (тактики подставляются из списка или спрашиваются при выборе армии)
const GameSetup = () => {
    const navigate = useNavigate()
    const [, forceUpdate] = useReducer(x => x + 1, 0)
    const ready = gameDraft.players.every(player => player.army && player.tactics.length === 2)

    const openTactic = (cardId) => {
        const name = getTacticCard(cardId)?.name
        const tactic = find(dataBase.data.rule_container, container => getStringAfterDash(container.title) === name)
        if (tactic) navigate('/tactic', {state: {title: name, tactic}})
    }

    const renderPlayer = (player, index) => {
        const army = player.army
        const faction = find(dataBase.data.faction_keyword, ['id', army?.allegianceId])
        const image = faction?.moreInfoImage || faction?.selectFactionImage
        return <div className={Styles.armyCard} key={index}>
            {image ? <img className={Styles.armyImage} src={image} alt='' /> : null}
            {image ? <span className={Styles.armyShade} /> : null}
            <div className={Styles.armyContent}>
                <input className={Styles.input} value={player.name} placeholder={`Player ${index + 1}`} maxLength={30}
                    onChange={event => { player.name = event.target.value; forceUpdate() }} />
                {army ? <>
                    <p className={Styles.armyNameBig}>{army.name}</p>
                    {army.allegiance !== army.name ? <p className={Styles.armyAllegiance}>{army.allegiance}</p> : null}
                    {map(player.tactics, id => <button type='button' key={id} className={Styles.armyTactic} onClick={() => openTactic(id)}>
                        <span>{getTacticCard(id)?.name}</span><InfoIcon size={22} />
                    </button>)}
                </> : null}
                <Button type='secondary' onClick={() => navigate('/gameChooseArmy', {state: {title: 'Army', index}})}>{army ? 'Change army' : 'Choose army'}</Button>
            </div>
        </div>
    }

    return <div className={Styles.page}>
        {map(gameDraft.players, renderPlayer)}
        <div className={Styles.bottomBar}>
            <Button disabled={!ready} onClick={() => navigate('/gameMission', {state: {title: 'Battleplan'}})}>Next</Button>
        </div>
    </div>
}

export default GameSetup
