import React from 'react';
import {useLocation} from 'react-router-dom'
import Ability from './Ability'
import './styles/Rules.css'

const dataBase = require('../dataBase.json')

const Rules = ({info}) => {
    const {paragraph} = useLocation().state
    const _paragraph = info || paragraph
    const rules = dataBase.data.rule_container.filter((group) => group.ruleSectionId === _paragraph.id)
    rules.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} abilityKeywordsName='ability_keyword' abilityIdName='abilityId' />

    const renderBullet = (bullet) => <p key={bullet.id}>- {bullet.text}</p>

    const renderRuleComponent = (component) => {
        switch (component.contentType) {
            case 'text':
                return <p id='text' key={component.id}>{component.textContent}</p>
            case 'textBold':
                return <p id='textBold' key={component.id}>{component.textContent}</p>
            case 'textItalic':
                return <p id='textItalic' key={component.id}>{component.textContent}</p>
            case 'boxedText':
                return <p id='lightgreyContainer' key={component.id}>{component.textContent}</p>
            case 'accordion':
                return <div id='lightgreyContainer' key={component.id}>
                    <h4>{component.title}</h4>
                    <p>{component.textContent}</p>
                </div>
            case 'loreAccordion':
                    return <h5 key={component.id}>{component.textContent}</h5>
            case 'image':
                return <img src={component.imageUrl} alt={component.altText} width='100%' />
            case 'ability':
                const abilities = dataBase.data.ability.filter((ability) => ability.id === component.abilityId)
                return abilities.map(renderAbility)
            case 'bullets':
                const bullets = dataBase.data.bullet_point.filter((point) => point.ruleContainerComponentId === component.id)
                bullets.sort((a, b) => a.displayOrder - b.displayOrder)
                return <div id='lightgreyContainer'>
                    {bullets.map(renderBullet)}
                </div>
            default:
                return null
        }
    }

    const renderRule = (rule) => {
        const components = dataBase.data.rule_container_component.filter((component) => component.ruleContainerId === rule.id)
        components.sort((a, b) => a.displayOrder - b.displayOrder)
        return <>
            <h4 key={rule.id}>{rule.title}</h4>
            {rule.subtitle ? <h5>{rule.subtitle}</h5> : null}
            {components.map(renderRuleComponent)}
        </>
    }

    return <>
        <p className='title'>{_paragraph.name}</p>
        <div id='column' className='Chapter'>
            {rules && rules.map(renderRule)}
        </div>
    </>
}

export default Rules