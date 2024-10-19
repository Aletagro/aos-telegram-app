import React from 'react';
import {useLocation} from 'react-router-dom'
import Ability from './Ability'
import './styles/Army.css'

const Army = () => {
    const {alligance, info} = useLocation().state

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} />

    const renderBlock = (block) => <div key={block.id}>
        <h4>{block.name}</h4>
        {block.abilities.map(renderAbility)}
    </div>

    return <>
        <p className='title'>{alligance.name}</p>
        <img src={alligance.rosterHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
        {info.restrictionText ? <h4>{info.restrictionText}</h4> : null}
        {info.abilities.map(info.withoutTitle ? renderAbility : renderBlock)}
        </div>
    </>
}

export default Army