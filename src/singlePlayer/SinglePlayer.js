import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Constants from '../Constants'
import {singlePlayer} from '../utilities/appState'
import Turns from './Turns'
import NewGame from './NewGame'
import PlayerInfo from './PlayerInfo'
import Info from '../icons/info.svg'

import './styles/SinglePlayer.css'

const SinglePlayer = () => {
    const navigate = useNavigate()
    const [updateCount, setUpdateCount] = useState(0)
    
    const handleUpdate = () => {
        setUpdateCount(updateCount + 1)
    }

    const handleClickBattleplan = () => {
        navigate('battleplan', {state: {battleplan: singlePlayer.battleplan, title: singlePlayer.battleplan.name}})
    }


    const handleClickNewGame = () => {
        singlePlayer.firstPlayer = {...Constants.newPlayer}
        singlePlayer.secondPlayer = {...Constants.newPlayer}
        singlePlayer.battleplan = {name: '', id: ''}
        singlePlayer.rounds = []
        singlePlayer.gameStarted = false
        singlePlayer.gameOver = false
        singlePlayer.underdog = 0
        singlePlayer.currentRound = 1
        handleUpdate()
    }

    return singlePlayer.gameOver
        ? <div id='column' className='Chapter'>
            <p id='gameWinner'>{singlePlayer.firstPlayer.vp > singlePlayer.secondPlayer.vp
                ? '1st Player Wins'
                : singlePlayer.firstPlayer.vp === singlePlayer.secondPlayer.vp
                    ? 'Draw'
                    : '2nd Player Wins!'
            }</p>
            <div id='scoreContainer'>
                <p id='score'>{singlePlayer.firstPlayer.vp}</p>
                <p id='score'>{singlePlayer.secondPlayer.vp}</p>
            </div>
            <div id='playersNameContainer'>
                <p id='scoreTitle'>1st Player</p>
                <p id='scoreTitle'>2nd Player</p>
            </div>
            <button id='singlePlayerBottomButton' onClick={handleClickNewGame}>Start New Game</button>
        </div>
        : singlePlayer.gameStarted
            ? <div id='column' className='Chapter'>
                <button id='singlePlayerBattleplan' onClick={handleClickBattleplan}>
                    <p>Battleplan: <b>{singlePlayer.battleplan.name}</b></p>
                    <img src={Info} alt="" />
                </button>
                <div id='singlePlayerInfoContainer'>
                    <PlayerInfo player='firstPlayer' onUpdate={handleUpdate} />
                    <PlayerInfo player='secondPlayer' onUpdate={handleUpdate} />
                </div>
                <Turns round={singlePlayer.currentRound} onUpdate={handleUpdate} />
            </div>
            : <NewGame onUpdate={handleUpdate} />
}

export default SinglePlayer