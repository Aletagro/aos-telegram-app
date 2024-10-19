import React from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const Catalog = () => {
    const navigate = useNavigate()
    const grandAlliance = useLocation().state.grandAlliance
    let allegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === grandAlliance.id)
    // нужно чтобы орков разделить на отдельные книги
    if (grandAlliance.name === 'Destruction') {
        const orrukWarclansId = allegiances.find(alligance => alligance.name === 'Orruk Warclans')?.id
        const orrukAllegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === orrukWarclansId && !faction.armyOfRenown)
        allegiances = [...allegiances, ...orrukAllegiances]
        allegiances = allegiances.filter(alligance => alligance.name !== 'Orruk Warclans')
    }
    allegiances.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    const renderButton = (alligance) => <Link key={alligance.id} to={'army'} state={{alligance}}>{alligance.name}</Link>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <p className='title'>{grandAlliance.name}</p>
        <img src={grandAlliance.image} alt={grandAlliance.name} width='100%' />
        <div id='column' className='Chapter'>
        {allegiances && allegiances.map(renderButton)}
        </div>
    </>
}

export default Catalog