import React from 'react';
import Constants from '../Constants'
import Row from '../components/Row'
import './styles/ChooseGrandAlliance.css'

const ChooseGrandAlliance = () => {

    const renderRow = (grandAlliance) => <Row
        key={grandAlliance.id}
        title={grandAlliance.name}
        navigateTo='chooseFaction'
        state={{grandAlliance}}
    />

    return  <div id='column' className='Chapter'>
        <h4 id='unitType'>Choose your Grand Alliance</h4>
        {Constants.grandAlliances.map(renderRow)}
    </div>
}

export default ChooseGrandAlliance