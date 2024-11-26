import React from 'react';
import {useNavigate} from 'react-router-dom';
import './styles/Row.css'

const Row = ({title, subtitle, navigateTo, state}) => {
    const navigate = useNavigate()

    const handleClick = () => navigate(navigateTo, {state: {title, ...state}})

    return <div className='container'>
        <button  className='rowButton' onClick={handleClick}>
            <p id='title'>{title}</p>
            {subtitle ? <p id='subtitle'>{subtitle}</p> : null}
        </button>
    </div>
}

export default Row