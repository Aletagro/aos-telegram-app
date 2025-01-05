import React from 'react';
import {useLocation} from 'react-router-dom'
import {sortByName, replaceAsterisks} from '../utilities/utils'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import Ability from '../components/Ability'

import Styles from './styles/RegimentOfRenown.module.css'

const dataBase = require('../dataBase.json')

const RegimentOfRenown = () => {
    window.scrollTo(0, 0)
    const {regiment} = useLocation().state
    const regimentAbilities = dataBase.data.ability.filter((group) => group.abilityGroupId === regiment.id)
    const warscrollsIds = dataBase.data.ability_group_regiment_of_renown_linked_warscroll.filter(warscroll => warscroll.abilityGroupId === regiment.id)
    const warscrolls = sortByName(warscrollsIds.map(item => dataBase.data.warscroll.find(warscroll => warscroll.id === item.warscrollId)))

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
        rightText={unit?.points ? `${unit?.points} pts` : undefined}
        image={unit?.rowImage}
        navigateTo='warscroll'
        state={{unit}}
    />

    return <>
        <HeaderImage src={regiment.image} alt='Regiment Of Renown' />
        <div id='column' className='Chapter'>
            <p id={Styles.text}>{replaceAsterisks(regiment.subsectionRulesText)}</p>
            <h4 id={Styles.title}>{regiment.regimentOfRenownPointsCost} points</h4>
            {regimentAbilities && regimentAbilities.map(renderAbility)}
            <h4 id={Styles.title}>Warscrolls</h4>
            {warscrolls && warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default RegimentOfRenown