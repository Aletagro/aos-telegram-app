import React from 'react';
import Constants from '../Constants'
import {sortByName} from '../utilities/utils'
import Row from '../components/Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const RegimentsOfRenownList = () => {
    const regimentsOfRenown = dataBase.data.ability_group.filter((group) => group.abilityGroupType === 'regimentOfRenown')

    sortByName(regimentsOfRenown)

    const renderRow = (regiment) => <Row
        key={regiment.id}
        title={regiment.name}
        navigateTo='regimentOfRenown'
        state={{regiment}}
    />

    return <>
        <img src={Constants.regimentsOfRenownImage} alt='Regiment Of Renown' width='100%' />
        <div id='column' className='Chapter'>
            {regimentsOfRenown && regimentsOfRenown.map(renderRow)}
        </div>
    </>
}

export default RegimentsOfRenownList