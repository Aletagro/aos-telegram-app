import React from 'react';
import {useNavigate} from 'react-router-dom';
import {singlePlayer} from '../utilities/appState';

import './styles/Turn.css';

const scoresParams = [
    {title: 'Tactics Complite', id: 'tacticsComplite', value: 4, completed: false},
    {title: 'One Point', id: 'one', value: 2, completed: false},
    {title: 'Two and More', id: 'twoAndMore', value: 2, completed: false},
    {title: 'More Than Opp', id: 'moreThan', value: 2, completed: false}
]


const PlayerTurn = ({player, round, onUpdate}) => {
    const navigate = useNavigate()
    const roundNumber = round - 1
    const disabledButton = round !== singlePlayer.currentRound

    const handleChooseTactics = (player) => () => {
        navigate('chooseTactics', {state: {title: 'Choose Tactics', player, alliance: singlePlayer[player].alliance.name}})
    }

    const handleChangeParam = (param) => () => {
        const isChecked = singlePlayer.rounds[roundNumber][player].score[param.id]
        singlePlayer.rounds[roundNumber][player].score[param.id] = !isChecked
        if (isChecked) {
            singlePlayer[player].vp = singlePlayer[player].vp - param.value
            singlePlayer.rounds[roundNumber][player].vp = singlePlayer.rounds[roundNumber][player].vp - param.value
        } else {
            singlePlayer[player].vp = singlePlayer[player].vp + param.value
            singlePlayer.rounds[roundNumber][player].vp = singlePlayer.rounds[roundNumber][player].vp + param.value
        }
        onUpdate()
    }

    const renderScoreParam = (param) => <div key={param.id} id='scoreParamContainer'>
        <p>{param.title}</p>
        <input
            type='checkbox'
            id={singlePlayer.rounds[roundNumber][player].score[param.id] ? 'checkedCheckbox' : 'uncheckedCheckbox'}
            checked={param.completed}
            onChange={handleChangeParam(param)}
        />
    </div>

    return <div id='currentRoundSubContainer'>
        <button id={disabledButton ? 'chooseTacticsDisabledButton' : 'chooseTacticsButton'} disabled={disabledButton} onClick={handleChooseTactics(player)}>
            {singlePlayer.rounds[roundNumber][player].tactics.name || 'Choose Tactics'}
        </button>
        {scoresParams.map(renderScoreParam)}
        <div id='scoreParamContainer'>
            <p>This turn VP</p>
            <p>{singlePlayer.rounds[roundNumber][player].vp} VP</p>
        </div>
    </div>
}

export default PlayerTurn