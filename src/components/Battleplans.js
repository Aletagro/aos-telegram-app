import React from 'react';
import Row from './Row'
import './styles/Battleplans.css'

const dataBase = require('../dataBase.json')

const Battleplans = ({id}) => {
    const battleplans = dataBase.data.rule_container.filter((group) => group.ruleSectionId === id)
    battleplans.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderRow = (battleplan) => <Row
        key={battleplan.id}
        title={battleplan.title}
        navigateTo='battleplan'
        state={{battleplan}}
    />

    return <div id='column' className='Chapter'>
        {battleplans && battleplans.map(renderRow)}
    </div>
}

export default Battleplans