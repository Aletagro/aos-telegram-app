import React from 'react';
import {useNavigate} from 'react-router-dom';
import Constants from '../Constants'
import {singlePlayer} from '../utilities/appState';
import {randomFromInterval} from '../utilities/utils'
import Info from '../icons/info.svg'

import './styles/ChooseBattleplan.css';

const dataBase = require('../dataBase.json')

const ChooseBattleplan = () => {
    const navigate = useNavigate()
    const battleplans = dataBase.data.rule_container.filter((group) => group.ruleSectionId === Constants.battleplansRuleSectionId)

    const handleChooseBattleplan = (battleplan) => () => {
        singlePlayer.battleplan = {
            name: battleplan.title,
            id: battleplan.id
        }
        navigate(-1)
    }

    const handleChooseBattleplanInfo = (battleplan) => () => {
        navigate('battleplan', {state: {battleplan, title: battleplan.title}})
    }

    const handleClickRandom = () => {
        const index = randomFromInterval(1, battleplans.length) - 1
        singlePlayer.battleplan = {
            name: battleplans[index].title,
            id: battleplans[index].id
        }
        navigate(-1)
    }

    const renderBattleplan = (battleplan) => <div id='chooseBattleplanContainer' key={battleplan.id}>
        <button key={battleplan.id} id='chooseBattleplan' onClick={handleChooseBattleplan(battleplan)}>{battleplan.title}</button>
        <button id='chooseBattleplanIcon' onClick={handleChooseBattleplanInfo(battleplan)}><img src={Info} alt="" /></button>
    </div>
    
    const renderRandomButton = () => <button id='chooseBattleplanRandomButton' onClick={handleClickRandom}>Random Battleplan</button>

    return <div id='column' className='Chapter'>
        {battleplans && battleplans.map(renderBattleplan)}
        {renderRandomButton()}
    </div>
}

export default ChooseBattleplan