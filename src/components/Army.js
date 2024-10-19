import React from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom'
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
        includesText: 'Lore'
    },
    {
        title: 'Prayes Lores',
        groupName: 'lore',
        ruleName: 'lore_ability',
        ruleIdName: 'loreId',
        abilityGroupType: undefined,
        includesText: 'Prayers'
    }
]

const Army = () => {
    const navigate = useNavigate()
    const alligance = useLocation().state.alligance
    let items = [{title: 'Warscrolls', screen: 'units'}]
    // поиск Battle Traits
    const battleTraitsId = dataBase.data.ability_group.find((item) => item.factionId === alligance.id).id
    const battleTraits = dataBase.data.ability.filter((item) => item.abilityGroupId === battleTraitsId)
    if (battleTraits.length > 0) {
        items.push({title: 'Battle Traits', withoutTitle: true, abilities: battleTraits})
    }

    const getInfo = (screen) => {
        const abilitiesGroup = dataBase.data[screen.groupName].filter((item) => 
            item.factionId === alligance.id &&
            item.abilityGroupType === screen.abilityGroupType &&
            (screen.includesText ? item.name.includes(screen.includesText) : true)
        )
        const abilitiesRules = abilitiesGroup.map(formation => dataBase.data[screen.ruleName].filter((item) => item[screen.ruleIdName] === formation.id))
        const abilities = abilitiesGroup.map((formation, index) => {
            return {name: formation.name, id: formation.id, abilities: abilitiesRules[index]}
        })
        if (abilities.length > 0) {
            items.push({title: screen.title, abilities})
        }
    }
    
    screens.map(screen => getInfo(screen))

    const renderButton = (item) => <Link key={item.title} to={item.screen || 'armyInfo'} state={{alligance, info: item}}>{item.title}</Link>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <p className='title'>{alligance.name}</p>
        <img src={alligance.rosterHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
        {items.map(renderButton)}
        </div>
    </>
}

export default Army