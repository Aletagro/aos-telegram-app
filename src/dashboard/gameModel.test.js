import {
    createGame, getTurnInfo, advanceTurn, getUnderdog, getCp, toggleMissionItem, getMissionItems, scoreTactic, canScoreTactic, unscoreTactic,
    getTacticProgress, getPlayerTotals, getResult, spendCp, adjustCp, undo, canUndo, setRoundFirst, setTactics, addManualVp, getSeizer, isTacticsBlocked, STATUS_FINISHED
} from './gameModel'
import {MISSIONS, TACTIC_CARDS} from './missionData'
import {isMissionItemBlocked} from './gameModel'

const BURN = TACTIC_CARDS[0].id
const BLAZE = TACTIC_CARDS[1].id
const mission = MISSIONS[1] // Bloodstained Coasts: пункты зависят от раунда
const newGame = (first = 0) => createGame({id: 'g', setup: {missionId: mission.id, firstPlayer: first}, players: [{name: 'A', tactics: [BURN, BLAZE]}, {name: 'B', tactics: [BURN]}], now: 1})

describe('данные', () => {
    test('12 миссий и 6 карточек, у каждой карточки три стадии по порядку', () => {
        expect(MISSIONS).toHaveLength(12)
        expect(TACTIC_CARDS).toHaveLength(6)
        TACTIC_CARDS.forEach(card => expect(card.stages.map(s => s.type)).toEqual(['affray', 'strike', 'domination']))
    })
})

describe('ходы, CP и underdog', () => {
    test('первого игрока каждого раунда выбирают отдельно, без выбора ход не переключается', () => {
        let game = newGame(1)
        const order = []
        for (let i = 0; i < 10; i++) {
            const info = getTurnInfo(game)
            if (info.needsFirst) {
                expect(advanceTurn(game)).toBe(game)
                game = setRoundFirst(game, info.round, 0)
            }
            order.push(getTurnInfo(game).playerIndex)
            game = advanceTurn(game)
        }
        expect(order).toEqual([1, 0, 0, 1, 0, 1, 0, 1, 0, 1])
        expect(game.status).toBe(STATUS_FINISHED)
    })

    test('CP: по 4 в раунд, 5 у underdog, между раундами сгорают', () => {
        let game = newGame()
        expect([getCp(game, 0), getCp(game, 1)]).toEqual([4, 4])
        game = spendCp(game, 0, 1)
        game = toggleMissionItem(game, 0, 'obj1')
        game = advanceTurn(advanceTurn(game))
        expect(getUnderdog(game)).toBe(1)
        expect([getCp(game, 0), getCp(game, 1)]).toEqual([4, 5])
    })

    test('при равных очках underdog нет', () => {
        let game = advanceTurn(advanceTurn(newGame()))
        expect(getUnderdog(game)).toBeNull()
    })

    test('трата и правка CP', () => {
        let game = spendCp(newGame(), 0, 1, 'strat')
        game = adjustCp(game, 0, 2)
        expect(getCp(game, 0)).toBe(5)
    })

    test('первого игрока раунда можно сменить, пока нет очков', () => {
        let game = setRoundFirst(newGame(), 1, 1)
        expect(getTurnInfo(game).playerIndex).toBe(1)
        game = toggleMissionItem(game, 1, 'obj1')
        expect(setRoundFirst(game, 1, 0)).toBe(game)
    })
})

describe('очки миссии', () => {
    test('очки получает только тот, чей ход; повторное нажатие снимает', () => {
        let game = newGame()
        expect(toggleMissionItem(game, 1, 'obj1')).toBe(game)
        game = toggleMissionItem(game, 0, 'obj1')
        game = toggleMissionItem(game, 0, 'obj2')
        expect(getPlayerTotals(game, 0).mission).toBe(6)
        game = toggleMissionItem(game, 0, 'obj1')
        expect(getPlayerTotals(game, 0).mission).toBe(3)
    })

    test('пункты, зависящие от раунда', () => {
        let game = newGame()
        expect(getMissionItems(game, 1).map(i => i.id)).toEqual(['obj1', 'obj2', 'more'])
        expect(getMissionItems(game, 2).map(i => i.id)).toEqual(['obj1', 'obj2', 'captured'])
        expect(toggleMissionItem(game, 0, 'captured')).toBe(game)
    })

    test('очки в одном раунде могут превышать 10 и считаются по раундам', () => {
        let game = newGame()
        ;['obj1', 'obj2', 'more'].forEach(id => { game = toggleMissionItem(game, 0, id) })
        game = addManualVp(game, 0, 2, 'bonus')
        expect(getPlayerTotals(game, 0)).toMatchObject({total: 12, rounds: [12, 0, 0, 0, 0]})
    })
})

describe('карточки тактик', () => {
    test('стадии строго по порядку, одна стадия по карточке за ход', () => {
        let game = newGame()
        expect(getTacticProgress(game, 0, BURN).next).toBe('affray')
        game = scoreTactic(game, 0, BURN)
        expect(canScoreTactic(game, 0, BURN)).toBe(false)
        expect(canScoreTactic(game, 0, BLAZE)).toBe(true) // другая карточка в тот же ход можно
        expect(scoreTactic(game, 0, BURN)).toBe(game)
        game = advanceTurn(game)
        expect(getTurnInfo(game).playerIndex).toBe(1)
    })

    test('все три стадии за три хода, 15 очков, затем карточка закрыта', () => {
        let game = newGame()
        for (let i = 0; i < 3; i++) {
            for (let k = 0; k < 4 && getTurnInfo(game).playerIndex !== 0; k++) {
                game = getTurnInfo(game).needsFirst ? setRoundFirst(game, getTurnInfo(game).round, 0) : advanceTurn(game)
            }
            game = scoreTactic(game, 0, BURN)
            game = advanceTurn(game)
        }
        expect(getTacticProgress(game, 0, BURN)).toMatchObject({next: null, total: 15})
        expect(getPlayerTotals(game, 0).tactics).toBe(15)
    })

    test('чужую карточку и чужой ход отметить нельзя', () => {
        const game = newGame()
        expect(canScoreTactic(game, 0, TACTIC_CARDS[2].id)).toBe(false)
        expect(canScoreTactic(game, 1, BURN)).toBe(false)
    })

    test('снять можно только последнюю стадию', () => {
        let game = newGame()
        game = scoreTactic(game, 0, BURN)
        game = unscoreTactic(game, 0, BURN)
        expect(getTacticProgress(game, 0, BURN).next).toBe('affray')
        expect(getPlayerTotals(game, 0).tactics).toBe(0)
    })

    test('смена тактик запрещена, если по убираемой уже есть очки', () => {
        let game = scoreTactic(newGame(), 0, BURN)
        expect(setTactics(game, 0, [BLAZE])).toBe(game)
        expect(setTactics(game, 0, [BURN, TACTIC_CARDS[3].id]).players[0].tactics).toEqual([BURN, TACTIC_CARDS[3].id])
    })
})

describe('отмена и итог', () => {
    test('undo возвращает прошлое состояние', () => {
        let game = newGame()
        expect(canUndo(game)).toBe(false)
        game = toggleMissionItem(game, 0, 'obj1')
        game = advanceTurn(game)
        game = undo(game)
        expect(getTurnInfo(game).turn).toBe(0)
        game = undo(game)
        expect(getPlayerTotals(game, 0).total).toBe(0)
        expect(canUndo(game)).toBe(false)
    })

    test('победитель определяется по очкам', () => {
        let game = toggleMissionItem(newGame(), 0, 'obj1')
        expect(getResult(game).winner).toBe(0)
        game = addManualVp(game, 1, 3)
        expect(getResult(game).winner).toBeNull()
    })
})

describe('Avalanche of Ash: очки сгорают', () => {
    const avalanche = () => createGame({id: 'a', setup: {missionId: MISSIONS[2].id, firstPlayer: 0}, players: [{name: 'A', tactics: [BURN]}, {name: 'B', tactics: [BURN]}], now: 1})
    const total = (game) => getPlayerTotals(game, 0).mission

    test('нет объектов: только два пункта про терраин (10 VP максимум)', () => {
        let game = toggleMissionItem(avalanche(), 0, 'noObjectives')
        expect(isMissionItemBlocked(game, 0, 'obj1')).toBe(true)
        expect(toggleMissionItem(game, 0, 'obj2')).toBe(game)
        expect(toggleMissionItem(game, 0, 'more')).toBe(game)
        game = toggleMissionItem(game, 0, 'terrain')
        expect(total(game)).toBe(10)
    })

    test('2+ объекта: терраин не засчитывается, 1 объект: нет пункта «2 или больше»', () => {
        let game = toggleMissionItem(avalanche(), 0, 'obj2')
        expect(isMissionItemBlocked(game, 0, 'terrain')).toBe(true)
        expect(isMissionItemBlocked(game, 0, 'noObjectives')).toBe(true)
        game = toggleMissionItem(avalanche(), 0, 'terrain')
        game = toggleMissionItem(game, 0, 'obj1')
        game = toggleMissionItem(game, 0, 'more')
        expect(total(game)).toBe(10)
        expect(isMissionItemBlocked(game, 0, 'obj2')).toBe(true)
    })

    test('после снятия отметки пункт снова доступен', () => {
        let game = toggleMissionItem(avalanche(), 0, 'noObjectives')
        game = toggleMissionItem(game, 0, 'noObjectives')
        expect(isMissionItemBlocked(game, 0, 'obj1')).toBe(false)
    })
})

describe('захват инициативы', () => {
    const setup = () => advanceTurn(advanceTurn(newGame(0))) // раунд 2, первый игрок ещё не выбран

    test('победитель ролл-офф, ходивший вторым и взявший первый ход, делает соперника underdog и не может выполнять тактики', () => {
        let game = setRoundFirst(setup(), 2, 1, 1)
        expect(getSeizer(game, 2)).toBe(1)
        expect(getUnderdog(game, 2)).toBe(0)
        expect(game.players[0].cp.filter(c => c.type === 'round' && c.round === 2).map(c => c.amount)).toEqual([5])
        expect(game.players[1].cp.filter(c => c.type === 'round' && c.round === 2).map(c => c.amount)).toEqual([4])
        expect(isTacticsBlocked(game, 1)).toBe(true)
    })

    test('если первый ход отдали (победитель ролл-офф другой), захвата нет', () => {
        const game = setRoundFirst(setup(), 2, 1, 0)
        expect(getSeizer(game, 2)).toBe(null)
        expect(isTacticsBlocked(game, 1)).toBe(false)
    })

    test('обычный выбор первого игрока не даёт захвата', () => {
        const game = setRoundFirst(setup(), 2, 0, 0)
        expect(getSeizer(game, 2)).toBe(null)
        expect(isTacticsBlocked(game, 0)).toBe(false)
    })

    test('если соперник лидирует на 11 VP и больше, захвата нет', () => {
        let game = addManualVp(newGame(0), 0, 11)
        game = setRoundFirst(advanceTurn(advanceTurn(game)), 2, 1, 1)
        expect(getSeizer(game, 2)).toBe(null)
        expect(getUnderdog(game, 2)).toBe(1) // обычное правило: меньше VP
        expect(isTacticsBlocked(game, 1)).toBe(false)
    })

    test('underdog остаётся им, пока соперник сам не захватит инициативу', () => {
        let game = setRoundFirst(setup(), 2, 1, 1) // игрок 1 захватил в раунде 2, игрок 0 - underdog
        game = addManualVp(game, 0, 3)
        game = advanceTurn(advanceTurn(game)) // раунд 3
        game = setRoundFirst(game, 3, 1, 1) // игрок 1 ходит первым снова, захвата нет (он и так ходил первым)
        expect(getSeizer(game, 3)).toBe(null)
        expect(getUnderdog(game, 4)).toBe(0)
        game = advanceTurn(advanceTurn(game)) // раунд 4
        game = setRoundFirst(game, 4, 0, 0) // игрок 0 ходил вторым и захватывает
        expect(getSeizer(game, 4)).toBe(0)
        expect(getUnderdog(game, 6)).toBe(1)
    })
})
