import React from 'react';
import {useNavigate} from 'react-router-dom';
import './styles/Row.css'

const Row = ({title, navigateTo}) => {
    const navigate = useNavigate()

    const handleClick = () => navigate(navigateTo)

    return <div class='container'>
        <button  class='button' onClick={handleClick}>
            <p id='title'>{title}</p>
        </button>
    </div>
}

export default Row