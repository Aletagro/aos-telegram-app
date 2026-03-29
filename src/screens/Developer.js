import React from 'react'
import bridge from '@vkontakte/vk-bridge'

const tg = window.Telegram.WebApp

const Developer = () => {
    bridge.send('VKWebAppGetLaunchParams')
    .then((data) => { 
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })

    return <div>
        <p>test</p>
        <p>initData: {tg.initData}</p>
        <p>initDataUnsafe: {JSON.stringify(tg.initDataUnsafe)}</p>
        <p>platform: {tg.platform}</p>
        <p>version: {tg.version}</p>
        <p>viewportHeight: {tg.viewportHeight}</p>
    </div>
}

export default Developer