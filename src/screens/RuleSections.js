import React from 'react';
import {useLocation} from 'react-router-dom'
import Row from '../components/Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RuleSections = () => {
    const {document} = useLocation().state
    const ruleSections = dataBase.data.rule_section.filter((section) => section.publicationId === document.id && !section.parentId)
    ruleSections.sort((a, b) => a.displayOrder - b.displayOrder)
    
    const renderRow = (chapter) => <Row
        key={chapter.id}
        title={chapter.name}
        navigateTo='ruleChapters'
        state={{chapter}}
    />

    return <>
        <img src={document.backgroundImage} alt={document.name} width='100%' />
        <div id='column' className='Chapter'>
            {ruleSections && ruleSections.map(renderRow)}
        </div>
    </>
}

export default RuleSections