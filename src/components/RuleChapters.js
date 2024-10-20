import React from 'react';
import {useLocation, Link} from 'react-router-dom'
import Rules from './Rules'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RuleChapters = () => {
    const {chapter} = useLocation().state
    const ruleChapters = dataBase.data.rule_section.filter((section) => section.parentId === chapter.id)
    ruleChapters.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderButton = (paragraph) => <Link key={paragraph.id} to={'rules'} state={{paragraph}}>{paragraph.name}</Link>

    return ruleChapters.length > 0
        ? <>
            <p className='title'>{document.name}</p>
            <div id='column' className='Chapter'>
                {ruleChapters && ruleChapters.map(renderButton)}
            </div>
        </>
        : <Rules info={chapter} />
}

export default RuleChapters