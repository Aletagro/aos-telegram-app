import React from 'react';
import Row from './Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const image = 'https://dhss9aar8ocw.cloudfront.net/39478fae-cf03-40ee-a130-6fef03492c44'

const RegimentsOfRenownList = () => {
    const regimentsOfRenown = dataBase.data.ability_group.filter((group) => group.abilityGroupType === 'regimentOfRenown')

    regimentsOfRenown.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    const renderRow = (regiment) => <Row
        key={regiment.id}
        title={regiment.name}
        navigateTo='regimentOfRenown'
        state={{regiment}}
    />

    return <>
        <p className='title'>Regiment Of Renown</p>
        <img src={image} alt='Regiment Of Renown' width='100%' />
        <div id='column' className='Chapter'>
            {regimentsOfRenown && regimentsOfRenown.map(renderRow)}
        </div>
    </>
}

export default RegimentsOfRenownList