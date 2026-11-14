import {t} from '../utilities/i18n'
import React from 'react'
import {getResult, MAX_ROUNDS} from './gameModel'

import map from 'lodash/map'
import range from 'lodash/range'

import Styles from './styles/GameScreen.module.css'

// Итоги партии: победитель и таблица очков по источникам и по раундам
const GameResult = ({game}) => {
    const {players, winner} = getResult(game)
    const rows = [[t('Battleplan'), 'mission'], [t('Tactic cards'), 'tactics']]
    if (players[0].manual || players[1].manual) rows.push([t('Other VP'), 'manual'])

    return <div className={Styles.body}>
        <p className={Styles.winnerText}>{winner === null ? t('Draw') : t('{{name}} wins', {name: game.players[winner].name})}</p>
        <div className={Styles.card}>
            <table className={Styles.table}>
                <thead><tr><th /><th>{game.players[0].name}</th><th>{game.players[1].name}</th></tr></thead>
                <tbody>
                    {map(rows, ([label, key]) => <tr key={key}><td>{label}</td><td>{players[0][key]}</td><td>{players[1][key]}</td></tr>)}
                    <tr className={Styles.total}><td>{t('Total')}</td><td>{players[0].total}</td><td>{players[1].total}</td></tr>
                </tbody>
            </table>
        </div>
        <div className={Styles.card}>
            <h4 className={Styles.cardTitle}>{t('By round')}</h4>
            <table className={Styles.table}>
                <tbody>
                    {map(range(MAX_ROUNDS), round => <tr key={round}><td>{t('Round')} {round + 1}</td><td>{players[0].rounds[round]}</td><td>{players[1].rounds[round]}</td></tr>)}
                </tbody>
            </table>
        </div>
    </div>
}

export default GameResult
