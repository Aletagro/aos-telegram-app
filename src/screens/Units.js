import React from 'react';
import {useLocation} from 'react-router-dom'
import Row from '../components/Row'
import './styles/Units.css'

const dataBase = require('../dataBase.json')

const unitsTypes = [
    {
        name: 'Hero'
    },
    {
        name: 'Infantry',
        withoutHero: true
    },
    {
        name: 'Cavalry',
        withoutHero: true
    },
    {
        name: 'Beast',
        withoutHero: true
    },
    {
        name: 'Monster',
        withoutHero: true
    },
    {
        name: 'War Machine',
        withoutHero: true
    },
    {
        name: 'Manifestation'
    },
    {
        name: 'Faction Terrain'
    }
]

const Units = () => {
    const alligance = useLocation().state.alligance
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === alligance.id).map(item => item.warscrollId)
    const units = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends)

    const setSort = (items) => items.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    const getUnitsByType = (type) => {
        const _units = units.filter(unit => unit.referenceKeywords.includes(type.name) && (type.withoutHero ? !unit.referenceKeywords.includes('Hero') : true))
        if (_units.length > 0) {
            setSort(_units)
            return {units: _units, title: type.name}
        } else {
            return null
        }
    }

    const unitsSortesByType = unitsTypes.map(getUnitsByType).filter(Boolean)

    const renderRow = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderUnitsType = (type) => <div key={type.title}>
        <h4 id='unitType'>{type.title}</h4>
        {type.units.map(renderRow)}
    </div>

    return <>
        <img src={alligance.rosterHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
            {unitsSortesByType.map(renderUnitsType)}
        </div>
    </>
}

export default Units