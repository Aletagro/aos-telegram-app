import React from 'react'
import Constants from '../Constants'
import {sortByName} from '../utilities/utils'
import HeaderImage from '../components/HeaderImage'
import Row from '../components/Row'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import replace from 'lodash/replace'
import includes from 'lodash/includes'


const dataBase = require('../dataBase.json')

const SpearheadArmies = () => {
    const _armies = filter(dataBase.data.publication, publication => includes(publication.name, 'Spearhead: '))
    const armies = sortByName(map(_armies, army => {
        const factionName = find(dataBase.data.faction_keyword, ['id', army.factionKeywordId])?.name
        const name = `${factionName}: ${replace(army.name, 'Spearhead: ', '')}`
        return {...army, name}
    }))

    const renderRow = (army) => <Row
        key={army.id}
        title={replace(army.name, 'Spearhead Battlepack: ', '')}
        navigateTo='spearheadArmy'
        state={{army}}
    />

    return <>
        <HeaderImage src={Constants.rulesImage} alt='Spearhead Armies' />
        <div id='column' className='Chapter'>
            {map(armies, renderRow)}
        </div>
    </>
}

export default SpearheadArmies