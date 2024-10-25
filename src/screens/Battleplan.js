import React from 'react';
import {useLocation} from 'react-router-dom'
import Rule from '../components/Rule'
import './styles/Battleplan.css'

const dataBase = require('../dataBase.json')

const Battleplan = () => {
    const {battleplan} = useLocation().state
    const info = dataBase.data.rule_container_component.filter((component) => component.ruleContainerId === battleplan.id)
    info.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderRule = (rule) => <Rule rule={rule} />

    return <div id='column' className='Chapter'>
        {info && info.map(renderRule)}
    </div>
}

export default Battleplan