import React, {useEffect} from 'react'
import {main} from '../utilities/appState'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import malekith from '../images/malekith.png'
import Constants from '../Constants'

import includes from 'lodash/includes'

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
            {includes(Constants.testersIds, user?.id)
                ? <>
                    <Row title='Builder' navigateTo='userLists' />
                    <Row title='Community Lists' navigateTo='lists'/>
                </>
                : <Row title='Builder' navigateTo='chooseGrandAlliance' />
            }
            {/* <Row title='Battle Dashboard' navigateTo='singlePlayer' /> */}
            <Row title='Damage Calculator' navigateTo='calculator' />
            {includes(Constants.testersIds, user?.id) ? null : <Row title='Paste List' navigateTo='pasteList' />}
            {/* {user?.id === Constants.myTgId ? <Row title='Developer Menu' navigateTo='developer' /> : null} */}
            <p id={Styles.feedbackText}>Card number for support - 5536 9141 9279 5999 (Rukosuev Nikita)</p>
            <p id={Styles.feedbackText}>For feedback - @RukosuevKrasavchik</p>
            <p id={Styles.feedbackText}>The database was last updated on 30.07.2025</p>
        </div>
    </>
}

export default Main