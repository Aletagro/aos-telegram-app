import {t} from '../utilities/i18n'
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Button from '../components/Button'
import Modal from '../components/Modal'
import {ModalActions, ModalButton} from '../components/ModalActions'
import {resetGameDraft} from './gameDraft'
import {loadGames, deleteGame, MAX_PLAYING} from './gameStorage'
import GameCard from './GameCard'
import {STATUS_PLAYING, STATUS_FINISHED} from './gameModel'

import map from 'lodash/map'
import filter from 'lodash/filter'

import Styles from './styles/Dashboard.module.css'

// Вход в дашборд: новая партия и недоигранные партии
const Dashboard = () => {
    const navigate = useNavigate()
    const [games, setGames] = useState(() => filter(loadGames(), ['status', STATUS_PLAYING]))
    const [toDelete, setToDelete] = useState(null)
    const finishedCount = filter(loadGames(), ['status', STATUS_FINISHED]).length

    const handleNew = () => {
        resetGameDraft()
        navigate('/gameSetup', {state: {title: t('New battle')}})
    }

    const handleDelete = () => {
        deleteGame(toDelete.id)
        setGames(current => filter(current, game => game.id !== toDelete.id))
        setToDelete(null)
    }

    return <div className={Styles.page}>
        <Button onClick={handleNew}>{t('New battle')}</Button>
        <button type='button' className={Styles.historyLink} onClick={() => navigate('/gameHistory', {state: {title: t('History and statistics')}})}>
            <b>{t('History and statistics')}</b>
            <span className={Styles.historyCount}>{finishedCount ? t('{{count}} battle|{{count}} battles', {count: finishedCount}) : ''}</span>
        </button>
        {games.length ? <>
            <p className={Styles.sectionTitle}>{t('Unfinished battles')}</p>
            <div className={Styles.gap}>{map(games, game => <GameCard key={game.id} game={game} onDelete={setToDelete} />)}</div>
            {games.length >= MAX_PLAYING ? <p className={Styles.muted}>{t('Up to {{count}} unfinished battles are kept. Starting a new one removes the oldest.', {count: MAX_PLAYING})}</p> : null}
        </> : <p className={Styles.muted}>{t('Track victory points, tactic cards and command points of a battle. Unfinished battles stay here.')}</p>}
        <Modal visible={Boolean(toDelete)} title={t('Delete battle?')} onClose={() => setToDelete(null)}
            Content={() => <ModalActions>
                <ModalButton onClick={() => setToDelete(null)}>{t('No')}</ModalButton>
                <ModalButton type='danger' onClick={handleDelete}>{t('Yes')}</ModalButton>
            </ModalActions>} />
    </div>
}

export default Dashboard
