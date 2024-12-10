import React from 'react';
import {useNavigate} from 'react-router-dom';
import RowImage from '../components/RowImage'

import Styles from './styles/Row.module.css'

const Row = ({title, subtitle, image, navigateTo, state, onClick}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(navigateTo, {state: {title, ...state}})
        if (onClick) {
            onClick()
        }
    }

    return <button  id={Styles.container} onClick={handleClick}>
        {image ?<RowImage src={image} alt={title} /> : null}
        <b id={Styles.title}>{title}</b>
        {subtitle ? <p id={Styles.subtitle}>{subtitle}</p> : null}
    </button>
}

export default Row