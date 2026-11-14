import {saveGame, loadGames, getActiveGame, deleteGame, MAX_PLAYING} from './gameStorage'
import {createGame, finishGame} from './gameModel'
import {MISSIONS, TACTIC_CARDS} from './missionData'

const make = (id) => createGame({id, setup: {missionId: MISSIONS[0].id}, players: [{name: 'A', tactics: [TACTIC_CARDS[0].id]}, {name: 'B'}], now: Number(id.slice(1))})

beforeEach(() => localStorage.clear())

test('сохранение, активная партия и удаление', () => {
    saveGame(make('g1'))
    expect(getActiveGame().id).toBe('g1')
    deleteGame('g1')
    expect(loadGames()).toEqual([])
})

test('недоигранных партий не больше лимита, завершённые остаются без истории', () => {
    for (let i = 1; i <= MAX_PLAYING + 2; i++) saveGame(make('g' + i))
    expect(loadGames().filter(g => g.status === 'playing')).toHaveLength(MAX_PLAYING)
    saveGame(finishGame(make('g99')))
    const finished = loadGames().find(g => g.id === 'g99')
    expect(finished.history).toEqual([])
})
