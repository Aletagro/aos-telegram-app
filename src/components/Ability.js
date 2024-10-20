import React from 'react';
import './styles/Ability.css'

const dataBase = require('../dataBase.json')

const Ability = ({ability, abilityKeywordsName, abilityIdName}) => {
    const _abilityKeywordsName = abilityKeywordsName || (ability.castingValue ? 'lore_ability_keyword' : 'warscroll_ability_keyword')
    const _abilityIdName = abilityIdName || (ability.castingValue ? 'loreAbilityId' : 'warscrollAbilityId')
    const keywordsIds = dataBase.data[_abilityKeywordsName].filter(keyword => keyword[_abilityIdName] === ability.id).map(item => item.keywordId)
    const keywords = keywordsIds.map(keywordId => dataBase.data.keyword.find(keyword => keyword.id === keywordId))
    const keywordsLength = keywords.length

    const renderKeyword = (keyword, index) => <p key={keyword.id} id='keyword'>{keyword.name}{keywordsLength === index + 1 ? '' : ','}</p>

    return <div id='ability'>
        <p>{ability.phaseDetails}{ability.cpCost ? ` - ${ability.cpCost} CP` : null}</p>
        <h4>{ability.name}</h4>
        {ability.declare ? <p id='text'>Declare: {ability.declare}</p> : null}
        <p id='text'>Effect: {ability.effect}</p>
        <p>Phase: {ability.phase}</p>
        {keywordsLength
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