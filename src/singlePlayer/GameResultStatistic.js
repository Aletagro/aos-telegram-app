import React from 'react'
import {singlePlayer} from '../utilities/appState'

import './styles/GameResult.css'

const GameResultStatistic = ({player}) => {

    const renderRound = (round, index) => <div id='gameResultStatisticRound'>
        <p id='gameResultStatisticText'>{index + 1} turn</p>
        <b id='gameResultStatisticText'>{round[player].vp}</b>
    </div>

    return <div id='gameResultContent'>
        <div id='gameResultTitleContainer'>
            <p id='gameResultTitle'>{player === 'firstPlayer' ? '1st' : '2nd'} Player VP</p>
        </div>
        {singlePlayer.rounds.map(renderRound)}
    </div>
}

export default GameResultStatistic