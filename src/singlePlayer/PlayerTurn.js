import React from 'react';
import {useNavigate} from 'react-router-dom';
import {singlePlayer} from '../utilities/appState';

import './styles/Turn.css';

const PlayerTurn = ({player, round, onUpdate}) => {
    const navigate = useNavigate()
    const roundNumber = round - 1
    const disabledButton = round !== singlePlayer.currentRound
    const maxForObjectives = singlePlayer.rounds[roundNumber][player].maxForObjectives

    const handleChooseTactics = (player) => () => {
        navigate('chooseTactics', {state: {title: 'Choose Tactics', player, alliance: singlePlayer[player].alliance.name}})
    }

    const handleChangeParam = (param) => () => {
        const isChecked = singlePlayer.rounds[roundNumber][player].score[param.id]
        singlePlayer.rounds[roundNumber][player].score[param.id] = !isChecked
        let value = param.value
        if (isChecked) {
            if (maxForObjectives && param.id !== 'tactics') {
                singlePlayer.rounds[roundNumber][player].objectiveVp = singlePlayer.rounds[roundNumber][player].objectiveVp - value
                if ((singlePlayer.rounds[roundNumber][player].objectiveVp + value) > maxForObjectives) {
                    value = Math.max(0, maxForObjectives - singlePlayer.rounds[roundNumber][player].objectiveVp)
                }
            }
            singlePlayer[player].vp = singlePlayer[player].vp - value
            singlePlayer.rounds[roundNumber][player].vp = singlePlayer.rounds[roundNumber][player].vp - value
        } else {
            if (maxForObjectives && param.id !== 'tactics') {
                singlePlayer.rounds[roundNumber][player].objectiveVp = singlePlayer.rounds[roundNumber][player].objectiveVp + value
                if (singlePlayer.rounds[roundNumber][player].objectiveVp > maxForObjectives) {
                    value = Math.max(0, value - (singlePlayer.rounds[roundNumber][player].objectiveVp - maxForObjectives))
                }
            }
            singlePlayer[player].vp = singlePlayer[player].vp + value
            singlePlayer.rounds[roundNumber][player].vp = singlePlayer.rounds[roundNumber][player].vp + value
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
            {singlePlayer.rounds[roundNumber][player].tactics?.name || 'Choose Tactics'}
        </button>
        {singlePlayer.rounds[roundNumber][player].score.map(renderScoreParam)}
        <div id='scoreParamContainer'>
            <p>This turn VP</p>
            <p>{singlePlayer.rounds[roundNumber][player].vp} VP</p>
        </div>
        {singlePlayer.rounds[roundNumber][player].objectiveVp > maxForObjectives
            ? <p>VP from objectives max 6</p>
            : null
        }
    </div>
}

export default PlayerTurn