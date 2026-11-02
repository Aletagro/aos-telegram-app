import React, {useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {main} from '../utilities/appState'
import Button from '../components/Button'
import Tile from '../components/Tile'
import HeaderImage from '../components/HeaderImage'
import malekith from '../images/malekith.png'
import Constants from '../Constants'

import Styles from './styles/Main.module.css'

const tg = window.Telegram?.WebApp
const href = window.location?.href
const urlParams = new URLSearchParams(href.split('?')[1])
main.tgId = tg?.initDataUnsafe?.user?.id
main.vkId = urlParams.get('vk_user_id')
// Для локальных тестов: id из .env.development.local (в git не попадает) подставляется только при npm start.
// В боевую сборку (npm run build / deploy) этот блок не попадает, поэтому запушить его по ошибке нельзя
if (process.env.NODE_ENV === 'development') {
    if (process.env.REACT_APP_DEV_TG_ID) main.tgId = Number(process.env.REACT_APP_DEV_TG_ID)
    if (process.env.REACT_APP_DEV_VK_ID) main.vkId = process.env.REACT_APP_DEV_VK_ID
}

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
        <div className={Styles.hero}>
            <HeaderImage src={malekith} alt='main' />
            <div className={Styles.heroShade} />
        </div>
        <div className={Styles.menu}>
            <Tile featured title='Builder' text='Build and save your army lists' navigateTo='userLists' />
            <div className={Styles.grid}>
                <Tile compact title='Rules' text='Armies, warscrolls, core rules' navigateTo='mainRules' />
                <Tile compact title='Community Lists' text='Lists from other players' navigateTo='lists' />
                <Tile compact title='Damage Calculator' text='Averages for any attack' navigateTo='calculator' />
                <Tile compact title='Spearhead' text='Quick-play armies' navigateTo='spearhead' />
            </div>
            {/* <Tile compact title='Battle Dashboard' navigateTo='singlePlayer' /> */}
            {main?.tgId === Constants.myTgId ? <div className={Styles.dev}><Tile compact title='Developer Menu' navigateTo='developer' /></div> : null}
            <Button className={Styles.support} onClick={handleSupport}>Support the app!</Button>
            <p className={Styles.footer}>For feedback - <b>@RukosuevKrasavchik</b></p>
            <p className={Styles.footer} onClick={handleNavigateToDeveloper}>The database was last updated on {Constants.lastUpdate}</p>
        </div>
    </>
}

export default Main