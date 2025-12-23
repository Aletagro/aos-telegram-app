import React from 'react'
import {useLocation} from 'react-router-dom'
import Constants from '../Constants'
import {sortByName, getSpearheadInfo, removeAsterisks} from '../utilities/utils'
import HeaderImage from '../components/HeaderImage'
import Row from '../components/Row'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'

import Styles from './styles/SpearheadArmy.module.css'

const dataBase = require('../dataBase.json')

const SpearheadArmy = () => {
    const {army} = useLocation().state
    const ruleSection = find(dataBase.data.rule_section, ['name', army.spearheadName])
    const ruleContainer = find(dataBase.data.rule_container, ['ruleSectionId', ruleSection.id])
    const unitsInfo = sortByName(filter(dataBase.data.rule_container_component, ['ruleContainerId', ruleContainer?.id]), 'displayOrder')
    const unitsIds = filter(dataBase.data.warscroll_publication, ['publicationId', army.id])
    const units = map(unitsIds, ({warscrollId}) => find(dataBase.data.warscroll, ['id', warscrollId]))
    const items = []

    forEach(Constants.spearheadArmyEnhancements, screen => {
        const info = getSpearheadInfo(screen, army.id)
        if (info) {
            items.push(info)
        }
    })

    const renderRow = (item) => <Row
        key={item.name}
        title={item.title}
        navigateTo='armyInfo'
        state={{allegiance: army, info: item, isSpearhead: true}}
    />

    const renderUnitsInfo = (info) => info.contentType === 'loreAccordion'
        ? null
        : info.contentType === 'textBold' || info.contentType === 'header'
            ? <b id={Styles.infoText} key={info.id}>{removeAsterisks(info.textContent)}</b>
            : <p id={Styles.infoText} key={info.id}>{info.textContent}</p>

    return <>
        <HeaderImage src={army.backgroundImage} alt='Spearhead Army' />
        <div id='column' className='Chapter'>
            <Row
                title='Warscrolls'
                navigateTo='units'
                state={{units}}
            />
            {map(items, renderRow)}
            {map(unitsInfo, renderUnitsInfo)}
        </div>
    </>
}

export default SpearheadArmy