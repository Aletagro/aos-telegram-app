import React, {useCallback, useReducer} from 'react'
import {useLocation} from 'react-router-dom'
import {unitsSortesByType, getUnitsRowRightText} from '../utilities/utils'
import {isCollapseUnitsTypes} from '../utilities/appState'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import Accordion from '../components/Accordion'
import Constants from '../Constants'

import map from 'lodash/map'
import find from 'lodash/find'
import size from 'lodash/size'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

const dataBase = require('../dataBase.json')

const Units = () => {
    const {allegiance, units, isArmyOfRenown} = useLocation().state
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    let _units = []
    if (units) {
        _units = unitsSortesByType(units)
    } else {
        const isLegendaryArmies = includes(Constants.legendaryArmies, allegiance?.id)
        let warscrollIds = map(filter(dataBase.data.warscroll_faction_keyword, (item) => item.factionKeywordId === allegiance.id), item => item.warscrollId)
        if (isArmyOfRenown) {
            const loreId = find(dataBase.data.lore, lore => lore.factionId === allegiance?.id && includes(lore.name, 'Manifestation'))?.id
            const loreAbilityId = find(dataBase.data.lore_ability, ['loreId', loreId])?.id
            const spellsWarscrollIds = map(filter(dataBase.data.lore_ability_linked_warscroll, ['loreAbilityId', loreAbilityId]), 'warscrollId')
            if (size(spellsWarscrollIds)) {
                warscrollIds = [...warscrollIds, ...spellsWarscrollIds]
            }
        }
        _units = unitsSortesByType(filter(map(warscrollIds, warscrollId => find(dataBase.data.warscroll, scroll => scroll.id === warscrollId)), unit => !unit.isSpearhead && (isLegendaryArmies ? true : !unit.isLegends)))
    }

    const handleChangeExpand = useCallback((e) => {
        isCollapseUnitsTypes[e.nativeEvent.target?.innerText] = !isCollapseUnitsTypes[e.nativeEvent.target?.innerText]
        forceUpdate()
    }, [])

    const renderRow = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        rightText={getUnitsRowRightText(unit)}
        image={unit?.rowImage}
        navigateTo='warscroll'
        state={{unit, allegianceId: allegiance?.id}}
    />

    const renderUnitsType = (type) => <Accordion
        key={type.title}
        title={type.title}
        data={type.units}
        renderItem={renderRow}
        expanded={!isCollapseUnitsTypes[type.title]}
        onChangeExpand={handleChangeExpand}
    />

    return <>
        {allegiance?.rosterHeaderImage
            ? <HeaderImage src={allegiance?.rosterHeaderImage} alt={allegiance?.name} isWide />
            : null
        }
        <div id='column' className='Chapter'>
            {map(_units, renderUnitsType)}
        </div>
    </>
}

export default Units