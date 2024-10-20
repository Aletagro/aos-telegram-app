import React from 'react';
import {useLocation, Link} from 'react-router-dom'
import './styles/Army.css'

const dataBase = require('../dataBase.json')

const screens = [
    {
        title: 'Battle Formations',
        groupName: 'battle_formation',
        ruleName: 'battle_formation_rule',
        ruleIdName: 'battleFormationId'
    },
    {
        title: 'Artefacts of Power',
        groupName: 'ability_group',
        ruleName: 'ability',
        ruleIdName: 'abilityGroupId',
        abilityGroupType: 'artefactsOfPower'
    },
    {
        title: 'Heroic Traits',
        groupName: 'ability_group',
        ruleName: 'ability',
        ruleIdName: 'abilityGroupId',
        abilityGroupType: 'heroicTraits'
    },
    {
        title: 'Spell Lores',
        groupName: 'lore',
        ruleName: 'lore_ability',
        ruleIdName: 'loreId',
        abilityGroupType: undefined,
        includesText: 'Lore of',
        secondIncludesText: 'Spell Lore'
    },
    {
        title: 'Prayes Lores',
        groupName: 'lore',
        ruleName: 'lore_ability',
        ruleIdName: 'loreId',
        abilityGroupType: undefined,
        includesText: 'Prayer'
    }
]

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
    } else {
        items.push({title: 'Warscrolls', screen: 'units'})
    }

    // Battle Traits
    const battleTraitsId = dataBase.data.ability_group.find((item) => item.factionId === alligance.id && item.abilityGroupType === 'battleTraits').id
    const battleTraits = dataBase.data.ability.filter((item) => item.abilityGroupId === battleTraitsId)
    if (battleTraits.length > 0) {
        items.push({title: 'Battle Traits', withoutTitle: true, abilities: battleTraits})
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
        const abilitiesGroup = dataBase.data[screen.groupName].filter((item) => 
            item.factionId === alligance.id &&
            item.abilityGroupType === screen.abilityGroupType &&
            (screen.includesText
                ? item.name.includes(screen.includesText) || item.name.includes(screen.secondIncludesText)
                : true
            )
        )
        const abilitiesRules = abilitiesGroup.map(formation => dataBase.data[screen.ruleName].filter((item) => item[screen.ruleIdName] === formation.id))
        const abilities = abilitiesGroup.map((formation, index) => {
            return {name: formation.name, id: formation.id, abilities: abilitiesRules[index]}
        })
        if (abilities.length > 0) {
            items.push({title: screen.title, abilities})
        }
    }

    screens.forEach(screen => getInfo(screen))

    let armyOfRenown
    // armyOfRenown свинок достаем для джовсов
    if (alligance.id === '298391fb-3d74-4a26-b9cc-5f3ad5fe4852') {
        armyOfRenown = [dataBase.data.faction_keyword.find((faction) => faction.id === 'f0198b42-f55e-4261-8443-083bb17ec9c8')]
    } else {
        armyOfRenown = dataBase.data.faction_keyword.filter((faction) => faction.parentFactionKeywordId === alligance.id)
    }
    console.log(armyOfRenown)

    const renderButton = (item) => <Link key={item.title} to={item.screen || 'armyInfo'} state={{alligance, info: item}}>{item.title}</Link>

    const renderArmyOfRenown = (item) => <Link id='armyOfRenown' key={item.title} to={'armyOfRenown'} state={{alligance: item, isArmyOfRenown: true}}>{item.name}</Link>

    const renderRosterOptions = (option) => <p key={option.id} id='rosterOption'>- {option.text}</p>

    return <>
        <p className='title'>{alligance.name}</p>
        <img src={alligance.rosterHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
            {items.map(renderButton)}
            {armyOfRenown.length > 0
                ? <>
                    <h4>Army of Renown</h4>
                    {armyOfRenown.map(renderArmyOfRenown)}
                </>
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