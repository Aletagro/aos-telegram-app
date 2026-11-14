import React from 'react'
import {useNavigate} from 'react-router-dom'
import {getTurnInfo, getResult, STATUS_FINISHED, MAX_ROUNDS} from './gameModel'
import {getMissionTitle} from './missionInfo'

import map from 'lodash/map'
import find from 'lodash/find'

import Styles from './styles/Dashboard.module.css'

const dataBase = require('../utilities/db')

const getImage = (player) => find(dataBase.data.faction_keyword, ['id', player.army?.allegianceId])?.moreInfoImage

// Карточка партии: армии, счёт, ход или победитель, миссия и дата
const GameCard = ({game, onDelete}) => {
    const navigate = useNavigate()
    const result = getResult(game)
    let progress
    if (game.status === STATUS_FINISHED) {
        progress = result.winner === null ? 'Draw' : `${game.players[result.winner].name} wins`
    } else {
        progress = `Round ${getTurnInfo(game).round} of ${MAX_ROUNDS}`
    }
    return <div className={Styles.gameCard}>
        <button type='button' className={Styles.gameButton} onClick={() => navigate('/game', {state: {title: 'Battle', gameId: game.id}})}>
            <span className={Styles.gameImages}>
                {map(game.players, (player, index) => <span className={Styles.gameHalf} key={index}>
                    {getImage(player) ? <img className={Styles.gameImage} src={getImage(player)} alt='' loading='lazy' /> : null}
                    <span className={Styles.gameShade} />
                    <span className={Styles.gameName}>{player.name}</span>
                    <span className={Styles.gameArmy}>{player.army?.allegiance}</span>
                </span>)}
                <span className={Styles.gameScore}>{result.players[0].total} : {result.players[1].total}</span>
            </span>
            <span className={Styles.gameInfo}>
                <span>{getMissionTitle(game.missionId).name} · {progress}</span>
                <span>{new Date(game.updatedAt).toLocaleDateString()}</span>
            </span>
        </button>
        <button type='button' className={Styles.gameDelete} onClick={() => onDelete(game)} aria-label='Delete battle'>×</button>
    </div>
}

export default GameCard
