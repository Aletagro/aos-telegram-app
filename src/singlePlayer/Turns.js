import React from 'react';
import {singlePlayer} from '../utilities/appState';
import Turn from './Turn'

import './styles/Turn.css';

const Turns = ({round, onUpdate}) => {
    const roundCount = singlePlayer.rounds.length

    const renderTurn = (_, index) => <Turn key={index} round={index + 1} onUpdate={onUpdate} />

    return Array(roundCount).fill(0).map(renderTurn)
}

export default Turns