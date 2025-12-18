import React from 'react'
import Constants from '../Constants'
import HeaderImage from '../components/HeaderImage'
import Row from '../components/Row'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import replace from 'lodash/replace'


const dataBase = require('../dataBase.json')

const Spearhead = () => {
    const publication = find(dataBase.data.publication_group, ['id', Constants.spearheadBattlepacksId])
    const groups = filter(dataBase.data.publication_publication_group, ['publicationGroupId', publication.id])
    const battlepacks = map(groups, group => find(dataBase.data.publication, ['id', group.publicationId]))

    const renderRow = (battlepack) => <Row
        key={battlepack.id}
        title={replace(battlepack.name, 'Spearhead Battlepack: ', '')}
        navigateTo='spearheadCatalog'
        state={{battlepack}}
    />

    return <>
        <HeaderImage src={publication?.backgroundImage} alt='Core Documents' />
        <div id='column' className='Chapter'>
            {map(battlepacks, renderRow)}
            <Row title={'Armies'} navigateTo='spearheadArmies' />
        </div>
    </>
}

export default Spearhead