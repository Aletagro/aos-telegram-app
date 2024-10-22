import React from 'react';
import './styles/Ability.css'

const dataBase = require('../dataBase.json')

const abilitiesType = {
    startOfTurn: {
        background: 'black',
        icon: ''
    },
    combatPhase: {
        background: 'darkred',
        icon: ''
    },
    heroPhase: {
        background: 'rgb(161, 146, 61)',
        icon: ''
    },
    movementPhase: {
        background: 'grey',
        icon: ''
    },
    defensive: {
        background: 'darkgreen',
        icon: ''
    },
    chargePhase: {
        background: 'rgb(182, 92, 28)',
        icon: ''
    },
    shootingPhase: {
        background: 'rgb(26, 72, 110)',
        icon: ''
    },
    endOfTurn: {
        background: 'indigo',
        icon: ''
    }
}

const Ability = ({ability, abilityKeywordsName, abilityIdName, isRegimentOfRenown}) => {
    const _abilityKeywordsName = abilityKeywordsName || (ability.castingValue ? 'lore_ability_keyword' : 'warscroll_ability_keyword')
    const _abilityIdName = abilityIdName || (ability.castingValue ? 'loreAbilityId' : 'warscrollAbilityId')
    const keywordsIds = dataBase.data[_abilityKeywordsName].filter(keyword => keyword[_abilityIdName] === ability.id).map(item => item.keywordId)
    const keywords = keywordsIds.map(keywordId => dataBase.data.keyword.find(keyword => keyword.id === keywordId))
    const keywordsLength = keywords.length
    const borderColor = abilitiesType[ability.phase]?.background

    const renderKeyword = (keyword, index) => <p key={keyword.id}>{keyword.name}{keywordsLength === index + 1 ? '' : ','}&nbsp;</p>

    return <div id='ability' style={{border: `1px solid ${borderColor}`}}>
        <div id='header' style={{background: borderColor}}>
            <p className='headerText'>{ability.phaseDetails}</p>
            {ability.cpCost && !isRegimentOfRenown ? <p className='headerText'>{`${ability.cpCost} CP`}</p> : null}
            {/* У абилок, которые привязаны к Regiment Of Renown сложность каста приходит в cpCost */}
            {ability.castingValue || (isRegimentOfRenown && ability.cpCost) ? <p id='castingValue'>{isRegimentOfRenown ? ability.cpCost : ability.castingValue}</p> : null}
        </div>
        <div id='container'>
            <h4>{ability.name}</h4>
            {ability.declare ? <p id='text'><b>Declare:</b> {ability.declare}</p> : null}
            <p id='text'><b>Effect:</b> {ability.effect}</p>
            {keywordsLength
                ? <div id='row' className='keywordsContainer'>
                    <p id='boldText'>Keywords:&nbsp;</p>
                    {keywords.map(renderKeyword)}
                </div>
                : null
            }
            {ability.lore ? <p id='textItalic'><b>Lore:</b> {ability.lore}</p> : null}
        </div>
    </div>
}

export default Ability