import React from 'react';
import {useNavigate} from 'react-router-dom';
import Constants from '../Constants';
import {singlePlayer} from '../utilities/appState';
import {sortByName, getNewRound} from '../utilities/utils'

import './styles/NewGame.css';

const dataBase = require('../dataBase.json');

const underdogButtons = [
    {title: 'Nobody', value: 0},
    {title: '1st player', value: 'firstPlayer'},
    {title: '2nd player', value: 'secondPlayer'}
]

const NewGame = ({onUpdate}) => {
    const navigate = useNavigate()
    const disabledStartButton = !singlePlayer.battleplan.name
    
    const getAllegiances = (grandAlliance) => {
        let allegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === grandAlliance.id)
        // нужно чтобы орков разделить на отдельные книги
        if (grandAlliance.name === 'Destruction') {
            const orrukWarclansId = allegiances.find(allegiance => allegiance.name === 'Orruk Warclans')?.id
            const orrukAllegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === orrukWarclansId && !faction.armyOfRenown)
            allegiances = [...allegiances, ...orrukAllegiances]
            allegiances = allegiances.filter(allegiance => allegiance.name !== 'Orruk Warclans')
        }
        sortByName(allegiances)
        return allegiances
    }

    const firstPlayerAllegiances = getAllegiances(singlePlayer.firstPlayer.alliance)
    const secondPlayerAllegiances = getAllegiances(singlePlayer.secondPlayer.alliance)

    const handleChooseBattleplan = () => {
        navigate('chooseBattleplan', {state: {title: 'Choose Battleplan'}})
    }

    const handleClickGrandAlliance = (alliance, player) => () => {
        singlePlayer[player].alliance = {
            name: alliance.name,
            id: alliance.id
        }
        singlePlayer[player].allegiance = {name: '', id: ''}
        onUpdate()
    }

    const handleClickAllegiance = (allegiance, player) => () => {
        singlePlayer[player].allegiance = {
            name: allegiance.name,
            id: allegiance.id
        }
        onUpdate()
    }

    const handleClickStart = () => {
        // TODO: Добавить валидацию
        singlePlayer.rounds.push(getNewRound(singlePlayer.battleplan))
        singlePlayer.gameStarted = true
        if (singlePlayer.underdog) {
            singlePlayer[singlePlayer.underdog].cp = 5
        }
        onUpdate()
    }

    const handleClickUnderdog = (value) => () => {
        singlePlayer.underdog = value
        onUpdate()
    }

    const renderGrandAlliance = (player) => (alliance) => <button
        key={alliance.id}
        onClick={handleClickGrandAlliance(alliance, player)}
        id={singlePlayer[player].alliance.id === alliance.id ? 'newGameCheckedButton' : 'newGameButton'}
    >
        {alliance.name}
    </button>

    const renderAllegiances = (player) => (allegiance) => <button
        key={allegiance.id}
        onClick={handleClickAllegiance(allegiance, player)}
        id={singlePlayer[player].allegiance.id === allegiance.id ? 'newGameCheckedButton' : 'newGameButton'}
    >
        {allegiance.name}
    </button>

    const renderUnderdogButton = (button) => <button
        key={button.value}
        onClick={handleClickUnderdog(button.value)}
        id={singlePlayer.underdog === button.value ? 'newGameCheckedButton' : 'newGameButton'}
    >
        {button.title}
    </button>

    return <div id='column' className='Chapter'>
        <button id='newGameBattleplan' onClick={handleChooseBattleplan}>{singlePlayer.battleplan.name ? `Battleplan: ${singlePlayer.battleplan.name}` : 'Choose Battleplan'}</button>
        <p id='newGameTitle'>1st Player's Army</p>
        <div id='newGameAlliancesButtons'>
            {Constants.grandAlliances.map(renderGrandAlliance('firstPlayer'))}
        </div>
        <div id='newGameArmiesButtons'>
            {firstPlayerAllegiances.map(renderAllegiances('firstPlayer'))}
        </div>
        <p id='newGameTitle'>2nd Player's Army</p>
        <div id='newGameAlliancesButtons'>
            {Constants.grandAlliances.map(renderGrandAlliance('secondPlayer'))}
        </div>
        <div id='newGameArmiesButtons'>
            {secondPlayerAllegiances.map(renderAllegiances('secondPlayer'))}
        </div>
        <p id='newGameTitle'>Underdog</p>
        <div id='newGameUnderdog'>
            {underdogButtons.map(renderUnderdogButton)}
        </div>
        <button id={disabledStartButton ? 'newGameDisabledStart' : 'newGameStart'} onClick={handleClickStart} disabled={disabledStartButton}>Start Game</button>
    </div>
}

export default NewGame