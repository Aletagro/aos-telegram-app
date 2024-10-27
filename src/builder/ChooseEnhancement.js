import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster} from '../utilities/appState'
import './styles/ChooseEnhancement.css'

const ChooseEnhancement = () => {
    const {data, type, unitIndex, regimentIndex, title, isRosterInfo} = useLocation().state
    const navigate = useNavigate()

    const handleClickEnhancement = (enhancementName) => () => {
        if (isRosterInfo) {
            roster[type] = enhancementName
        } else {
            const newUnit = {...roster.regiments[regimentIndex].units[unitIndex], [type]: enhancementName}
            roster.regiments[regimentIndex].units[unitIndex] = newUnit
        }
        navigate(-1)
    }

    const handleDeleteEnhancement = () => {
        if (isRosterInfo) {
            roster[type] = ''
        } else {
            const newUnit = {...roster.regiments[regimentIndex].units[unitIndex], [type]: ''}
            roster.regiments[regimentIndex].units[unitIndex] = newUnit
        }
        navigate(-1)
    }

    const renderEnhancement = (enhancement) =>
        <button id='chooseEnhancement' onClick={handleClickEnhancement(enhancement.name)}>{enhancement.name}</button>

    return  <div id='column' className='Chapter'>
        {data.map(renderEnhancement)}
        <button id='deleteEnhancement' onClick={handleDeleteEnhancement}>Delete {title}</button>
    </div>
}

export default ChooseEnhancement