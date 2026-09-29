import React, {useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {main} from '../utilities/appState'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import malekith from '../images/malekith.png'
import Constants from '../Constants'

import Styles from './styles/Main.module.css'

const tg = window.Telegram?.WebApp

const Main = () => {
    const navigate = useNavigate()
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

    const handleSupport = useCallback(() => {
        console.log('handleSupport')
        const webDonateUrl = 'https://web.tribute.tg/d/Rhg'
        if (tg) {
            console.log(1)
            tg.openLink(webDonateUrl)
        } else {
            console.log(2)
            window.open(webDonateUrl, '_blank')
        }
    }, [])

    const handleSupportTwo = useCallback(() => {
        console.log('handleSupport-2')
        const webDonateUrl = 'https://t.me/tribute/app?startapp=dRhg'
        if (tg) {
            console.log(1)
            tg.openLink(webDonateUrl)
        } else {
            console.log(2)
            window.open(webDonateUrl, '_blank')
        }
    }, [])

    const handleNavigateToDeveloper = useCallback(() => {
        navigate(`/developer`)
    }, [navigate])

    return <>
        <HeaderImage src={malekith} alt='main' />
        <div id='column' className='Chapter'>
            <Row title='Rules' navigateTo='mainRules' />
            <Row title='Builder' navigateTo='userLists' />
            <Row title='Community Lists' navigateTo='lists'/>
            <Row title='Spearhead' navigateTo='spearhead'/>
            {/* <Row title='Battle Dashboard' navigateTo='singlePlayer' /> */}
            <Row title='Damage Calculator' navigateTo='calculator' />
            {user?.id === Constants.myTgId ? <Row title='Developer Menu' navigateTo='developer' /> : null}
            {user?.id === Constants.myTgId
                ? <button id={Styles.suppotButton} onClick={handleSupport}>Support the app!</button>
                : null
            }
            {user?.id === Constants.myTgId
                ? <button id={Styles.suppotButton} onClick={handleSupportTwo}>Support the app 2!</button>
                : null
            }
            <p id={Styles.feedbackText}>For feedback - @RukosuevKrasavchik</p>
            <p id={Styles.feedbackText} onClick={handleNavigateToDeveloper}>The database was last updated on {Constants.lastUpdate}</p>
        </div>
    </>
}

export default Main