import React from 'react';
import {useLocation} from 'react-router-dom'
import Row from '../components/Row'
import Constants from '../Constants'
import {replaceAsterisks, replaceQuotation} from '../utilities/utils'
import './styles/Army.css'

const dataBase = require('../dataBase.json')

const Army = () => {
    const {alligance, isArmyOfRenown} = useLocation().state
    let items = []
    let rosterOptions
    if (isArmyOfRenown) {
        const publications = dataBase.data.publication.filter(
            item => item.factionKeywordId === alligance.parentFactionKeywordId && item.name.includes('Army of Renown'))
        let publicationId
        if (publications.length > 1) {
            publicationId = publications.find(item => item.name.includes(alligance.name.split(" ")[0]))?.id
        } else {
            publicationId = publications[0]?.id
        }
        const ruleSectionId = dataBase.data.rule_section.find(item => item.publicationId === publicationId)?.id
        const ruleContainerId = dataBase.data.rule_container.find(item => item.ruleSectionId === ruleSectionId)?.id
        const ruleContainerComponentId = dataBase.data.rule_container_component.find(item => item.ruleContainerId === ruleContainerId && item.contentType === 'bullets')?.id
        rosterOptions = dataBase.data.bullet_point.filter(item => item.ruleContainerComponentId === ruleContainerComponentId)
        rosterOptions.sort((a, b) => a.displayOrder - b.displayOrder)
        // у Legion of the First Prince есть варскроллы
        if (alligance.id === '3f9ccc30-1319-4a06-bb97-7b83373ce53f') {
            items.push({title: 'Warscrolls', screen: 'units'})
        }
    } else {
        items.push({title: 'Warscrolls', screen: 'units'})
    }

    // otherEnhancements
    const otherEnhancement = dataBase.data.ability_group.find((item) => item.factionId === alligance.id && item.abilityGroupType === 'otherEnhancements')
    if (otherEnhancement) {
        const enhancements = dataBase.data.ability.filter((item) => item.abilityGroupId === otherEnhancement.id)
        if (enhancements.length > 0) {
            items.push({title: otherEnhancement.name, withoutTitle: true, restrictionText: otherEnhancement.restrictionText, abilities: enhancements})
        }
    }

    const getInfo = (screen) => {
        let abilitiesGroup = dataBase.data[screen.groupName].filter((item) => 
            item.factionId === alligance.id &&
            item.abilityGroupType === screen.abilityGroupType &&
            (screen.includesTexts
                ? Boolean(screen.includesTexts.find(text => item.name.includes(text)))
                : true
            )
        )
        if (screen.abilityGroupType === 'battleTraits') {
            abilitiesGroup = [abilitiesGroup.find(({name})=> replaceQuotation(name).includes(replaceQuotation(alligance.name)))]
        }
        const abilitiesRules = abilitiesGroup.map(formation => dataBase.data[screen.ruleName].filter((item) => item[screen.ruleIdName] === formation?.id))
        const abilities = abilitiesGroup.map((formation, index) => {
            return {name: formation?.name, id: formation?.id, abilities: abilitiesRules[index]}
        })
        if (abilities.length > 0) {
            items.push({title: screen.title, abilities})
        }
    }

    Constants.armyEnhancements.forEach(screen => getInfo(screen))

    let armyOfRenown
    // armyOfRenown свинок достаем для джовсов
    if (alligance.id === '298391fb-3d74-4a26-b9cc-5f3ad5fe4852') {
        armyOfRenown = [dataBase.data.faction_keyword.find((faction) => faction.id === 'f0198b42-f55e-4261-8443-083bb17ec9c8')]
    } else {
        armyOfRenown = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === alligance.id)
    }

    const renderRow = (item) => <Row
        key={item.title}
        title={item.title}
        navigateTo={item.screen || 'armyInfo'}
        state={{alligance, info: item}}
    />

    const renderArmyOfRenown = (item) => <Row
        key={item.title}
        title={item.name}
        navigateTo='armyOfRenown'
        state={{alligance: item, isArmyOfRenown: true}}
    />

    const renderRosterOptions = (option) => <p id='rosterOptionText' key={option.id}>&#8226; {replaceAsterisks(option.text)}</p>

    return <>
        <img src={alligance.rosterHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
            {items.map(renderRow)}
            {armyOfRenown.length > 0
                ? <div>
                    <p id='armyOfRenown'>Army of Renown</p>
                    {armyOfRenown.map(renderArmyOfRenown)}
                </div>
                : null
            }
            {isArmyOfRenown
                ? <>
                    <h4 id='rosterOption'>Roster Options</h4>
                    {rosterOptions.map(renderRosterOptions)}
                </>
                : null
            }
        </div>
    </>
}

export default Army