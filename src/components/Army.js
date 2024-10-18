import React from 'react';
import {useLocation, Link } from 'react-router-dom'
import './styles/Army.css'

const items = [
    {
        title: 'Warscrolls',
        screen: 'units'
    },
    {
        title: 'Battle Traits',
        screen: 'info'
    },
    {
        title: 'Formations',
        screen: 'info'
    },
    {
        title: 'Artefacts',
        screen: 'info'
    },
    {
        title: 'Traits',
        screen: 'info'
    },
    {
        title: 'Spell Lores',
        screen: 'info'
    },
    {
        title: 'Manifestation Lores',
        screen: 'info'
    },
    {
        title: 'Prayes Lores',
        screen: 'info'
    }
]

const Army = () => {
    const alligance = useLocation().state.alligance

    const renderButton = (item) => <Link to={item.screen} state={{alligance}}>{item.title}</Link>

    return <>
        <p className='title'>{alligance.name}</p>
        <div id='column' className='Chapter'>
        {items.map(renderButton)}
        </div>
    </>
}

export default Army