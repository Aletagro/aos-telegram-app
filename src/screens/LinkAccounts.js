import React, {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Constants from '../Constants'
import {main} from '../utilities/appState'
import {generateLinkCode, linkAccounts, fetchCurrentUser, isVkApp} from '../utilities/linkAccounts'
import FloatingLabelInput from '../components/FloatingLabelInput'
import InfoNote from '../components/InfoNote'
import Button from '../components/Button'

import Styles from './styles/LinkAccounts.module.css'

const inputStyle = {
    width: '100%',
    marginBottom: '16px'
}

// Связка аккаунтов Telegram и VK. Если аккаунт в этом приложении уже есть - получаем код (его пришлёт бот),
// если нет - вводим код, полученный в другой соцсети
const LinkAccounts = () => {
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [isSending, setIsSending] = useState(false)
    const hasAccount = Boolean(main.user?.id)
    const otherApp = isVkApp() ? 'Telegram' : 'VK'
    const thisApp = isVkApp() ? 'VK' : 'Telegram'

    const handleGetCode = useCallback(async () => {
        setIsSending(true)
        try {
            const response = await generateLinkCode(main.user.id)
            if (response.ok) {
                toast.success('Code sent to you by the bot', Constants.toastParams)
            } else {
                toast.error('Could not get a code, try again later', Constants.toastParams)
            }
        } catch (error) {
            toast.error('Could not get a code, try again later', Constants.toastParams)
        }
        setIsSending(false)
    }, [])

    const handleChangeCode = useCallback((e) => setCode(e.target.value.trim()), [])

    const handleSendCode = useCallback(async () => {
        setIsSending(true)
        try {
            const response = await linkAccounts(code)
            if (response.ok) {
                await fetchCurrentUser()
                toast.success('Accounts linked', Constants.toastParams)
                navigate('/')
            } else {
                toast.error('Invalid code', Constants.toastParams)
            }
        } catch (error) {
            toast.error('Could not link accounts, try again later', Constants.toastParams)
        }
        setIsSending(false)
    }, [code, navigate])

    return <div id='column' className='Chapter'>
        {hasAccount
            ? <>
                <InfoNote title='Link accounts'>
                    <p>Use your lists in both Telegram and VK.</p>
                    <p>Tap "Get code": the bot will send you a short code in a private message. Then open the app in {otherApp}, choose to link an existing account and enter the code there.</p>
                </InfoNote>
                <Button className={Styles.button} disabled={isSending} onClick={handleGetCode}>Get code</Button>
            </>
            : <>
                <InfoNote title='Link accounts'>
                    <p>Already have an account in {otherApp}? Open the app there, go to "Link accounts" and tap "Get code". Then enter the code from the bot here, and this {thisApp} account will be linked to it.</p>
                </InfoNote>
                <FloatingLabelInput
                    style={inputStyle}
                    onChange={handleChangeCode}
                    label='Code'
                    value={code}
                />
                <Button className={Styles.button} disabled={!code || isSending} onClick={handleSendCode}>Link account</Button>
            </>
        }
        <ToastContainer />
    </div>
}

export default LinkAccounts
