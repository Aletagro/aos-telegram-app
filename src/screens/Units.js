import React from 'react';
import {useLocation} from 'react-router-dom'
import {unitsSortesByType} from '../utilities/utils'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import Accordion from '../components/Accordion'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'

const dataBase = require('../dataBase.json')

const Units = () => {
    const {allegiance, units} = useLocation().state
    let _units = []
    if (units) {
        _units = unitsSortesByType(units)
    } else {
        const warscrollIds = map(filter(dataBase.data.warscroll_faction_keyword, (item) => item.factionKeywordId === allegiance.id), item => item.warscrollId)
        _units = unitsSortesByType(filter(map(warscrollIds, warscrollId => find(dataBase.data.warscroll, scroll => scroll.id === warscrollId)), unit => !unit.isSpearhead && !unit.isLegends))
    }

    const renderRow = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        rightText={unit?.points ? `${unit?.points} pts` : undefined}
        image={unit?.rowImage}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderUnitsType = (type) => <Accordion
        title={type.title}
        data={type.units}
        renderItem={renderRow}
    />

    return <>
        {allegiance?.rosterHeaderImage
            ? <HeaderImage src={allegiance?.rosterHeaderImage} alt={allegiance?.name} isWide />
            : null
        }
        <div id='column' className='Chapter'>
            {_units.map(renderUnitsType)}
        </div>
    </>
}

export default Units