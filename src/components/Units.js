import React from 'react';
import {useLocation, Link } from 'react-router-dom'
import './styles/Army.css'

const dataBase = require('../dataBase.json')

const Units = () => {
    const alligance = useLocation().state.alligance
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === alligance.id).map(item => item.warscrollId)
    const units = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId))

    const renderButton = (unit) => <Link to={'warscroll'} state={{unit}}>{unit.name}</Link>

    return <>
        <p className='title'>{alligance.name}</p>
        <div id='column' className='Chapter'>
        {units && units.map(renderButton)}
        </div>
    </>
}

export default Units