import React from 'react'
import {useLocation} from 'react-router-dom'
import RosterEasy from '../components/RosterEasy'
import {getGame} from './gameStorage'

import Styles from './styles/GameScreen.module.css'

// Список игрока партии только для чтения (сохранённый или по коду)
const ViewRoster = () => {
    const {gameId, playerIndex} = useLocation().state || {}
    const snapshot = getGame(gameId)?.players[playerIndex]?.army?.snapshot
    return <div id='column' className='Chapter'>
        {snapshot ? <RosterEasy roster={snapshot} /> : <p className={Styles.muted}>The list is not available</p>}
    </div>
}

export default ViewRoster
