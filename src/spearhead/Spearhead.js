import React from 'react'
import Constants from '../Constants'
import {ListCard, ListItem, SectionTitle} from '../components/ListCard'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import replace from 'lodash/replace'


const dataBase = require('../dataBase.json')

const Spearhead = () => {
    const publication = find(dataBase.data.publication_group, ['id', Constants.spearheadBattlepacksId])
    const groups = filter(dataBase.data.publication_publication_group, ['publicationGroupId', publication.id])
    const battlepacks = map(groups, group => find(dataBase.data.publication, ['id', group.publicationId]))

    const renderRow = (battlepack) => <ListItem
        key={battlepack.id}
        title={replace(battlepack.name, 'Spearhead Battlepack: ', '')}
        navigateTo='spearheadCatalog'
        state={{battlepack}}
    />

    return <div id='column' className='Chapter'>
        <SectionTitle>Battlepacks</SectionTitle>
        <ListCard>
            {map(battlepacks, renderRow)}
        </ListCard>
        <SectionTitle>Armies</SectionTitle>
        <ListCard>
            <ListItem title='Spearhead Armies' navigateTo='spearheadArmies' />
        </ListCard>
    </div>
}

export default Spearhead