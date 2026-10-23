import React, {useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {main} from '../utilities/appState'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import malekith from '../images/malekith.png'
import Constants from '../Constants'

import Styles from './styles/Main.module.css'

const tg = window.Telegram?.WebApp
const href = window.location?.href
const urlParams = new URLSearchParams(href.split('?')[1])
main.tgId = tg?.initDataUnsafe?.user
main.vkId = urlParams.get('vk_user_id')
// main.tgId = 530569849
// main.vkId = 45749262

const Main = () => {
    const navigate = useNavigate()
    useEffect(() => {
        if (!main.userReq) {
            main.userReq = true
            const urlQuery = main.tgId ? `tgId=${main.tgId}` : `vkId=${main.vkId}`
            fetch(`${Constants.domain}/users/user?${urlQuery}`)
                .then(response => response.json())
                .then(data => {
                    if (data?.exists) {
                        main.user = data.user
                    } 
                })
                .catch(error => console.error(error))
        }
    }, [])

    const handleSupport = useCallback(() => {
        if (tg) {
            tg.openLink('https://t.me/tribute/app?startapp=dRhg')
        } else {
            window.open('https://web.tribute.tg/d/Rhg', '_blank')
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
            {main?.tgId === Constants.myTgId ? <Row title='Developer Menu' navigateTo='developer' /> : null}
            <button id={Styles.suppotButton} onClick={handleSupport}>Support the app!</button>
            <p id={Styles.feedbackText}>For feedback - @RukosuevKrasavchik</p>
            <p id={Styles.feedbackText} onClick={handleNavigateToDeveloper}>The database was last updated on {Constants.lastUpdate}</p>
        </div>
    </>
}

export default Main