import React from 'react';
import Constants from '../Constants'
import {replaceAsterisks} from '../utilities/utils'
import './styles/Ability.css'

const dataBase = require('../dataBase.json')

const Ability = ({ability, abilityKeywordsName, abilityIdName, isRegimentOfRenown, onClick}) => {
    const _abilityKeywordsName = abilityKeywordsName || 'warscroll_ability_keyword'
    const _abilityIdName = abilityIdName || 'warscrollAbilityId'
    const keywordsIds = dataBase.data[_abilityKeywordsName].filter(keyword => keyword[_abilityIdName] === ability.id).map(item => item.keywordId)
    const keywords = keywordsIds.map(keywordId => dataBase.data.keyword.find(keyword => keyword.id === keywordId))
    const keywordsLength = keywords.length
    const borderColor = Constants.abilitiesTypes[ability.phase]

    const handlleClick = () => {
        if (onClick) {
            onClick(ability)
        }
    }

    const renderKeyword = (keyword, index) => <p key={keyword.id}>{keyword.name}{keywordsLength === index + 1 ? '' : ','}&nbsp;</p>

    return <button id='ability' onClick={handlleClick} style={{border: `1px solid ${borderColor}`}}>
        <div id='header' style={{background: borderColor}}>
            <p className='headerText'>{ability.phaseDetails}</p>
            {ability.cpCost && !isRegimentOfRenown ? <p className='cpCost'>{`${ability.cpCost} CP`}</p> : null}
            {/* У абилок, которые привязаны к Regiment Of Renown сложность каста приходит в cpCost */}
            {ability.castingValue || (isRegimentOfRenown && ability.cpCost)
                ? <div id='castingValueContainer'>
                    <p id='castingValue'>{isRegimentOfRenown ? ability.cpCost : ability.castingValue}</p>
                </div>
                : null
            }
        </div>
        <div id='container'>
            <h4 id='abilityName'>{ability.name}</h4>
            {ability.declare ? <p id='abilityText'><b>Declare:</b> {replaceAsterisks(ability.declare)}</p> : null}
            <p id='abilityText'><b>Effect:</b> {replaceAsterisks(ability.effect)}</p>
            {keywordsLength
                ? <div id='abilityKeywordsContainer' className='keywordsContainer'>
                    <p id='boldText'>Keywords:&nbsp;</p>
                    {keywords.map(renderKeyword)}
                </div>
                : null
            }
        </div>
    </button>
}

export default Ability