import React from 'react'
import {sortByName} from '../utilities/utils'
import {ListCard, ListItem} from '../components/ListCard'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import replace from 'lodash/replace'
import includes from 'lodash/includes'


const dataBase = require('../utilities/db')

const SpearheadArmies = () => {
    const _armies = filter(dataBase.data.publication, publication => includes(publication.name, 'Spearhead: '))
    const armies = sortByName(map(_armies, army => {
        const factionName = find(dataBase.data.faction_keyword, ['id', army.factionKeywordId])?.name
        const name = `${factionName}: ${replace(army.name, 'Spearhead: ', '')}`
        return {...army, name}
    }))

    const renderRow = (army) => <ListItem
        key={army.id}
        title={replace(army.name, 'Spearhead Battlepack: ', '')}
        navigateTo='spearheadArmy'
        state={{army}}
    />

    return <div id='column' className='Chapter'>
        <ListCard>
            {map(armies, renderRow)}
        </ListCard>
    </div>
}

export default SpearheadArmies