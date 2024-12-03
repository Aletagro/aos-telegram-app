import React from 'react';
import PlayerTurn from './PlayerTurn'

import './styles/Turn.css';

const Turn = ({round, onUpdate}) => {
    return <div>
        <p id='singlePlayerTitle'>Round {round}</p>
        <div id='currentRoundContainer'>
            <PlayerTurn player='firstPlayer' round={round} onUpdate={onUpdate} />
            <PlayerTurn player='secondPlayer' round={round} onUpdate={onUpdate} />
        </div>
    </div>
}

export default Turn