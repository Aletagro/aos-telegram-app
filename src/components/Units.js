import React from 'react';
import {useLocation, Link } from 'react-router-dom'
import './styles/Army.css'

const armies = {
    Beasts: ['Beastlord', 'Doombull', 'Dragon Ogor Shaggoth'],
}

const Units = () => {
    const state = useLocation().state
    const units = armies[state.alligance]

    const renderButton = (unit) => <Link to={'warscroll'} state={{unit}}>{unit}</Link>

    return <>
        <p className='title'>{state.alligance}</p>
        <div id='column' className='Chapter'>
        {units && units.map(renderButton)}
        </div>
    </>
}

export default Units