import React, {useEffect} from 'react'
import {main} from '../utilities/appState'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import malekith from '../images/malekith.png'
import Constants from '../Constants'

import Styles from './styles/Main.module.css'

const tg = window.Telegram.WebApp

const Main = () => {
    const user = tg.initDataUnsafe?.user

    useEffect(() => {
        if (!main.userReq) {
            main.userReq = true
            fetch(`https://aoscom.online/users/user_by_tg_id?tg_id=${user?.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data?.exists) {
                        main.user = data.user
                    } 
                })
                .catch(error => console.error(error))
        }
    }, [user?.id])

    return <>
        <HeaderImage src={malekith} alt='main' />
        <div id='column' className='Chapter'>
            <Row title='Rules' navigateTo='mainRules' />
            <Row title='Builder' navigateTo='userLists' />
            <Row title='Community Lists' navigateTo='lists'/>
            <Row title='Spearhead' navigateTo='spearhead'/>
            {/* <Row title='Battle Dashboard' navigateTo='singlePlayer' /> */}
            <Row title='Damage Calculator' navigateTo='calculator' />
            {/* {user?.id === Constants.myTgId ? <Row title='Developer Menu' navigateTo='developer' /> : null} */}
            <p id={Styles.feedbackText}>Card number for support - 5536 9141 9279 5999 (Rukosuev Nikita)</p>
            <p id={Styles.feedbackText}>For feedback - @RukosuevKrasavchik</p>
            <p id={Styles.feedbackText}>The database was last updated on {Constants.lastUpdate}</p>
        </div>
    </>
}

export default Main