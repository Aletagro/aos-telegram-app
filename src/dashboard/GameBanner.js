import {t} from '../utilities/i18n'
import React from 'react'
import {getTurnInfo, getCp, getPlayerTotals, getUnderdog, STATUS_FINISHED, MAX_ROUNDS} from './gameModel'

import map from 'lodash/map'
import find from 'lodash/find'

import Styles from './styles/GameScreen.module.css'

const dataBase = require('../utilities/db')

// Баннер партии: две армии друг против друга, очки, CP и underdog. Ход игрока подсвечен золотом
const GameBanner = ({game, winner = null, onSpendCp, onGainCp}) => {
    const turn = getTurnInfo(game)
    const finished = game.status === STATUS_FINISHED
    const underdog = getUnderdog(game, (turn.round - 1) * 2)

    const renderSide = (player, index) => {
        const faction = find(dataBase.data.faction_keyword, ['id', player.army?.allegianceId])
        const image = faction?.moreInfoImage || faction?.selectFactionImage
        const isActive = !finished && turn.playerIndex === index
        return <div className={`${Styles.side} ${isActive ? Styles.sideActive : ''} ${finished && winner === index ? Styles.sideWinner : ''}`} key={index}>
            {image ? <img className={Styles.sideImage} src={image} alt='' /> : null}
            <span className={Styles.sideShade} />
            <div className={Styles.sideContent}>
                <span className={Styles.sideName}>{player.name}</span>
                <span className={Styles.sideArmy}>{player.army?.allegiance}</span>
                <span className={Styles.sideVp}>{getPlayerTotals(game, index).total}</span>
                <span className={Styles.sideVpLabel}>{t('VP')}</span>
                {!finished && underdog === index ? <span className={Styles.badge}>{t('Underdog')}</span> : null}
                <div className={Styles.cpRow}>
                    {finished ? null : <button type='button' className={Styles.cpButton} onClick={() => onSpendCp(index, -1)} aria-label={t('Spend 1 CP')}>−</button>}
                    <span className={Styles.cpValue}>{getCp(game, index)} {t('CP')}</span>
                    {finished ? null : <button type='button' className={Styles.cpButton} onClick={() => onSpendCp(index, 1)} aria-label={t('Gain 1 CP')}>+</button>}
                </div>
            </div>
        </div>
    }

    return <div className={Styles.banner}>
        <div className={Styles.status}>{finished ? t('Battle finished') : t('Round {{round}} of {{total}}', {round: turn.round, total: MAX_ROUNDS})}</div>
        <div className={Styles.sides}>
            {map(game.players, renderSide)}
            <span className={Styles.vs}>{t('vs')}</span>
        </div>
    </div>
}

export default GameBanner
