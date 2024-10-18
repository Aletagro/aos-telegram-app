import React from 'react';
import {useLocation, Link } from 'react-router-dom'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const Catalog = () => {
    const grandAlliance = useLocation().state.grandAlliance
    const allegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === grandAlliance.id)

    const renderButton = (alligance) => <Link to={'army'} state={{alligance}}>{alligance.name}</Link>

    return <>
        <p className='title'>{grandAlliance.name}</p>
        <div id='column' className='Chapter'>
        {allegiances && allegiances.map(renderButton)}
        </div>
    </>
}

export default Catalog