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
        navigate('/gameSetup', {state: {title: 'New battle'}})
    }

    const handleDelete = () => {
        deleteGame(toDelete.id)
        setGames(current => filter(current, game => game.id !== toDelete.id))
        setToDelete(null)
    }

    return <div className={Styles.page}>
        <Button onClick={handleNew}>New battle</Button>
        <button type='button' className={Styles.historyLink} onClick={() => navigate('/gameHistory', {state: {title: 'History and statistics'}})}>
            <b>History and statistics</b>
            <span className={Styles.historyCount}>{finishedCount ? `${finishedCount} ${finishedCount === 1 ? 'battle' : 'battles'}` : ''}</span>
        </button>
        {games.length ? <>
            <p className={Styles.sectionTitle}>Unfinished battles</p>
            <div className={Styles.gap}>{map(games, game => <GameCard key={game.id} game={game} onDelete={setToDelete} />)}</div>
            {games.length >= MAX_PLAYING ? <p className={Styles.muted}>Up to {MAX_PLAYING} unfinished battles are kept. Starting a new one removes the oldest.</p> : null}
        </> : <p className={Styles.muted}>Track victory points, tactic cards and command points of a battle. Unfinished battles stay here.</p>}
        <Modal visible={Boolean(toDelete)} title='Delete battle?' onClose={() => setToDelete(null)}
            Content={() => <ModalActions>
                <ModalButton onClick={() => setToDelete(null)}>No</ModalButton>
                <ModalButton type='danger' onClick={handleDelete}>Yes</ModalButton>
            </ModalActions>} />
    </div>
}

export default Dashboard
