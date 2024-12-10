import React from 'react';
import Ability from './Ability'
import {replaceAsterisks} from '../utilities/utils'

import Styles from './styles/Rule.module.css'

const dataBase = require('../dataBase.json')

const Rule = ({rule}) => {

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} abilityKeywordsName='ability_keyword' abilityIdName='abilityId' />

    const renderBullet = (bullet) => <p key={bullet.id}>&#8226; {replaceAsterisks(bullet.text)}</p>

    switch (rule.contentType) {
        case 'text':
            return <p id={Styles.text} key={rule.id}>{replaceAsterisks(rule.textContent)}</p>
        case 'header':
        case 'textBold':
            return <b id={Styles.text} key={rule.id}>{replaceAsterisks(rule.textContent)}</b>
        case 'textItalic':
            return <p id={Styles.textItalic} key={rule.id}>{replaceAsterisks(rule.textContent)}</p>
        case 'boxedText':
            return <p id={Styles.lightgreyContainer} key={rule.id}>{replaceAsterisks(rule.textContent)}</p>
        case 'accordion':
            return <div id={Styles.lightgreyContainer} key={rule.id}>
                <h4>{rule.title}</h4>
                <p>{replaceAsterisks(rule.textContent)}</p>
            </div>
        case 'loreAccordion':
                return <p id={Styles.textItalic} key={rule.id}>{replaceAsterisks(rule.textContent)}</p>
        case 'image':
            return <img src={rule.imageUrl} alt={rule.altText} width='100%' />
        case 'ability':
            const abilities = dataBase.data.ability.filter((ability) => ability.id === rule.abilityId)
            return abilities.map(renderAbility)
        case 'bullets':
            const bullets = dataBase.data.bullet_point.filter((point) => point.ruleContainerComponentId === rule.id)
            bullets.sort((a, b) => a.displayOrder - b.displayOrder)
            return <div id={Styles.lightgreyContainer}>
                {bullets.map(renderBullet)}
            </div>
        default:
            return null
    }
}

export default Rule