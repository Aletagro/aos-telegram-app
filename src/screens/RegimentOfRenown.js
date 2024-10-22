import React from 'react';
import {useLocation} from 'react-router-dom'
import Row from '../components/Row'
import Ability from '../components/Ability'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RegimentOfRenown = () => {
    const {regiment} = useLocation().state
    const regimentAbilities = dataBase.data.ability.filter((group) => group.abilityGroupId === regiment.id)
    const warscrollsIds = dataBase.data.ability_group_regiment_of_renown_linked_warscroll.filter(warscroll => warscroll.abilityGroupId === regiment.id)
    const warscrolls = warscrollsIds.map(item => dataBase.data.warscroll.find(warscroll => warscroll.id === item.warscrollId))

    const renderAbility = (ability) => <Ability
        key={ability.id}
        ability={ability}
        abilityKeywordsName='ability_keyword'
        abilityIdName='abilityId'
        isRegimentOfRenown
    />

    const renderWarscroll = (unit) => <Row
        key={unit.id}
        title={unit.name}
        navigateTo='warscroll'
        state={{unit}}
    />

    return <>
        <img src={regiment.image} alt='Regiment Of Renown' width='100%' />
        <div id='column' className='Chapter'>
            <p id='text'>{regiment.subsectionRulesText}</p>
            <h4>{regiment.regimentOfRenownPointsCost} points</h4>
            {regimentAbilities && regimentAbilities.map(renderAbility)}
            <h4>Warscrools</h4>
            {warscrolls && warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default RegimentOfRenown