import React from 'react';
import {useLocation} from 'react-router-dom'
import {unitsSortesByType} from '../utilities/utils'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import './styles/Units.css'

const dataBase = require('../dataBase.json')

const Units = () => {
    const allegiance = useLocation().state.allegiance
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === allegiance.id).map(item => item.warscrollId)
    const units = unitsSortesByType(warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends))

    const renderRow = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        subtitle={unit?.points ? `${unit?.points} pts` : undefined}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderUnitsType = (type) => <div id='unitTypeContainer' key={type.title}>
        <h4 id='unitType'>{type.title}</h4>
        {type.units.map(renderRow)}
    </div>

    return <>
        <HeaderImage src={allegiance.rosterHeaderImage} alt={allegiance.name} isWide />
        <div id='column' className='Chapter'>
            {units.map(renderUnitsType)}
        </div>
    </>
}

export default Units