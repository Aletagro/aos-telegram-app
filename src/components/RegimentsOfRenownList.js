import React from 'react';
import {Link} from 'react-router-dom'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const image = 'https://dhss9aar8ocw.cloudfront.net/39478fae-cf03-40ee-a130-6fef03492c44'

const RegimentsOfRenownList = () => {
    const regimentsOfRenown = dataBase.data.ability_group.filter((group) => group.abilityGroupType === 'regimentOfRenown')

    regimentsOfRenown.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    const renderButton = (regiment) => <Link key={regiment.id} to={'regimentOfRenown'} state={{regiment}}>{regiment.name}</Link>

    return <>
        <p className='title'>Regiment Of Renown</p>
        <img src={image} alt='Regiment Of Renown' width='100%' />
        <div id='column' className='Chapter'>
            {regimentsOfRenown && regimentsOfRenown.map(renderButton)}
        </div>
    </>
}

export default RegimentsOfRenownList