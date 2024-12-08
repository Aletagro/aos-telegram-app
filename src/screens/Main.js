import React from 'react';
// import {useNavigate} from 'react-router-dom';
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import './styles/Main.css'

const Main = () => {
    // const navigate = useNavigate()

    // const handleNavigateToTest = () => {navigate('developer')}

    return <>
        <HeaderImage src='https://kartinki.pics/uploads/posts/2022-08/thumbs/1660848806_7-kartinkin-net-p-varkhammer-fentezi-malekit-oboi-krasivo-8.jpg' alt='main' />
        <div id='column' className='Chapter'>
            <Row title='Rules' navigateTo='mainRules' />
            <Row title='Builder' navigateTo='chooseGrandAlliance' />
            <Row title='Damage Calculator' navigateTo='calculator' />
            <Row title='Battle Dashboard (Beta Testing)' navigateTo='singlePlayer' />
            <p id='feedbackText'>Card number for support - 5536 9141 9279 5999 (Rukosuev Nikita)</p>
            <p id='feedbackText'>For feedback - @RukosuevKrasavchik</p>
            {/* <button id='testButton' onClick={handleNavigateToTest}>test</button> */}
        </div>
    </>
}

export default Main