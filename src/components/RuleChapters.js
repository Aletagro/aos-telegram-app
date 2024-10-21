import React from 'react';
import {useLocation} from 'react-router-dom'
import Row from './Row'
import Rules from './Rules'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RuleChapters = () => {
    const {chapter} = useLocation().state
    const ruleChapters = dataBase.data.rule_section.filter((section) => section.parentId === chapter.id)
    ruleChapters.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderRow = (paragraph) => <Row
        key={paragraph.id}
        title={paragraph.name}
        navigateTo='rules'
        state={{paragraph}}
    />

    return ruleChapters.length > 0
        ? <>
            <p className='title'>{document.name}</p>
            <div id='column' className='Chapter'>
                {ruleChapters && ruleChapters.map(renderRow)}
            </div>
        </>
        : <Rules info={chapter} />
}

export default RuleChapters