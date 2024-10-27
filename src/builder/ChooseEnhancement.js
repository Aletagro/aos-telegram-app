import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster} from '../utilities/appState'
import './styles/ChooseEnhancement.css'

const ChooseEnhancement = () => {
    const {data, type, unitIndex, regimentIndex} = useLocation().state
    const navigate = useNavigate()

    const handleClickenhancement = (enhancementName) => () => {
        const newUnit = {...roster.regiments[regimentIndex].units[unitIndex], [type]: enhancementName}
        roster.regiments[regimentIndex].units[unitIndex] = newUnit
        navigate(-1)
    }

    const renderEnhancement = (enhancement) => <div key={enhancement.name}  id='chooseLoreContainer'>
        <p>{enhancement.name}</p>
        <input
            type='radio'
            name={type}
            value={enhancement.name}
            checked={enhancement.name === roster.regiments[regimentIndex].units[unitIndex][type]}
            onChange={handleClickenhancement(enhancement.name)}
        />
    </div>

    return  <div id='column' className='Chapter'>
        {data.map(renderEnhancement)}
    </div>
}

export default ChooseEnhancement