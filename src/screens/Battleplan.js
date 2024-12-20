import React from 'react';
import {useLocation} from 'react-router-dom'
import {replaceAsterisks} from '../utilities/utils'

import Styles from './styles/Battleplan.module.css'

const dataBase = require('../dataBase.json')

const Battleplan = () => {
    const {battleplan} = useLocation().state
    const info = dataBase.data.rule_container_component.filter((component) => component.ruleContainerId === battleplan.id)
    info.sort((a, b) => a.displayOrder - b.displayOrder)
    const imageUrl = info.find(rule => rule.contentType === 'image')?.imageUrl
    const twist = info.find(rule => rule.contentType === 'text')?.textContent
    return <>
        <img src={imageUrl} alt='battleplan' width='100%' />
        <div id='column' className='Chapter'>
        <h3>Twist</h3>
        <p id={Styles.text}>{replaceAsterisks(twist)}</p>
        </div>
    </>
}

export default Battleplan