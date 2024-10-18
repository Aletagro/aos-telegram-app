import React from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const Catalog = () => {
    const navigate = useNavigate()
    const grandAlliance = useLocation().state.grandAlliance
    const allegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === grandAlliance.id)

    const renderButton = (alligance) => <Link key={alligance.id} to={'army'} state={{alligance}}>{alligance.name}</Link>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <p className='title'>{grandAlliance.name}</p>
        <div id='column' className='Chapter'>
        {allegiances && allegiances.map(renderButton)}
        </div>
    </>
}

export default Catalog