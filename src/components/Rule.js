import React from 'react';
import Ability from './Ability'
import './styles/Rule.css'

const dataBase = require('../dataBase.json')

const Rule = ({rule}) => {

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} abilityKeywordsName='ability_keyword' abilityIdName='abilityId' />

    const renderBullet = (bullet) => <p key={bullet.id}>&#8226; {bullet.text}</p>

    switch (rule.contentType) {
        case 'text':
            return <p id='text' key={rule.id}>{rule.textContent}</p>
        case 'header':
        case 'textBold':
            return <p id='textBold' key={rule.id}>{rule.textContent}</p>
        case 'textItalic':
            return <p id='textItalic' key={rule.id}>{rule.textContent}</p>
        case 'boxedText':
            return <p id='lightgreyContainer' key={rule.id}>{rule.textContent}</p>
        case 'accordion':
            return <div id='lightgreyContainer' key={rule.id}>
                <h4>{rule.title}</h4>
                <p>{rule.textContent}</p>
            </div>
        case 'loreAccordion':
                return <p id='textItalic' key={rule.id}>{rule.textContent}</p>
        case 'image':
            return <img src={rule.imageUrl} alt={rule.altText} width='100%' />
        case 'ability':
            const abilities = dataBase.data.ability.filter((ability) => ability.id === rule.abilityId)
            return abilities.map(renderAbility)
        case 'bullets':
            const bullets = dataBase.data.bullet_point.filter((point) => point.ruleContainerComponentId === rule.id)
            bullets.sort((a, b) => a.displayOrder - b.displayOrder)
            return <div id='lightgreyContainer'>
                {bullets.map(renderBullet)}
            </div>
        default:
            return null
    }
}

export default Rule