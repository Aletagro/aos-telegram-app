import {createGame, advanceTurn, addManualVp, scoreTactic, finishGame} from './gameModel'
import {getStats, getFinishedGames} from './gameStats'
import {MISSIONS, TACTIC_CARDS} from './missionData'

const play = (id, vp0, vp1, armies) => {
    let game = createGame({id, setup: {missionId: MISSIONS[0].id, firstPlayer: 0}, players: [
        {name: 'Me', army: {allegianceId: armies[0]}, tactics: [TACTIC_CARDS[0].id]}, {name: 'Opp', army: {allegianceId: armies[1]}, tactics: [TACTIC_CARDS[1].id]}], now: 1})
    if (vp0) game = addManualVp(game, 0, vp0)
    if (id === 'g1') game = scoreTactic(game, 0, TACTIC_CARDS[0].id)
    game = advanceTurn(game)
    if (vp1) game = addManualVp(game, 1, vp1)
    return finishGame(game)
}

test('статистика: победы, ничьи, поражения, средние очки и тактики', () => {
    const games = [play('g1', 5, 4, ['a', 'x']), play('g2', 3, 3, ['a', 'y']), play('g3', 2, 9, ['b', 'x']), createGame({id: 'g4', setup: {}, players: [{name: 'Me'}, {name: 'Opp'}], now: 1})]
    games[0].updatedAt = 3; games[1].updatedAt = 2; games[2].updatedAt = 1
    const stats = getStats(games)
    expect(stats).toMatchObject({total: 3, wins: 1, draws: 1, losses: 1, winRate: 33})
    expect(stats.avgFor).toBe(5)
    expect(stats.byArmy[0]).toMatchObject({key: 'a', games: 2, wins: 1, draws: 1})
    expect(stats.byOpponent[0]).toMatchObject({key: 'x', games: 2, wins: 1, losses: 1})
    expect(stats.byTactic[0]).toMatchObject({key: TACTIC_CARDS[0].id, games: 3, vp: 5})
    expect(stats.byMission[0].games).toBe(3)
    expect(getFinishedGames(games).map(game => game.id)).toEqual(['g1', 'g2', 'g3'])
    expect(getStats([]).total).toBe(0)
})
