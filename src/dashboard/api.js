import Constants from '../Constants'

// Список по id (для кода ростера). Возвращает объект списка или null
export const fetchRoster = async (rosterId) => {
    try {
        const response = await fetch(`${Constants.domain}/rosters_db/roster?${new URLSearchParams({roster_id: rosterId})}`)
        if (!response.ok) return null
        const data = await response.json()
        const list = data?.roster || data
        return list?.id ? list : null
    } catch (error) {
        return null
    }
}
