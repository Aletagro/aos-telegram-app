import React from 'react'
import {useNavigate} from 'react-router-dom'
import Constants from '../Constants'
import {singlePlayer} from '../utilities/appState'
import {randomFromInterval} from '../utilities/utils'
import Info from '../icons/info.svg'

import filter from 'lodash/filter'

import Styles from './styles/ChooseBattleplan.module.css'

const dataBase = require('../dataBase.json')

const ChooseBattleplan = () => {
    const navigate = useNavigate()
    const battleplans = filter(dataBase.data.rule_section, ['parentId', Constants.battleplansRuleSectionId])

    const handleChooseBattleplan = (battleplan) => () => {
        singlePlayer.battleplan = {
            name: battleplan.name,
            id: battleplan.id
        }
        navigate(-1)
    }

    const handleChooseBattleplanInfo = (battleplan) => () => {
        navigate('/battleplan', {state: {battleplan, title: battleplan.name}})
    }

    const handleClickRandom = () => {
        const index = randomFromInterval(1, battleplans.length) - 1
        singlePlayer.battleplan = {
            name: battleplans[index].name,
            id: battleplans[index].id
        }
        navigate(-1)
    }

    const renderBattleplan = (battleplan, index) => <div id={Styles.container} key={index}>
        <button key={battleplan.id} id={Styles.battleplan} onClick={handleChooseBattleplan(battleplan)}>{battleplan.name}</button>
        <button id={Styles.icon} onClick={handleChooseBattleplanInfo(battleplan)}><img src={Info} alt="" /></button>
    </div>
    
    const renderRandomButton = () => <button id={Styles.randomButton} onClick={handleClickRandom}>Random Battleplan</button>

    return <div id='column' className='Chapter'>
        {battleplans && battleplans.map(renderBattleplan)}
        {renderRandomButton()}
    </div>
}

export default ChooseBattleplan
