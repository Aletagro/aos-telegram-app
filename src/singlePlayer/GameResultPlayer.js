import React from 'react'
import {singlePlayer} from '../utilities/appState'

import './styles/GameResult.css'

const GameResultPlayer = ({player, gameResult}) => {

    return <div id='gameResultContent'>
        <div id='gameResultTitleContainer'>
            <p id='gameResultTitle'>{player === 'firstPlayer' ? '1st' : '2nd'} Player's Army</p>
            <p id='gameResultPlayerArmy'>{singlePlayer[player].allegiance?.name}</p>
        </div>
        <p id='gameResultPlayerText'>Score</p>
        <div id='gameResultPlayerScoreContainer'>
            <p id={gameResult === 'WINNER' ? 'gameResultPlayerWinnerScoreText' : 'gameResultPlayerScoreText'}>{singlePlayer[player].vp}</p>
        </div>
        <p id='gameResultPlayerResult'>{gameResult}</p>
    </div>
}

export default GameResultPlayer