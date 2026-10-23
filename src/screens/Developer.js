import React from 'react'

const tg = window.Telegram.WebApp
const href = window.location?.href
const urlParams = new URLSearchParams(href.split('?')[1])
const vkId = urlParams.get('vk_user_id')

const Developer = () => {

    return <div>
        <p>test-6</p>
        <p>initData: {tg.initData}</p>
        <p>initDataUnsafe: {JSON.stringify(tg.initDataUnsafe)}</p>
        <p>platform: {tg.platform}</p>
        <p>version: {tg.version}</p>
        <p>viewportHeight: {tg.viewportHeight}</p>
        <p>location: {JSON.stringify(window?.location)}</p>
        <p>vkHref: {JSON.stringify(window?.location?.href)}</p>
        <p>vkId: {vkId}</p>
    </div>
}

export default Developer