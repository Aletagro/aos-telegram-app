import {t} from '../utilities/i18n'
import React, {useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Button from '../components/Button'
import InfoIcon from '../icons/InfoIcon'
import Modal from '../components/Modal'
import ImageCard from '../components/ImageCard'
import GameBanner from './GameBanner'
import GamePlayer from './GamePlayer'
import GameResult from './GameResult'
import {getGame, saveGame} from './gameStorage'
import {advanceTurn, undo, canUndo, spendCp, adjustCp, setRoundFirst, getTurnInfo, getResult, getPlayerTotals, STATUS_FINISHED, MAX_ROUNDS} from './gameModel'
import {getMissionTitle} from './missionInfo'

import map from 'lodash/map'
import find from 'lodash/find'

import Styles from './styles/GameScreen.module.css'

const dataBase = require('../utilities/db')

// Экран партии: баннер со счётом, CP и underdog, выбор первого игрока раунда, блоки игроков, переход хода и отмена
const Game = () => {
    const navigate = useNavigate()
    const gameId = useLocation().state?.gameId
    const [game, setGame] = useState(() => getGame(gameId))
    // Победитель ролл-офф в окне выбора первого игрока (со второго раунда выбор идёт в два шага)
    const [rollWinner, setRollWinner] = useState(null)

    // При смене хода экран прокручивается к блоку игрока, чей ход (блоки игроков не меняются местами)
    const turnKey = game ? `${game.turn}:${getTurnInfo(game).playerIndex}` : ''
    const previous = useRef(turnKey)
    useEffect(() => {
        if (previous.current === turnKey) return
        previous.current = turnKey
        if (turnKey.endsWith(':null')) return
        // Первый ход раунда - наверх экрана, второй - к блоку игрока, чей ход
        if (game.turn % 2 === 0) {
            window.scrollTo({top: 0, behavior: 'smooth'})
        } else {
            setTimeout(() => document.getElementById('active-player-block')?.scrollIntoView({behavior: 'smooth', block: 'start'}), 80)
        }
    }, [turnKey, game])

    // Партия закончилась - наверх экрана, чтобы сразу был виден баннер с итогом
    const isFinished = game?.status === STATUS_FINISHED
    const wasFinished = useRef(isFinished)
    useEffect(() => {
        if (isFinished && !wasFinished.current) window.scrollTo({top: 0, behavior: 'smooth'})
        wasFinished.current = isFinished
    }, [isFinished])

    if (!game) return <div className={Styles.body}><p className={Styles.muted}>{t('Battle not found')}</p></div>

    const turn = getTurnInfo(game)
    const finished = game.status === STATUS_FINISHED
    // Со второго раунда сначала спрашиваем, кто выиграл ролл-офф: от этого зависит, захват это инициативы или отданный первый ход
    const askWinner = turn.round > 1 && rollWinner === null
    const mission = getMissionTitle(game.missionId)

    // Применяет изменение к партии и сразу сохраняет её на устройстве
    const apply = (fn) => {
        setGame(current => {
            const next = fn(current)
            if (next !== current) saveGame(next)
            return next
        })
    }

    const handleCp = (index, delta) => apply(current => delta < 0 ? spendCp(current, index, 1, 'manual') : adjustCp(current, index, 1))
    const totals = [getPlayerTotals(game, 0), getPlayerTotals(game, 1)]
    const nextLabel = turn.turn === MAX_ROUNDS * 2 - 1 ? t('Finish battle') : t('Next turn')

    const renderRosters = () => {
        const items = filter2(game.players)
        if (!items.length) return null
        return <div className={Styles.rosters}>
            <h4 className={Styles.cardTitle}>{t('Army lists')}</h4>
            {map(items, ({player, index}) => <ImageCard key={index} title={player.army.name}
                image={find(dataBase.data.faction_keyword, ['id', player.army.allegianceId])?.selectFactionImage}
                onClick={() => navigate('/viewRoster', {state: {title: player.army.name, gameId: game.id, playerIndex: index}})} />)}
        </div>
    }

    return <div className={Styles.page}>
        <GameBanner game={game} winner={finished ? getResult(game).winner : null} onSpendCp={handleCp} />
        {finished ? <GameResult game={game} /> : <div className={Styles.body}>
            <button type='button' className={Styles.missionLink} onClick={() => navigate('/battleplan', {state: {title: mission.name, battleplan: {id: game.missionId, name: mission.name}}})}>
                <span><b>{mission.name}</b></span><InfoIcon size={24} className={Styles.infoIcon} />
            </button>
            {turn.needsFirst ? <p className={Styles.cardSub} style={{textAlign: 'center'}}>{t('Choose who goes first this round')}</p>
                : <p className={Styles.turnLine}>{t('Turn of')} <b>{game.players[turn.playerIndex].name}</b></p>}
            {map(game.players, (player, index) => <GamePlayer key={index} game={game} index={index} apply={apply} />)}
            <div className={Styles.card}>
                <h4 className={Styles.cardTitle}>{t('Score')}</h4>
                <table className={Styles.table}>
                    <thead><tr><th /><th>{game.players[0].name}</th><th>{game.players[1].name}</th></tr></thead>
                    <tbody>
                        {map([1, 2, 3, 4, 5].slice(0, turn.round), r => <tr key={r}><td>{t('Round')} {r}</td><td>{totals[0].rounds[r - 1]}</td><td>{totals[1].rounds[r - 1]}</td></tr>)}
                        <tr className={Styles.total}><td>{t('Total')}</td><td>{totals[0].total}</td><td>{totals[1].total}</td></tr>
                    </tbody>
                </table>
            </div>
            {renderRosters()}
        </div>}
        <Modal visible={!finished && turn.needsFirst} title={t('Round {{round}}: who goes first?', {round: turn.round})}
            onClose={() => apply(current => setRoundFirst(current, getTurnInfo(current).round, 0))}
            Content={() => <div className={Styles.body} style={{padding: 0}}>
                {askWinner
                    ? <>
                        <p className={Styles.cardSub}><b>{t('Who won the roll-off?')}</b></p>
                        <div className={Styles.firstButtons}>
                            {map(game.players, (player, index) => <Button key={index} onClick={() => setRollWinner(index)}>{player.name}</Button>)}
                        </div>
                    </>
                    : <>
                        {turn.round > 1 ? <p className={Styles.cardSub}><b>{t('{{name}} won the roll-off. Who goes first?', {name: game.players[rollWinner].name})}</b></p> : null}
                        <div className={Styles.firstButtons}>
                            {map(game.players, (player, index) => <Button key={index} onClick={() => {
                                apply(current => setRoundFirst(current, getTurnInfo(current).round, index, rollWinner))
                                setRollWinner(null)
                            }}>{player.name}</Button>)}
                        </div>
                        {turn.round > 1 ? <Button type='secondary' onClick={() => setRollWinner(null)}>{t('Back')}</Button> : null}
                    </>
                }
            </div>} />
        <div className={Styles.bottomBar}>
            <Button type='secondary' disabled={!canUndo(game)} onClick={() => apply(undo)}>{finished ? t('Reopen battle') : t('Undo')}</Button>
            <div className={Styles.grow}>
                {finished
                    ? <Button onClick={() => navigate('/dashboard', {replace: true, state: {title: 'Battle Dashboard'}})}>{t('Close')}</Button>
                    : <Button disabled={turn.needsFirst} onClick={() => apply(current => advanceTurn(current))}>{nextLabel}</Button>}
            </div>
        </div>
    </div>
}

// Игроки, у которых есть полный список (сохранённый или по коду)
const filter2 = (players) => players.map((player, index) => ({player, index})).filter(({player}) => player.army?.snapshot)

export default Game
