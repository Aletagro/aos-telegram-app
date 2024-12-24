import React from 'react';
import {useLocation} from 'react-router-dom'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import Constants from '../Constants'
import {roster, navigationState} from '../utilities/appState'
import {replaceAsterisks, getInfo} from '../utilities/utils'

import Styles from './styles/Army.module.css'

const dataBase = require('../dataBase.json')

const Army = () => {
    const {allegiance, isArmyOfRenown, allegianceId, grandAlliance} = useLocation().state
    let _allegiance = allegiance
    if (!allegiance) {
        _allegiance = dataBase.data.faction_keyword.find(faction => faction.id === allegianceId)
    }
    let items = [{title: 'Warscrolls', screen: 'units'}]
    let rosterOptions
    if (isArmyOfRenown) {
        const publications = dataBase.data.publication.filter(
            item => item.factionKeywordId === _allegiance.parentFactionKeywordId && item.name.includes('Army of Renown'))
        let publicationId
        if (publications.length > 1) {
            publicationId = publications.find(item => item.name.includes(_allegiance.name.split(" ")[0]))?.id
        } else {
            publicationId = publications[0]?.id
        }
        const ruleSectionId = dataBase.data.rule_section.find(item => item.publicationId === publicationId && item.displayOrder === 1)?.id
        const ruleContainerId = dataBase.data.rule_container.find(item => item.ruleSectionId === ruleSectionId)?.id
        const ruleContainerComponentId = dataBase.data.rule_container_component.find(item => item.ruleContainerId === ruleContainerId && item.contentType === 'bullets')?.id

        rosterOptions = dataBase.data.bullet_point.filter(item => item.ruleContainerComponentId === ruleContainerComponentId)
        rosterOptions.sort((a, b) => a.displayOrder - b.displayOrder)
    }

    // otherEnhancements
    const otherEnhancement = dataBase.data.ability_group.find((item) => item.factionId === _allegiance.id && item.abilityGroupType === 'otherEnhancements')
    if (otherEnhancement) {
        const enhancements = dataBase.data.ability.filter((item) => item.abilityGroupId === otherEnhancement.id)
        if (enhancements.length > 0) {
            items.push({title: otherEnhancement.name, withoutTitle: true, restrictionText: otherEnhancement.restrictionText, abilities: enhancements})
        }
    }

    Constants.armyEnhancements.forEach(screen => {
        const info = getInfo(screen, _allegiance)
        if (info) {
            items.push(info)
        }
    })

    let armyOfRenown
    // armyOfRenown свинок достаем для джовсов
    if (_allegiance.id === '298391fb-3d74-4a26-b9cc-5f3ad5fe4852') {
        armyOfRenown = [dataBase.data.faction_keyword.find((faction) => faction.id === 'f0198b42-f55e-4261-8443-083bb17ec9c8')]
    } else {
        armyOfRenown = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === _allegiance.id)
    }

    const handleClickBuilder = () => {
        roster.grandAlliance = grandAlliance
        roster.allegiance = _allegiance.name
        navigationState.isBuilder = true
    }

    const renderRow = (item) => <Row
        key={item.title}
        title={item.title}
        navigateTo={item.screen || 'armyInfo'}
        state={{allegiance: _allegiance, info: item}}
    />


    const renderBuilderRow = () => <Row
        title='Builder'
        navigateTo='builder'
        state={{alliganceId: _allegiance.id}}
        onClick={handleClickBuilder}
    />

    const renderArmyOfRenown = (item) => <Row
        key={item.title}
        title={item.name}
        navigateTo='armyOfRenown'
        state={{allegiance: item, isArmyOfRenown: true, grandAlliance}}
    />

    const renderRosterOptions = (option) => <p id={Styles.rosterOptionText} key={option.id}>&#8226; {replaceAsterisks(option.text)}</p>

    return <>
        <HeaderImage src={_allegiance.rosterHeaderImage} alt={_allegiance.name} isWide />
        <div id='column' className='Chapter'>
            {items.map(renderRow)}
            {renderBuilderRow()}
            {armyOfRenown.length > 0
                ? <div>
                    <p id={Styles.armyOfRenown}>Army of Renown</p>
                    {armyOfRenown.map(renderArmyOfRenown)}
                </div>
                : null
            }
            {isArmyOfRenown
                ? <>
                    <h4 id={Styles.rosterOption}>Roster Options</h4>
                    {rosterOptions.map(renderRosterOptions)}
                </>
                : null
            }
        </div>
    </>
}

export default Army