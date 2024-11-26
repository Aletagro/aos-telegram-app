import React from 'react';
import {useLocation} from 'react-router-dom'
import {unitsSortesByType} from '../utilities/utils'
import Row from '../components/Row'
import './styles/Units.css'

const dataBase = require('../dataBase.json')

const Units = () => {
    const alligance = useLocation().state.alligance
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === alligance.id).map(item => item.warscrollId)
    const units = unitsSortesByType(warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends))

    const renderRow = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        subtitle={`${unit?.points} pts`}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderUnitsType = (type) => <div id='unitTypeContainer' key={type.title}>
        <h4 id='unitType'>{type.title}</h4>
        {type.units.map(renderRow)}
    </div>

    return <>
        <img src={alligance.rosterHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
            {units.map(renderUnitsType)}
        </div>
    </>
}

export default Units