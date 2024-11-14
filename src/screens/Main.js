import React from 'react';
import {useNavigate} from 'react-router-dom';
import Row from '../components/Row'
import Constants from '../Constants'
import './styles/Main.css'

const Main = () => {
    const navigate = useNavigate()

    const handleNavigateToTest = () => {navigate('developer')}

    const renderRow = (grandAlliance) => <Row
        key={grandAlliance.id}
        title={grandAlliance.name}
        navigateTo='catalog'
        state={{grandAlliance}}
    />

    return <>
        <img src='https://kartinki.pics/uploads/posts/2022-08/thumbs/1660848806_7-kartinkin-net-p-varkhammer-fentezi-malekit-oboi-krasivo-8.jpg' alt='main' width='100%' />
        <div id='column' className='Chapter'>
            <Row title='Core Documents' navigateTo='coreDocuments' />
            {Constants.grandAlliances.map(renderRow)}
            <Row title='Regiment Of Renown' navigateTo='regimentOfRenownList' />
            <Row title='Manifestations' navigateTo='manifestations' />
            <Row title='Builder' navigateTo='chooseGrandAlliance' />
            <Row title='Damage Calculator' navigateTo='calculator' />
            <p id='feedbackText'>Card number for support - 5536 9141 9279 5999 (Rukosuev Nikita)</p>
            <p id='feedbackText'>For feedback - @RukosuevKrasavchik</p>
            {/* <button id='testButton' onClick={handleNavigateToTest}>test</button> */}
        </div>
    </>
}

export default Main