// Черновик новой партии: пока игроки выбирают армии и миссию, данные лежат здесь (переживают переходы между экранами)
import compact from 'lodash/compact'
import map from 'lodash/map'
import {createGame} from './gameModel'
import {saveGame} from './gameStorage'
import {findTacticCardByName, MISSIONS} from './missionData'

export const SOURCE_SAVED = 'saved'
export const SOURCE_CODE = 'code'
export const SOURCE_MANUAL = 'manual'

const getTelegramName = () => window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || ''

// pending - выбранная, но ещё не подтверждённая армия (ждёт выбора тактик): {index, army, tactics}
export const gameDraft = {players: [], missionId: null, pending: null}

export const resetGameDraft = () => {
    gameDraft.players = [{name: getTelegramName(), army: null, tactics: []}, {name: '', army: null, tactics: []}]
    gameDraft.missionId = null
    gameDraft.pending = null
}
resetGameDraft()

const parseJson = (value, fallback) => {
    try {
        return value ? JSON.parse(value) : fallback
    } catch (error) {
        return fallback
    }
}

// Id карточек тактик из списка (в списке тактики хранятся названиями или объектами с name)
export const getListTacticIds = (list) => compact(map(parseJson(list?.tactics, []), item => findTacticCardByName(typeof item === 'string' ? item : item?.name)?.id)).slice(0, 2)

// Армия игрока из списка с сервера. snapshot - сам список, по нему потом показывается ростер соперника
export const listToArmy = (list, source) => ({
    source,
    name: list.name || list.allegiance,
    allegiance: list.allegiance,
    allegianceId: list.allegiance_id,
    rosterId: list.id,
    snapshot: list
})

export const manualArmy = (allegiance) => ({source: SOURCE_MANUAL, name: allegiance.name, allegiance: allegiance.name, allegianceId: allegiance.id})

export const pickArmy = (playerIndex, army, tactics) => {
    const player = gameDraft.players[playerIndex]
    player.army = army
    player.tactics = tactics || []
}

export const pickRandomMission = () => MISSIONS[Math.floor(Math.random() * MISSIONS.length)].id

// Что мешает начать партию (пустой список, если всё готово)
export const getDraftIssues = (draft = gameDraft) => {
    const issues = []
    draft.players.forEach((player, index) => {
        if (!player.army) issues.push({player: index, type: 'army'})
        if (player.tactics.length !== 2) issues.push({player: index, type: 'tactics'})
    })
    if (!draft.missionId) issues.push({type: 'mission'})
    return issues
}

export const startGame = (draft = gameDraft, now = Date.now()) => {
    const game = createGame({
        id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
        setup: {missionId: draft.missionId},
        players: map(draft.players, (player, index) => ({name: player.name.trim() || `Player ${index + 1}`, army: player.army, tactics: player.tactics})),
        now
    })
    saveGame(game)
    return game
}
