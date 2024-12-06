import React from 'react'
import {useNavigate} from 'react-router-dom'
import {singlePlayer} from '../utilities/appState'
import Minus from '../icons/minus.svg'
import Plus from '../icons/plus.svg'
import Book from '../icons/book.svg'

import './styles/PlayerInfo.css'

const PlayerInfo = ({player, onUpdate}) => {
    const navigate = useNavigate()

    const handleClickMinusCP = () => {
        singlePlayer[player].cp = singlePlayer[player].cp - 1
        onUpdate()
    }

    const handleClickPlusCP = () => {
        singlePlayer[player].cp = singlePlayer[player].cp + 1
        onUpdate()
    }

    const handleClickAllegiance = () => {
        navigate('army', {state: {allegianceId: singlePlayer[player].allegiance.id}})
    }

    return <div id='playerInfo'>
        <button id='playerInfoTitleContainer' onClick={handleClickAllegiance}>
            <div>
                <p id='playerInfoName'>{player === 'firstPlayer' ? '1st' : '2nd'} Player</p>
                <p id='playerInfoArmy'>{singlePlayer[player].allegiance?.name}</p>
            </div>
            <div id='playerInfoArmyIcon'><img src={Book} alt="" /></div>
        </button>
        <div id='playerInfoContent'>
            <p id='playerInfoText'>Score</p>
            <div id='playerInfoScoreContainer'>
                <p id='playerInfoScoreText'>{singlePlayer[player].vp}</p>
            </div>
            <p id='playerInfoText'>Command Points</p>
            <div id='cpContainer'>
                <div>
                    <div id='cpSubContainer'>
                        <button id='cpIcon' onClick={handleClickMinusCP}><img src={Minus} alt="" /></button>
                        <p id='cp'>{singlePlayer[player].cp}</p>
                        <button id='cpIcon' onClick={handleClickPlusCP}><img src={Plus} alt="" /></button>
                    </div>
                    {singlePlayer.underdog === player ? <p id='underdog'>Underdog</p> : null}
                </div>
            </div>
        </div>
    </div>
}

export default PlayerInfo