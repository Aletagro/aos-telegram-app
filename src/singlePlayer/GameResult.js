import React from 'react'
import Constants from '../Constants'
import {singlePlayer} from '../utilities/appState'
import GameResultPlayer from './GameResultPlayer'
import GameResultStatistic from './GameResultStatistic'

import './styles/GameResult.css'

const GameResult = ({onUpdate}) => {
    const winnerIndex = singlePlayer.firstPlayer.vp === singlePlayer.secondPlayer.vp
        ? 0
        : singlePlayer.firstPlayer.vp > singlePlayer.secondPlayer.vp
            ? 1
            : 2

    const getGameResultText = () => {
        switch (winnerIndex) {
            case 1:
                return {firstPlayer: 'WINNER', secondPlayer: 'LOSER'}
            case 2:
                return {firstPlayer: 'LOSER', secondPlayer: 'WINNER'}
            default:
                return {firstPlayer: 'DRAW', secondPlayer: 'DRAW'}
        }
    }

    const gameResultText = getGameResultText()

    const handleClickNewGame = () => {
        singlePlayer.firstPlayer = {...Constants.newPlayer}
        singlePlayer.secondPlayer = {...Constants.newPlayer}
        singlePlayer.battleplan = {name: '', id: ''}
        singlePlayer.rounds = []
        singlePlayer.gameStarted = false
        singlePlayer.gameOver = false
        singlePlayer.underdog = 0
        singlePlayer.currentRound = 1
        onUpdate()
    }

    return <div id='column' className='Chapter'>
        <div id='gameResultContainer'>
            <GameResultPlayer player='firstPlayer' gameResult={gameResultText.firstPlayer} />
            <GameResultPlayer player='secondPlayer' gameResult={gameResultText.secondPlayer} />
        </div>
        <b id='gameResultStatistics'>Statistics</b>
        <div id='gameResultContainer'>
            <GameResultStatistic player='firstPlayer' />
            <GameResultStatistic player='secondPlayer' />
        </div>
        <button id='singlePlayerBottomButton' onClick={handleClickNewGame}>Start New Game</button>
    </div>
}

export default GameResult