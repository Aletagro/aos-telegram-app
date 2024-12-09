import React from 'react';
import {useNavigate} from 'react-router-dom';
import RowImage from '../components/RowImage'
import './styles/Row.css'

const Row = ({title, subtitle, image, navigateTo, state, onClick}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(navigateTo, {state: {title, ...state}})
        if (onClick) {
            onClick()
        }
    }

    return <div className='container'>
        <button  className='rowButton' onClick={handleClick}>
            {image ?<RowImage src={image} alt={title} /> : null}
            <b id='title'>{title}</b>
            {subtitle ? <p id='subtitle'>{subtitle}</p> : null}
        </button>
    </div>
}

export default Row