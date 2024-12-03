import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Constants from '../Constants'
import {singlePlayer} from '../utilities/appState'
import {getNewRound} from '../utilities/utils'
import Turns from './Turns'
import NewGame from './NewGame'
import Minus from '../icons/minus.svg'
import Plus from '../icons/plus.svg'

import './styles/SinglePlayer.css'

const SinglePlayer = () => {
    const navigate = useNavigate()
    const [updateCount, setUpdateCount] = useState(0)

    const getUnderdogCP = (player) => singlePlayer.underdog === player ? 5 : 4
    
    const handleUpdate = () => {
        setUpdateCount(updateCount + 1)
    }

    const handleClickNextRound = () => {
        if (singlePlayer.currentRound === 5) {
            singlePlayer.gameOver = true
        } else {
            singlePlayer.underdog = singlePlayer.firstPlayer.vp < singlePlayer.secondPlayer.vp ? 'firstPlayer' : 'secondPlayer'
            singlePlayer.rounds.push(getNewRound(singlePlayer.battleplan))
            singlePlayer.currentRound = singlePlayer.currentRound + 1
            singlePlayer.firstPlayer.cp = getUnderdogCP('firstPlayer')
            singlePlayer.secondPlayer.cp = getUnderdogCP('secondPlayer')
        }
        handleUpdate()
    }

    const handleClickBattleplan = () => {
        navigate('battleplan', {state: {battleplan: singlePlayer.battleplan, title: singlePlayer.battleplan.name}})
    }

    const handleClickMinusCP = (player) => () => {
        singlePlayer[player].cp = singlePlayer[player].cp - 1
        handleUpdate()
    }

    const handleClickPlusCP = (player) => () => {
        singlePlayer[player].cp = singlePlayer[player].cp + 1
        handleUpdate()
    }

    const handleClickNewGame = () => {
        singlePlayer.firstPlayer = {...Constants.newPlayer}
        singlePlayer.secondPlayer = {...Constants.newPlayer}
        singlePlayer.battleplan = {name: '', id: ''}
        singlePlayer.gameStarted = false
        singlePlayer.gameOver = false
        singlePlayer.underdog = 0
        singlePlayer.currentRound = 1
        handleUpdate()
    }

    return singlePlayer.gameOver
        ? <div id='column' className='Chapter'>
            <p>Игра окончена</p>
            <button id='singlePlayerBottomButton' onClick={handleClickNewGame}>Start New Game</button>
        </div>
        : singlePlayer.gameStarted
            ? <div id='column' className='Chapter'>
                <button id='singlePlayerBattleplan' onClick={handleClickBattleplan}>{`Battleplan: ${singlePlayer.battleplan.name}`}</button>
                <div id='playersNameContainer'>
                    <p id='scoreTitle'>1st Player</p>
                    <p id='scoreTitle'>2nd Player</p>
                </div>
                {/* Score */}
                <p id='singlePlayerTitle'>Score</p>
                <div id='scoreContainer'>
                    <p id='score'>{singlePlayer.firstPlayer.vp}</p>
                    <p id='score'>{singlePlayer.secondPlayer.vp}</p>
                </div>
                {/* CPs */}
                <p id='singlePlayerTitle'>Command Points</p>
                <div id='cpContainer'>
                    <div>
                        <div id='cpSubContainer'>
                            <button id='cpIcon' onClick={handleClickMinusCP('firstPlayer')}><img src={Minus} alt="" /></button>
                            <p id='cp'>{singlePlayer.firstPlayer.cp}</p>
                            <button id='cpIcon' onClick={handleClickPlusCP('firstPlayer')}><img src={Plus} alt="" /></button>
                        </div>
                        {singlePlayer.underdog === 'firstPlayer' ? <p id='underdog'>Underdog</p> : null}
                    </div>
                    <div>
                        <div id='cpSubContainer'>
                            <button id='cpIcon' onClick={handleClickMinusCP('secondPlayer')}><img src={Minus} alt="" /></button>
                            <p id='cp'>{singlePlayer.secondPlayer.cp}</p>
                            <button id='cpIcon' onClick={handleClickPlusCP('secondPlayer')}><img src={Plus} alt="" /></button>
                        </div>
                        {singlePlayer.underdog === 'secondPlayer' ? <p id='underdog'>Underdog</p> : null}
                    </div>
                </div>
                {/* Current Turn */}
                <Turns round={singlePlayer.currentRound} onUpdate={handleUpdate} />
                <button id='singlePlayerBottomButton' onClick={handleClickNextRound}>{singlePlayer.currentRound === 5 ? 'Finish game' : 'Start Next Round'}</button>
            </div>
            : <NewGame onUpdate={handleUpdate} />
}

export default SinglePlayer