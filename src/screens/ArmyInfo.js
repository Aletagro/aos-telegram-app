import React from 'react';
import {useLocation} from 'react-router-dom'
import Constants from '../Constants'
import {replaceAsterisks} from '../utilities/utils'
import Ability from '../components/Ability'
import './styles/ArmyInfo.css'

const ArmyInfo = () => {
    const {allegiance, info} = useLocation().state
    const armyEnhancement = Constants.armyEnhancements.find(enhancement => enhancement.title === info.title)

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} abilityKeywordsName={armyEnhancement?.abilityKeywordsName} abilityIdName={armyEnhancement?.abilityIdName} />

    const renderBlock = (block) => <div key={block.id}>
        <p id='armyInfoTitle'>{block.name}</p>
        {block.abilities.map(renderAbility)}
    </div>

    return <>
        <img src={allegiance.rosterHeaderImage} alt={allegiance.name} width='100%' />
        <div id='column' className='Chapter'>
        {info.restrictionText ? <p id='armyInfoNote'>{replaceAsterisks(info.restrictionText)}</p> : null}
        {info.abilities.map(info.withoutTitle ? renderAbility : renderBlock)}
        </div>
    </>
}

export default ArmyInfo