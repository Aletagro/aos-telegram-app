import Constants from '../Constants'
import {main} from './appState'

// Часовые пояса России: по ним определяем, что пользователь Телеграма из России (страна в Telegram недоступна)
const RUSSIAN_TIME_ZONES = [
    'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Simferopol', 'Europe/Kirov', 'Europe/Volgograd', 'Europe/Astrakhan',
    'Europe/Saratov', 'Europe/Ulyanovsk', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk',
    'Asia/Barnaul', 'Asia/Tomsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk',
    'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Sakhalin', 'Asia/Srednekolymsk',
    'Asia/Kamchatka', 'Asia/Anadyr'
]

const isRussianTimeZone = () => {
    try {
        return RUSSIAN_TIME_ZONES.includes(Intl.DateTimeFormat().resolvedOptions().timeZone)
    } catch (error) {
        return false
    }
}

// Страна из регистрации в приложении (пользователь вводит её сам)
const isRussianCountry = () => /^(russia|russian federation|россия|рф|rus)$/i.test(String(main.user?.country || '').trim())

// Кнопка связки аккаунтов: в ВК показываем всем, в Телеграме только пользователям из России
export const canLinkAccounts = () => {
    // Оба аккаунта уже связаны - кнопка не нужна
    if (main.user?.tgId && main.user?.vkId) return false
    if (main.vkId) return true
    return Boolean(main.tgId) && (isRussianTimeZone() || isRussianCountry())
}

export const isVkApp = () => Boolean(main.vkId) && !main.tgId

const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/javascript, /; q=0.01'
}

// Бот отправляет код пользователю в личные сообщения
export const generateLinkCode = (userId) => fetch(`${Constants.domain}/users/generate_link_code?${new URLSearchParams({id: userId})}`, {
    method: 'PUT',
    headers: HEADERS
})

// Связывает текущую соцсеть (tgId или vkId) с аккаунтом, к которому относится код
export const linkAccounts = (code) => {
    const params = main.tgId ? {tgId: main.tgId} : {vkId: main.vkId}
    return fetch(`${Constants.domain}/users/link_accounts?${new URLSearchParams({code, ...params})}`, {
        method: 'PUT',
        headers: HEADERS
    })
}

export const fetchCurrentUser = async () => {
    const params = main.tgId ? {tgId: main.tgId} : {vkId: main.vkId}
    const response = await fetch(`${Constants.domain}/users/user?${new URLSearchParams(params)}`)
    const data = await response.json()
    if (data?.exists) main.user = data.user
    return data
}
