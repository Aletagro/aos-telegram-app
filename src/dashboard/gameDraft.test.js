import {gameDraft, resetGameDraft, pickArmy, getDraftIssues, listToArmy, getListTacticIds, startGame, SOURCE_SAVED} from './gameDraft'
import {TACTIC_CARDS, MISSIONS} from './missionData'
import {loadGames} from './gameStorage'

beforeEach(() => { localStorage.clear(); resetGameDraft() })

test('список -> армия и тактики', () => {
    const list = {id: 'x', name: 'My list', allegiance: 'Cities of Sigmar', allegiance_id: 'a1', tactics: JSON.stringify(['Burning for Vengeance', 'Smokescreen', 'Unknown'])}
    expect(getListTacticIds(list)).toEqual([TACTIC_CARDS[0].id, TACTIC_CARDS[5].id])
    expect(listToArmy(list, SOURCE_SAVED)).toMatchObject({name: 'My list', allegianceId: 'a1', rosterId: 'x'})
    expect(getListTacticIds({tactics: 'broken'})).toEqual([])
})

test('партия не стартует без армий, двух тактик и миссии', () => {
    expect(getDraftIssues().map(i => i.type)).toEqual(['army', 'tactics', 'army', 'tactics', 'mission'])
    const ids = [TACTIC_CARDS[0].id, TACTIC_CARDS[1].id]
    pickArmy(0, {name: 'A'}, ids)
    pickArmy(1, {name: 'B'}, ids)
    gameDraft.missionId = MISSIONS[0].id
    expect(getDraftIssues()).toEqual([])
})

test('startGame сохраняет партию', () => {
    const ids = [TACTIC_CARDS[0].id, TACTIC_CARDS[1].id]
    pickArmy(0, {name: 'A'}, ids)
    pickArmy(1, {name: 'B'}, ids)
    gameDraft.missionId = MISSIONS[2].id
    const game = startGame()
    expect(loadGames()[0].id).toBe(game.id)
    expect(game.players[1].name).toBe('Player 2')
})
