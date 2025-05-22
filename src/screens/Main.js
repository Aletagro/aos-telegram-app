import React from 'react'
// import {useNavigate} from 'react-router-dom'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import malekith from '../images/malekith.png'

import Styles from './styles/Main.module.css'

const Main = () => {
    // const navigate = useNavigate()

    // const handleNavigateToTest = () => {navigate('/registration')}

    return <>
        <HeaderImage src={malekith} alt='main' />
        <div id='column' className='Chapter'>
            <Row title='Rules' navigateTo='mainRules' />
            <Row title='Builder' navigateTo='chooseGrandAlliance' />
            {/* <Row title='Builder' navigateTo='lists' /> */}
            <Row title='Battle Dashboard' navigateTo='singlePlayer' />
            <Row title='Damage Calculator' navigateTo='calculator' />
            <p id={Styles.feedbackText}>Card number for support - 5536 9141 9279 5999 (Rukosuev Nikita)</p>
            <p id={Styles.feedbackText}>For feedback - @RukosuevKrasavchik</p>
            <p id={Styles.feedbackText}>The database was last updated on 22.05.2025</p>
            {/* <button id={Styles.testButton} onClick={handleNavigateToTest}>test</button> */}
        </div>
    </>
}

export default Main