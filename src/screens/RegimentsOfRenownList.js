import React from 'react';
import Constants from '../Constants'
import {sortByName, regimentSortesByGrandAlliances} from '../utilities/utils'
import Row from '../components/Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RegimentsOfRenownList = () => {
    const regimentsOfRenown = sortByName(dataBase.data.ability_group.filter((group) => group.abilityGroupType === 'regimentOfRenown'))

    const sortedRegimentsOfRenown = regimentSortesByGrandAlliances(regimentsOfRenown.map(regiment => {
        const keywords = dataBase.data.warscroll.find(warscroll => warscroll.id === regiment.regimentOfRenownRowImageWarscrollId).referenceKeywords
        return {...regiment, keywords}
    }))

    const renderRow = (regiment) => <Row
        key={regiment.id}
        title={regiment.name}
        navigateTo='regimentOfRenown'
        state={{regiment}}
    />

    const renderRegimentAlliance = (alliance) => <div id='unitTypeContainer' key={alliance.title}>
        <h4 id='unitType'>{alliance.title}</h4>
        {alliance.regiments.map(renderRow)}
    </div>

    return <>
        <img src={Constants.regimentsOfRenownImage} alt='Regiment Of Renown' width='100%' />
        <div id='column' className='Chapter'>
            {sortedRegimentsOfRenown && sortedRegimentsOfRenown.map(renderRegimentAlliance)}
        </div>
    </>
}

export default RegimentsOfRenownList