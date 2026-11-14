import React from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import Constants from '../Constants'
import {singlePlayer} from '../utilities/appState'
import {replaceAsterisks} from '../utilities/utils'

import Styles from './styles/ChooseTactics.module.css'

const dataBase = require('../utilities/db')

const ChooseTactics = () => {
    const navigate = useNavigate()
    const {player} = useLocation().state
    const allianceTacticsId = Constants.tacticsIds[singlePlayer[player].alliance.name]
    const choosedTacticsIds = singlePlayer.rounds.map((round, index) => singlePlayer.currentRound === index + 1 ? '' : round[player].tactics?.id)
    const tactics = dataBase.data.rule_container_component.filter(
        (rule) => (rule.ruleContainerId === Constants.tacticsIds.Universal || rule.ruleContainerId === allianceTacticsId) && !choosedTacticsIds.includes(rule.id)
    )

    const handleChooseTactics = (tactic) => () => {
        singlePlayer.rounds[singlePlayer.currentRound - 1][player].tactics = {name: tactic.title, id: tactic.id}
        navigate(-1)
    }

    const renderTactic = (tactic) => {
        return <button key={tactic.id} id={Styles.container} onClick={handleChooseTactics(tactic)}>
            <b id={Styles.title}>{tactic.title}</b>
            <p id={Styles.text}>{replaceAsterisks(tactic.textContent)}</p>
        </button>
    }
    
    return <div id='column' className='Chapter'>
        {tactics && tactics.map(renderTactic)}
    </div>
}

export default ChooseTactics
