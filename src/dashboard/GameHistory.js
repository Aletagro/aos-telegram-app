import React, {useState} from 'react'
import Modal from '../components/Modal'
import {ModalActions, ModalButton} from '../components/ModalActions'
import GameCard from './GameCard'
import {loadGames, deleteGame} from './gameStorage'
import {getStats, getFinishedGames} from './gameStats'
import {getTacticCard} from './missionData'
import {getMissionTitle} from './missionInfo'

import map from 'lodash/map'
import find from 'lodash/find'

import Styles from './styles/Dashboard.module.css'

const dataBase = require('../utilities/db')

const TAB_HISTORY = 'history'
const TAB_STATS = 'stats'

const getArmyName = (id) => find(dataBase.data.faction_keyword, ['id', id])?.name || 'Unknown army'

// История завершённых партий и статистика (я - первый игрок каждой партии)
const GameHistory = () => {
    const [games, setGames] = useState(() => loadGames())
    const [tab, setTab] = useState(TAB_HISTORY)
    const [toDelete, setToDelete] = useState(null)
    const finished = getFinishedGames(games)
    const stats = getStats(finished)

    const handleDelete = () => {
        deleteGame(toDelete.id)
        setGames(current => current.filter(game => game.id !== toDelete.id))
        setToDelete(null)
    }

    const renderGroups = (title, groups, getLabel) => groups.length
        ? <div className={Styles.card}>
            <h4 className={Styles.cardTitle}>{title}</h4>
            <table className={Styles.statsTable}>
                <thead><tr><th /><th>Battles</th><th>Wins</th><th>Draws</th><th>Losses</th></tr></thead>
                <tbody>{map(groups, group => <tr key={group.key}>
                    <td>{getLabel(group.key)}</td><td>{group.games}</td><td>{group.wins}</td><td>{group.draws}</td><td>{group.losses}</td>
                </tr>)}</tbody>
            </table>
        </div>
        : null

    const renderTactics = () => stats.byTactic.length
        ? <div className={Styles.card}>
            <h4 className={Styles.cardTitle}>Tactic cards</h4>
            <table className={Styles.statsTable}>
                <thead><tr><th /><th>Picked</th><th>Avg VP</th></tr></thead>
                <tbody>{map(stats.byTactic, group => <tr key={group.key}><td>{getTacticCard(group.key)?.name}</td><td>{group.games}</td><td>{group.avg}</td></tr>)}</tbody>
            </table>
        </div>
        : null

    const renderStats = () => <div className={Styles.gap}>
        <div className={Styles.statsGrid}>
            {map([['Battles', stats.total], ['Win rate', `${stats.winRate}%`], ['Wins', stats.wins], ['Draws', stats.draws], ['Losses', stats.losses]], ([label, value]) => <div className={Styles.statTile} key={label}>
                <span className={Styles.statValue}>{value}</span>
                <span className={Styles.statLabel}>{label}</span>
            </div>)}
            <div className={Styles.statTile}>
                <span className={Styles.statValue}>{stats.avgFor} : {stats.avgAgainst}</span>
                <span className={Styles.statLabel}>Average VP</span>
            </div>
        </div>
        {renderGroups('By army', stats.byArmy, getArmyName)}
        {renderGroups('Against', stats.byOpponent, getArmyName)}
        {renderGroups('By battleplan', stats.byMission, id => getMissionTitle(id).name)}
        {renderTactics()}
        <p className={Styles.muted}>Statistics count the first player of each battle as you.</p>
    </div>

    return <div className={Styles.page}>
        <div className={Styles.tabs}>
            <button type='button' className={`${Styles.tab} ${tab === TAB_HISTORY ? Styles.tabActive : ''}`} onClick={() => setTab(TAB_HISTORY)}>History</button>
            <button type='button' className={`${Styles.tab} ${tab === TAB_STATS ? Styles.tabActive : ''}`} onClick={() => setTab(TAB_STATS)}>Statistics</button>
        </div>
        {!finished.length
            ? <p className={Styles.muted}>No finished battles yet</p>
            : tab === TAB_HISTORY
                ? <div className={Styles.gap}>
                    {map(finished, game => <GameCard key={game.id} game={game} onDelete={setToDelete} />)}
                    <p className={Styles.muted}>Battles are stored on this device. When the storage is full, the oldest finished battles are removed.</p>
                </div>
                : renderStats()
        }
        <Modal visible={Boolean(toDelete)} title='Delete battle?' onClose={() => setToDelete(null)}
            Content={() => <div className={Styles.gap}>
                <p className={Styles.text}>{toDelete ? `${toDelete.players[0].name} vs ${toDelete.players[1].name}` : ''}</p>
                <ModalActions>
                    <ModalButton onClick={() => setToDelete(null)}>No</ModalButton>
                    <ModalButton type='danger' onClick={handleDelete}>Yes</ModalButton>
                </ModalActions>
            </div>} />
    </div>
}

export default GameHistory
