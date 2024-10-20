import React from 'react';
import {useLocation, Link} from 'react-router-dom'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RuleSections = () => {
    const {document} = useLocation().state
    const ruleSections = dataBase.data.rule_section.filter((section) => section.publicationId === document.id && !section.parentId)
    ruleSections.sort((a, b) => a.displayOrder - b.displayOrder)
    
    const renderButton = (chapter) => <Link key={chapter.id} to={'ruleChapters'} state={{chapter}}>{chapter.name}</Link>

    return <>
        <p className='title'>{document.name}</p>
        <img src={document.backgroundImage} alt={document.name} width='100%' />
        <div id='column' className='Chapter'>
            {ruleSections && ruleSections.map(renderButton)}
        </div>
    </>
}

export default RuleSections