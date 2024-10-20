import React from 'react';
import {useLocation, Link} from 'react-router-dom'
import Ability from './Ability'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RegimentOfRenown = () => {
    const {regiment} = useLocation().state
    const regimentAbilities = dataBase.data.ability.filter((group) => group.abilityGroupId === regiment.id)
    const warscrollsIds = dataBase.data.ability_group_regiment_of_renown_linked_warscroll.filter(warscroll => warscroll.abilityGroupId === regiment.id)
    const warscrolls = warscrollsIds.map(item => dataBase.data.warscroll.find(warscroll => warscroll.id === item.warscrollId))

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} />

    const renderWarscroll = (unit) => <Link key={unit?.id} to={'warscroll'} state={{unit}}>{unit?.name}</Link>

    return <>
        <p className='title'>{regiment.name}</p>
        <img src={regiment.image} alt='Regiment Of Renown' width='100%' />
        <p id='text'>{regiment.subsectionRulesText}</p>
        <h4>{regiment.regimentOfRenownPointsCost} points</h4>
        {regimentAbilities && regimentAbilities.map(renderAbility)}
        <h4>Warscrools</h4>
        <div id='column' className='Chapter'>
            {warscrolls && warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default RegimentOfRenown