import React from 'react'
import bridge from '@vkontakte/vk-bridge'

const tg = window.Telegram.WebApp

const Developer = () => {
    console.log(window)
    let vkUser = {}
    let vkError = {}
    bridge.send('VKWebAppGetLaunchParams')
    .then((data) => { 
        vkUser = data
    })
    .catch((error) => {
        vkError=(error)
    })

    return <div>
        <p>test-3</p>
        <p>initData: {tg.initData}</p>
        <p>initDataUnsafe: {JSON.stringify(tg.initDataUnsafe)}</p>
        <p>platform: {tg.platform}</p>
        <p>version: {tg.version}</p>
        <p>viewportHeight: {tg.viewportHeight}</p>
        <p>vkUser: {JSON.stringify(window?.location)}</p>
        <p>vkError: {JSON.stringify(vkError)}</p>
    </div>
}

export default Developer