import React from 'react';
import {useLocation, Link } from 'react-router-dom'
import './styles/Catalog.css'

const alligances = {
    Chaos: ['Beasts', 'Khorne', 'Tzeentch', 'Slaanesh', 'Nurgle', 'Skaven', 'Slaves'],
    Death: [],
    Destruction: [],
    Order: []
}

const Catalog = () => {
    const chapter = useLocation().state.chapter
    const alligance = alligances[chapter]

    const renderButton = (alligance) => <Link to={'army'} state={{alligance}}>{alligance}</Link>

    return <>
        <p className='title'>{chapter}</p>
        <div id='column' className='Chapter'>
        {alligance && alligance.map(renderButton)}
        </div>
    </>
}

export default Catalog