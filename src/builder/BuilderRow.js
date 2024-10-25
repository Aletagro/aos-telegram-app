import React from 'react';
import {useNavigate} from 'react-router-dom';
import './styles/BuilderRow.css'

const BuilderRow = ({title, onClick, state, navigateTo}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClick) {
            onClick(state)
        }
        navigate(navigateTo, {state: {title, ...state}})
    }

    return <div className='container'>
        <button  className='builderRow' onClick={handleClick}>
            <p id='title'>{title}</p>
        </button>
    </div>
}

export default BuilderRow