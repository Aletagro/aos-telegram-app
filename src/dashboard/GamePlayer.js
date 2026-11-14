import React from 'react'
import {
    getMissionItems, isMissionItemScored, isMissionItemBlocked, toggleMissionItem, addManualVp, getTurnInfo, getTurnPlayer
} from './gameModel'
import GameTactic from './GameTactic'

import map from 'lodash/map'
import sumBy from 'lodash/sumBy'
import filter from 'lodash/filter'

import Styles from './styles/GameScreen.module.css'

// Блок игрока: очки миссии за ход и карточки тактик. Редактируется только у того, чей ход
const GamePlayer = ({game, index, apply}) => {
    const turn = getTurnInfo(game)
    const player = game.players[index]
    const active = turn.playerIndex === index
    const items = getMissionItems(game, turn.round)
    const manual = sumBy(filter(game.scores, s => s.player === index && s.turn === game.turn && s.kind === 'manual'), 'vp')

    const renderItem = (item) => {
        const checked = active && isMissionItemScored(game, index, item.id)
        return <div className={Styles.row} key={item.id}>
            <p className={Styles.rowText}><b>{item.vp} VP</b> · {item.label}</p>
            <button type='button' className={`${Styles.check} ${checked ? Styles.checkOn : ''}`} disabled={!active || (!checked && isMissionItemBlocked(game, index, item.id))} aria-label='Scored'
                onClick={() => apply(current => toggleMissionItem(current, index, item.id))}>{checked ? '✓' : ''}</button>
        </div>
    }

    return <div id={active ? 'active-player-block' : undefined} className={Styles.playerBlock}>
        <div className={`${Styles.card} ${active ? Styles.cardActive : ''}`}>
            <div className={Styles.row}>
                <h4 className={Styles.cardTitle}>{player.name}</h4>
                <span className={Styles.cardSub}>{active ? 'Scoring this turn' : getTurnPlayer(game, game.turn) === null ? '' : 'Waiting'}</span>
            </div>
            {active ? <>
                {map(items, renderItem)}
                <div className={Styles.divider} />
                <div className={Styles.row}>
                    <p className={Styles.rowText}>Other VP (manual)</p>
                    <div className={Styles.stepper}>
                        <button type='button' className={Styles.stepButton} onClick={() => apply(current => addManualVp(current, index, -1))}>−</button>
                        <span className={Styles.stepValue}>{manual}</span>
                        <button type='button' className={Styles.stepButton} onClick={() => apply(current => addManualVp(current, index, 1))}>+</button>
                    </div>
                </div>
            </> : <p className={Styles.cardSub}>Controls are available on this player's turn.</p>}
        </div>
        {map(player.tactics, cardId => <GameTactic key={cardId} game={game} index={index} cardId={cardId} apply={apply} />)}
    </div>
}

export default GamePlayer
