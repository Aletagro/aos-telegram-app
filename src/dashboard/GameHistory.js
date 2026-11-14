import {t} from '../utilities/i18n'
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

const getArmyName = (id) => find(dataBase.data.faction_keyword, ['id', id])?.name || t('Unknown army')

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
                <thead><tr><th /><th>{t('Battles')}</th><th>{t('Wins')}</th><th>{t('Draws')}</th><th>{t('Losses')}</th></tr></thead>
                <tbody>{map(groups, group => <tr key={group.key}>
                    <td>{getLabel(group.key)}</td><td>{group.games}</td><td>{group.wins}</td><td>{group.draws}</td><td>{group.losses}</td>
                </tr>)}</tbody>
            </table>
        </div>
        : null

    const renderTactics = () => stats.byTactic.length
        ? <div className={Styles.card}>
            <h4 className={Styles.cardTitle}>{t('Tactic cards')}</h4>
            <table className={Styles.statsTable}>
                <thead><tr><th /><th>{t('Picked')}</th><th>{t('Avg VP')}</th></tr></thead>
                <tbody>{map(stats.byTactic, group => <tr key={group.key}><td>{getTacticCard(group.key)?.name}</td><td>{group.games}</td><td>{group.avg}</td></tr>)}</tbody>
            </table>
        </div>
        : null

    const renderStats = () => <div className={Styles.gap}>
        <div className={Styles.statsGrid}>
            {map([[t('Battles'), stats.total], [t('Win rate'), `${stats.winRate}%`], [t('Wins'), stats.wins], [t('Draws'), stats.draws], [t('Losses'), stats.losses]], ([label, value]) => <div className={Styles.statTile} key={label}>
                <span className={Styles.statValue}>{value}</span>
                <span className={Styles.statLabel}>{label}</span>
            </div>)}
            <div className={Styles.statTile}>
                <span className={Styles.statValue}>{stats.avgFor} : {stats.avgAgainst}</span>
                <span className={Styles.statLabel}>{t('Average VP')}</span>
            </div>
        </div>
        {renderGroups(t('By army'), stats.byArmy, getArmyName)}
        {renderGroups(t('Against'), stats.byOpponent, getArmyName)}
        {renderGroups(t('By battleplan'), stats.byMission, id => getMissionTitle(id).name)}
        {renderTactics()}
        <p className={Styles.muted}>{t('Statistics count the first player of each battle as you.')}</p>
    </div>

    return <div className={Styles.page}>
        <div className={Styles.tabs}>
            <button type='button' className={`${Styles.tab} ${tab === TAB_HISTORY ? Styles.tabActive : ''}`} onClick={() => setTab(TAB_HISTORY)}>{t('History')}</button>
            <button type='button' className={`${Styles.tab} ${tab === TAB_STATS ? Styles.tabActive : ''}`} onClick={() => setTab(TAB_STATS)}>{t('Statistics')}</button>
        </div>
        {!finished.length
            ? <p className={Styles.muted}>{t('No finished battles yet')}</p>
            : tab === TAB_HISTORY
                ? <div className={Styles.gap}>
                    {map(finished, game => <GameCard key={game.id} game={game} onDelete={setToDelete} />)}
                    <p className={Styles.muted}>{t('Battles are stored on this device. When the storage is full, the oldest finished battles are removed.')}</p>
                </div>
                : renderStats()
        }
        <Modal visible={Boolean(toDelete)} title={t('Delete battle?')} onClose={() => setToDelete(null)}
            Content={() => <div className={Styles.gap}>
                <p className={Styles.text}>{toDelete ? `${toDelete.players[0].name} vs ${toDelete.players[1].name}` : ''}</p>
                <ModalActions>
                    <ModalButton onClick={() => setToDelete(null)}>{t('No')}</ModalButton>
                    <ModalButton type='danger' onClick={handleDelete}>{t('Yes')}</ModalButton>
                </ModalActions>
            </div>} />
    </div>
}

export default GameHistory
