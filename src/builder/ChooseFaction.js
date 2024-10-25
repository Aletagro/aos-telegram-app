import React from 'react';
import {useLocation} from 'react-router-dom'
import {roster} from './roster'
import BuilderRow from './BuilderRow'
import {sortByName} from '../utilities/utils'
import './styles/ChooseFaction.css'

const dataBase = require('../dataBase.json')

const ChooseFaction = () => {
    const {grandAlliance} = useLocation().state
    let allegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === grandAlliance.id)
    const armiesOfRenown = allegiances.map(({id}) => dataBase.data.faction_keyword.filter(({parentFactionKeywordId, armyOfRenown}) => parentFactionKeywordId === id && armyOfRenown))?.filter(array => array.length > 0)
    // нужно чтобы орков разделить на отдельные книги
    if (grandAlliance.name === 'Destruction') {
        const orrukWarclansId = allegiances.find(alligance => alligance.name === 'Orruk Warclans')?.id
        const orrukAllegiances = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === orrukWarclansId && !faction.armyOfRenown)
        allegiances = [...allegiances, ...orrukAllegiances]
        allegiances = allegiances.filter(alligance => alligance.name !== 'Orruk Warclans')
    }
    sortByName(allegiances)

    const handleClick = ({alligance}) => {
        roster.allegiance = alligance.name
    }
    
    const renderRow = (alligance) => <BuilderRow
        key={alligance.id}
        title={alligance.name}
        navigateTo='builder'
        state={{alligance}}
        onClick={handleClick}
    />

    const renderArmyOfRenown = (army) => army.map(renderRow)

    return <>
        <img src={grandAlliance.image} alt={grandAlliance.name} width='100%' />
        <div id='column' className='Chapter'>
            <h4 id='unitType'>Choose your Faction</h4>
            {allegiances && allegiances.map(renderRow)}
            {armiesOfRenown.length > 0
                ? <>
                    <h4 id='unitType'>Armies Of Renown</h4>
                    {armiesOfRenown.map(renderArmyOfRenown)}
                </>
                : null
            }
        </div>
    </>
}

export default ChooseFaction