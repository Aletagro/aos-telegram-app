import React from 'react';
import {Link} from 'react-router-dom'
import './styles/Main.css'

const chambers = ['Core Book', "General's Handbook", 'Chaos', 'Death', 'Destruction', 'Order']

const Main = () => {

    const renderButton = (chapter) => <Link to={'catalog'} state={{chapter}}>{chapter}</Link>

    return <>
        <p className='title'>Age of Sigmar</p>
        <div id='column' className='Chapter'>
        {chambers.map(renderButton)}
        </div>
    </>
}

export default Main