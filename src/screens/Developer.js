import React, {useState} from 'react'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Button from '../components/Button'
import Modal from '../components/Modal'
import {ModalActions, ModalButton} from '../components/ModalActions'
import Tile from '../components/Tile'
import Constants from '../Constants'

import size from 'lodash/size'

import Styles from './styles/Developer.module.css'

const tg = window.Telegram?.WebApp
const href = window.location?.href
const urlParams = new URLSearchParams(href.split('?')[1])
const vkId = urlParams.get('vk_user_id')

const DEFAULT_USER_ID = '5'
// Лимит одного сообщения в Telegram
const MESSAGE_LIMIT = 4096

const Developer = () => {
    const [userId, setUserId] = useState(DEFAULT_USER_ID)
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)

    const isEmpty = !message.trim()
    const isTooLong = size(message) > MESSAGE_LIMIT

    // Параметры уходят в query-строке: URLSearchParams сам кодирует переносы строк (%0A), они доходят до бэкенда как есть
    const send = async (path, params) => {
        setIsSending(true)
        try {
            const response = await fetch(`${Constants.domain}/users/${path}?${new URLSearchParams(params)}`, {method: 'POST', headers: {'Accept': 'application/json'}})
            if (response.ok) {
                toast.success('Sent', Constants.toastParams)
            } else {
                toast.error(`Error ${response.status}`, Constants.toastParams)
            }
        } catch (error) {
            console.error(error)
            toast.error('Network error', Constants.toastParams)
        }
        setIsSending(false)
    }

    const handleSendPersonal = () => send('send_personal_message', {id: userId, message})

    const handleOpenConfirm = () => setIsConfirmVisible(true)

    const handleCloseConfirm = () => setIsConfirmVisible(false)

    const handleSendAll = async () => {
        setIsConfirmVisible(false)
        await send('send_mas_message', {message})
    }

    const renderConfirmContent = () => <>
        <p className={Styles.preview}>{message}</p>
        <ModalActions>
            <ModalButton onClick={handleCloseConfirm}>Cancel</ModalButton>
            <ModalButton type='danger' onClick={handleSendAll}>Send to everyone</ModalButton>
        </ModalActions>
    </>

    return <div id='column' className='Chapter'>
        <h4 className={Styles.title}>Messages</h4>
        <label className={Styles.label}>
            User id (from our database)
            <input className={Styles.input} inputMode='numeric' value={userId} onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))} />
        </label>
        <label className={Styles.label}>
            Message
            <textarea className={Styles.textarea} rows={10} value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
        <p className={`${Styles.counter} ${isTooLong ? Styles.counterOver : ''}`}>{size(message)} / {MESSAGE_LIMIT}</p>
        <div className={Styles.actions}>
            <Button className={Styles.action} disabled={isEmpty || isTooLong || !userId || isSending} onClick={handleSendPersonal}>Send to user</Button>
            <Button className={Styles.action} type='danger' disabled={isEmpty || isTooLong || isSending} onClick={handleOpenConfirm}>Send to everyone</Button>
        </div>
        <details className={Styles.debug}>
            <summary>Debug info</summary>
            <p>initData: {tg?.initData}</p>
            <p>initDataUnsafe: {JSON.stringify(tg?.initDataUnsafe)}</p>
            <p>platform: {tg?.platform}</p>
            <p>version: {tg?.version}</p>
            <p>viewportHeight: {tg?.viewportHeight}</p>
            <p>location: {JSON.stringify(window?.location)}</p>
            <p>vkHref: {JSON.stringify(window?.location?.href)}</p>
            <p>vkId: {vkId}</p>
        </details>
        <div className={Styles.dev}><Tile compact title='Link Accounts' text='Telegram and VK in one account' navigateTo='linkAccounts' /></div>
        <Modal
            visible={isConfirmVisible}
            title='Send to all users?'
            Content={renderConfirmContent}
            onClose={handleCloseConfirm}
        />
        <ToastContainer />
    </div>
}

export default Developer
