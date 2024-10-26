import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster} from './roster'
import './styles/ChooseEnhancement.css'

const ChooseEnhancement = () => {
    const {data, type, index} = useLocation().state
    const navigate = useNavigate()

    const handleClickenhancement = (enhancementName) => () => {
        roster.regiments[index][type] = enhancementName
        navigate(-1)
    }

    const renderEnhancement = (enhancement) => <div key={enhancement.name}  id='chooseLoreContainer'>
        <p>{enhancement.name}</p>
        <input
            type='radio'
            name={type}
            value={enhancement.name}
            checked={enhancement.name === roster.regiments[index][type]}
            onChange={handleClickenhancement(enhancement.name)}
        />
    </div>

    return  <div id='column' className='Chapter'>
        {data.map(renderEnhancement)}
    </div>
}

export default ChooseEnhancement