import React from 'react';
import {useLocation} from 'react-router-dom'
import Row from '../components/Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const Catalog = () => {
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

    const renderRow = (alligance) => <Row
        key={alligance.id}
        title={alligance.name}
        navigateTo='army'
        state={{alligance}}
    />

    return <>
        <img src={grandAlliance.image} alt={grandAlliance.name} width='100%' />
        <div id='column' className='Chapter'>
            {allegiances && allegiances.map(renderRow)}
        </div>
    </>
}

export default Catalog