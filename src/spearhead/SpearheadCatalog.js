import React from 'react'
import {useLocation} from 'react-router-dom'
import {sortByName} from '../utilities/utils'
import {ListCard, ListItem} from '../components/ListCard'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'


const dataBase = require('../dataBase.json')

const SpearheadCatalog = () => {
    const {battlepack} = useLocation().state
    const _sections = sortByName(filter(dataBase.data.rule_section, ['publicationId', battlepack.id]), 'displayOrder')
    const errata = find(_sections, ['name', 'Errata']) || []
    const faq = find(_sections, ['name', 'Frequently Asked Questions']) || []
    console.log({battlepack, _sections, errata, faq})
    const sections = (!isEmpty(faq) || !isEmpty(errata))
        ? [...filter(_sections, section => includes(section.name, '.')), errata, faq]
        : _sections

    const renderRow = (section) => section.name && <ListItem
        key={section.id}
        title={section.name}
        navigateTo='rules'
        state={{paragraph: section}}
    />

    return <div id='column' className='Chapter'>
        <ListCard>
            {map(sections, renderRow)}
        </ListCard>
    </div>
}

export default SpearheadCatalog