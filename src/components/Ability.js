import React from 'react';
import './styles/Ability.css'

const dataBase = require('../dataBase.json')

const Ability = ({ability}) => {
    const abilityKeywordsName = ability.castingValue ? 'lore_ability_keyword' : 'warscroll_ability_keyword'
    const abilityIdName = ability.castingValue ? 'loreAbilityId' : 'warscrollAbilityId'
    const keywordsIds = dataBase.data[abilityKeywordsName].filter(keyword => keyword[abilityIdName] === ability.id).map(item => item.keywordId)
    const keywords = keywordsIds.map(keywordId => dataBase.data.keyword.find(keyword => keyword.id === keywordId))

    const renderKeyword = (keyword) => <p id='keyword'>{keyword.name},</p>

    return <div id='ability'>
        <p>{ability.phaseDetails}{ability.cpCost ? ` - ${ability.cpCost} CP` : null}</p>
        <h4>{ability.name}</h4>
        {ability.declare ? <p id='text'>Declare: {ability.declare}</p> : null}
        <p id='text'>Effect: {ability.effect}</p>
        <p>Phase: {ability.phase}</p>
        {keywords.length > 0
            ? <div id='row' className='keywordsContainer'>
                <p id='keyword'>Keywords:</p>
                {keywords.map(renderKeyword)}
            </div>
            : null
        }
        {ability.lore ? <h6>Lore: {ability.lore}</h6> : null}
    </div>
}

export default Ability