import React from 'react';
import {setCloudStorageItem, getCloudStorageItem} from '@telegram-apps/sdk';

const tg = window.Telegram.WebApp

const Developer = () => {

    const handleAddInStorage = () => {
        tg.CloudStorage?.setItem('key', 'value')
    }

    const handleAddInStorageSDK = () => {
        setCloudStorageItem('sdk', 'value')
    }

    return <div>
        <p>test</p>
        <p>initData: {tg.initData}</p>
        <p>initDataUnsafe: {JSON.stringify(tg.initDataUnsafe)}</p>
        <p>platform: {tg.platform}</p>
        <p>version: {tg.version}</p>
        <p>viewportHeight: {tg.viewportHeight}</p>
        <p>CloudStorageKeys: {JSON.stringify(tg.CloudStorage?.getKeys())}</p>
        <p>CloudStorageValue: {tg.CloudStorage?.getItem('key')}</p>
        <p>CloudStorageValueSDK: {getCloudStorageItem('sdk')}</p>
        <button onClick={handleAddInStorage}>setItemInCloudStorage</button>
        <button onClick={handleAddInStorageSDK}>setItemInCloudStorageSDK</button>
    </div>
}

export default Developer