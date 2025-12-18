import React from 'react'
import {useLocation} from 'react-router-dom'
import {sortByName} from '../utilities/utils'
import HeaderImage from '../components/HeaderImage'
import Row from '../components/Row'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import includes from 'lodash/includes'


const dataBase = require('../dataBase.json')

const SpearheadCatalog = () => {
    const {battlepack} = useLocation().state
    const _sections = sortByName(filter(dataBase.data.rule_section, ['publicationId', battlepack.id]), 'displayOrder')
    const errata = find(_sections, ['name', 'Errata']) || []
    const faq = find(_sections, ['name', 'Frequently Asked Questions']) || []
    const sections = [...filter(_sections, section => includes(section.name, '.')), errata, faq]

    const renderRow = (section) => section.name && <Row
        key={section.id}
        title={section.name}
        navigateTo='rules'
        state={{paragraph: section}}
    />

    return <>
        <HeaderImage src={battlepack?.backgroundImage} alt='Core Documents' />
        <div id='column' className='Chapter'>
            {map(sections, renderRow)}
        </div>
    </>
}

export default SpearheadCatalog