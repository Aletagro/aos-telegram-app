import React from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom'
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
    const navigate = useNavigate()
    const alligance = useLocation().state.alligance

    const renderButton = (item) => <Link key={item.title} to={item.screen} state={{alligance}}>{item.title}</Link>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <p className='title'>{alligance.name}</p>
        <img src={alligance.factionHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
        {items.map(renderButton)}
        </div>
    </>
}

export default Army