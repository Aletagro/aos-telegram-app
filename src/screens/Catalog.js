import React from 'react';
import {useLocation} from 'react-router-dom'
import {sortByName} from '../utilities/utils'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const Catalog = () => {
    const {grandAlliance} = useLocation().state
    let allegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === grandAlliance.id)
    // нужно чтобы орков разделить на отдельные книги
    if (grandAlliance.name === 'Destruction') {
        const orrukWarclansId = allegiances.find(allegiance => allegiance.name === 'Orruk Warclans')?.id
        const orrukAllegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === orrukWarclansId && !faction.armyOfRenown)
        allegiances = [...allegiances, ...orrukAllegiances]
        allegiances = allegiances.filter(allegiance => allegiance.name !== 'Orruk Warclans')
    }
    sortByName(allegiances)

    const renderRow = (allegiance) => <Row
        key={allegiance.id}
        title={allegiance.name}
        navigateTo='army'
        state={{allegiance, grandAlliance: grandAlliance.name}}
    />

    return <>
        <HeaderImage src={grandAlliance.image} alt={grandAlliance.name} isWide />
        <div id='column' className='Chapter'>
            {allegiances && allegiances.map(renderRow)}
        </div>
    </>
}

export default Catalog