import React from 'react'
import {useNavigate} from 'react-router-dom'
import Button from '../components/Button'
import InfoIcon from '../icons/InfoIcon'
import {gameDraft, pickRandomMission, getDraftIssues, startGame} from './gameDraft'
import {MISSIONS} from './missionData'
import {getMissionTitle} from './missionInfo'

import map from 'lodash/map'

import Styles from './styles/Dashboard.module.css'

// Шаг 2: выбор одной из 12 миссий (Battleplans 2026-27) или случайной, затем старт партии
const GameMission = () => {
    const navigate = useNavigate()
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    const handleStart = () => {
        if (getDraftIssues().length) return
        const game = startGame()
        navigate('/game', {replace: true, state: {title: 'Battle', gameId: game.id}})
    }

    return <div className={Styles.page}>
        <div className={Styles.gap}>
            {map(MISSIONS, mission => {
                const {name, subtitle} = getMissionTitle(mission.id)
                return <div key={mission.id} className={`${Styles.mission} ${gameDraft.missionId === mission.id ? Styles.missionActive : ''}`}>
                    <button type='button' className={Styles.missionBody} onClick={() => { gameDraft.missionId = mission.id; forceUpdate() }}>
                        <span className={Styles.missionName}>{name}</span>
                        <span className={Styles.missionTable}>{subtitle}</span>
                    </button>
                    <button type='button' className={Styles.missionInfo} aria-label='Battleplan rules'
                        onClick={() => navigate('/battleplan', {state: {title: name, battleplan: {id: mission.id, name}}})}><InfoIcon size={22} /></button>
                </div>
            })}
        </div>
        <Button type='secondary' onClick={() => { gameDraft.missionId = pickRandomMission(); forceUpdate() }}>Random battleplan</Button>
        <div className={Styles.bottomBar}><Button disabled={!gameDraft.missionId} onClick={handleStart}>Start battle</Button></div>
    </div>
}

export default GameMission
