// Статистика по завершённым партиям. «Я» - первый игрок партии (владелец устройства по умолчанию)
import {getResult, STATUS_FINISHED} from './gameModel'

import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import map from 'lodash/map'
import sumBy from 'lodash/sumBy'

export const getFinishedGames = (games) => sortBy(filter(games, ['status', STATUS_FINISHED]), game => -game.updatedAt)

const outcome = (result) => result.winner === null ? 'draws' : result.winner === 0 ? 'wins' : 'losses'

const addTo = (groups, key, result) => {
    const group = groups[key] || (groups[key] = {key, games: 0, wins: 0, draws: 0, losses: 0})
    group.games++
    group[outcome(result)]++
}

const toList = (groups) => sortBy(map(groups, group => group), group => -group.games)

const round1 = (value) => Math.round(value * 10) / 10

export const getStats = (games) => {
    const finished = getFinishedGames(games)
    const stats = {total: finished.length, wins: 0, draws: 0, losses: 0, pointsFor: 0, pointsAgainst: 0}
    const mine = {}
    const opponents = {}
    const missions = {}
    const tactics = {}
    finished.forEach(game => {
        const result = getResult(game)
        stats[outcome(result)]++
        stats.pointsFor += result.players[0].total
        stats.pointsAgainst += result.players[1].total
        addTo(mine, game.players[0].army?.allegianceId || '', result)
        addTo(opponents, game.players[1].army?.allegianceId || '', result)
        addTo(missions, game.missionId || '', result)
        // Тактики первого игрока: сколько раз взял карточку и сколько VP она в среднем принесла
        game.players[0].tactics.forEach(cardId => {
            const group = tactics[cardId] || (tactics[cardId] = {key: cardId, games: 0, vp: 0})
            group.games++
            group.vp += sumBy(filter(game.scores, s => s.player === 0 && s.kind === 'tactic' && s.card === cardId), 'vp')
        })
    })
    stats.winRate = stats.total ? Math.round(stats.wins / stats.total * 100) : 0
    stats.avgFor = stats.total ? round1(stats.pointsFor / stats.total) : 0
    stats.avgAgainst = stats.total ? round1(stats.pointsAgainst / stats.total) : 0
    stats.byArmy = toList(mine)
    stats.byOpponent = toList(opponents)
    stats.byMission = toList(missions)
    stats.byTactic = sortBy(map(tactics, group => ({...group, avg: round1(group.vp / group.games)})), group => -group.games)
    return stats
}
