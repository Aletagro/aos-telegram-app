import {t} from '../utilities/i18n'
import React from 'react'
import {
    getMissionItems, isMissionItemScored, isMissionItemBlocked, toggleMissionItem, getTurnInfo, getTurnPlayer
} from './gameModel'
import GameTactic from './GameTactic'

import map from 'lodash/map'

import Styles from './styles/GameScreen.module.css'

// Блок игрока: очки миссии за ход и карточки тактик. Редактируется только у того, чей ход
const GamePlayer = ({game, index, apply}) => {
    const turn = getTurnInfo(game)
    const player = game.players[index]
    const active = turn.playerIndex === index
    const items = getMissionItems(game, turn.round)

    const renderItem = (item) => {
        const checked = active && isMissionItemScored(game, index, item.id)
        return <div className={Styles.row} key={item.id}>
            <p className={Styles.rowText}><b>{item.vp} {t('VP')}</b> · {item.label}</p>
            <button type='button' className={`${Styles.check} ${checked ? Styles.checkOn : ''}`} disabled={!active || (!checked && isMissionItemBlocked(game, index, item.id))} aria-label={t('Scored')}
                onClick={() => apply(current => toggleMissionItem(current, index, item.id))}>{checked ? '✓' : ''}</button>
        </div>
    }

    return <div id={active ? 'active-player-block' : undefined} className={Styles.playerBlock}>
        <div className={`${Styles.card} ${active ? Styles.cardActive : ''}`}>
            <div className={Styles.row}>
                <h4 className={Styles.cardTitle}>{player.name}</h4>
                <span className={Styles.cardSub}>{active ? t('Scoring this turn') : getTurnPlayer(game, game.turn) === null ? '' : t('Waiting')}</span>
            </div>
            {active ? <>
                {map(items, renderItem)}
            </> : <p className={Styles.cardSub}>{t('Controls are available on this player\'s turn.')}</p>}
        </div>
        {map(player.tactics, cardId => <GameTactic key={cardId} game={game} index={index} cardId={cardId} apply={apply} />)}
    </div>
}

export default GamePlayer
