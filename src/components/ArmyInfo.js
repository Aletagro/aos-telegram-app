import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import Ability from './Ability'
import './styles/Army.css'

const Army = () => {
    const navigate = useNavigate()
    const {alligance, info} = useLocation().state
    
    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} />

    const renderBlock = (block) => <div key={block.id}>
        <h4>{block.name}</h4>
        {block.abilities.map(renderAbility)}
    </div>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <p className='title'>{alligance.name}</p>
        <img src={alligance.rosterHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
        {info.abilities.map(info.withoutTitle ? renderAbility : renderBlock)}
        </div>
    </>
}

export default Army