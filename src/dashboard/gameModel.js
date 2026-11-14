// Модель партии дашборда AoS. Все функции чистые: принимают игру и возвращают новую (или ту же, если действие невозможно).
// Каждое действие кладёт снимок в history, поэтому его можно отменить.
import filter from 'lodash/filter'
import find from 'lodash/find'
import sumBy from 'lodash/sumBy'
import {getMissionData, getTacticCard, TACTIC_VP} from './missionData'

export const MAX_ROUNDS = 5
export const HISTORY_LIMIT = 30
export const BASE_CP = 4
export const UNDERDOG_CP = 5
export const STATUS_PLAYING = 'playing'
export const STATUS_FINISHED = 'finished'

export const newPlayer = (data = {}) => ({
    name: data.name || '',
    army: data.army || null, // {allegiance, rosterId?, code?, snapshot?}
    tactics: (data.tactics || []).slice(0, 2),
    cp: []
})

// В снимке для отмены не нужны история и большие списки армий
const withoutHeavy = (game) => ({...game, history: undefined, players: game.players.map(player => player.army?.snapshot ? {...player, army: {...player.army, snapshot: undefined}} : player)})

const snapshot = (game) => JSON.stringify(withoutHeavy(game))

// Новое состояние next идёт в историю предыдущего game
const commit = (game, next, now = Date.now()) => ({
    ...next,
    updatedAt: now,
    history: [...(game.history || []), snapshot(game)].slice(-HISTORY_LIMIT)
})

export const canUndo = (game) => (game.history || []).length > 0

export const undo = (game) => {
    if (!canUndo(game)) return game
    const history = game.history.slice(0, -1)
    const previous = JSON.parse(game.history[game.history.length - 1])
    // списки армий не откатываются: берём из текущей игры
    const players = previous.players.map((player, index) => game.players[index].army?.snapshot ? {...player, army: {...player.army, snapshot: game.players[index].army.snapshot}} : player)
    return {...previous, players, history}
}

const setPlayer = (game, index, change) => ({
    ...game,
    players: game.players.map((player, i) => i === index ? {...player, ...(typeof change === 'function' ? change(player) : change)} : player)
})

// --- Создание партии ---

// setup: {missionId, firstPlayer (0|1)}; players: [{name, army, tactics: [cardId, cardId]}, ...]
export const createGame = ({id, setup = {}, players, now = Date.now()}) => {
    const game = {
        id,
        status: STATUS_PLAYING,
        createdAt: now,
        updatedAt: now,
        missionId: setup.missionId || null,
        roundFirst: [setup.firstPlayer === 0 || setup.firstPlayer === 1 ? setup.firstPlayer : null], // кто ходит первым в каждом раунде (null - ещё не выбран: игроки бросают ролл-офф в начале раунда)
        turn: 0, // номер хода внутри партии: 0..9
        players: players.map(newPlayer),
        scores: [],
        history: []
    }
    return grantRoundCp(game)
}

// --- Раунды и ходы ---

export const getTurnInfo = (game) => {
    const turn = game.turn
    const round = Math.floor(turn / 2) + 1
    const inRound = turn % 2
    const first = game.roundFirst[round - 1] ?? null
    // needsFirst: в начале раунда нужно выбрать, кто ходит первым
    return {turn, round, inRound, first, needsFirst: first === null, playerIndex: first === null ? null : inRound === 0 ? first : 1 - first}
}

// Чей ход под номером turn (для правки прошлых ходов)
export const getTurnPlayer = (game, turn) => {
    const round = Math.floor(turn / 2) + 1
    const first = game.roundFirst[round - 1] ?? null
    return first === null ? null : turn % 2 === 0 ? first : 1 - first
}

// Underdog: игрок с меньшим количеством VP на начало раунда. При равенстве (и в первом раунде) его нет
export const getUnderdog = (game, beforeTurn = game.turn) => {
    const totals = [0, 1].map(index => sumBy(filter(game.scores, s => s.player === index && s.turn < beforeTurn), 'vp'))
    if (beforeTurn === 0 || totals[0] === totals[1]) return null
    return totals[0] < totals[1] ? 0 : 1
}

// В начале раунда оба игрока получают по 4 CP, underdog - 5. CP между раундами сгорают (см. getCp)
const grantRoundCp = (game) => {
    const {round} = getTurnInfo(game)
    const underdog = round === 1 ? null : getUnderdog(game)
    return {...game, players: game.players.map((player, index) => ({
        ...player,
        cp: [...player.cp, {round, type: 'round', amount: underdog === index ? UNDERDOG_CP : BASE_CP}]
    }))}
}

// Кто ходит первым в раунде: выбирает победитель ролл-офф. Менять можно, пока в раунде ещё нет очков
export const setRoundFirst = (game, round, playerIndex, now) => {
    const info = getTurnInfo(game)
    if (game.status === STATUS_FINISHED || round !== info.round || info.inRound !== 0 || info.first === playerIndex) return game
    if (find(game.scores, s => s.turn >= info.turn)) return game
    const roundFirst = [...game.roundFirst]
    roundFirst[round - 1] = playerIndex
    return commit(game, {...game, roundFirst}, now)
}

// Следующий ход. После последнего хода пятого раунда партия завершается
export const advanceTurn = (game, now) => {
    if (game.status === STATUS_FINISHED || getTurnInfo(game).needsFirst) return game
    if (game.turn >= MAX_ROUNDS * 2 - 1) return commit(game, {...game, status: STATUS_FINISHED}, now)
    let next = {...game, turn: game.turn + 1}
    if (next.turn % 2 === 0) {
                // Кто ходит первым, определит ролл-офф: выбор делается через setRoundFirst
        next = {...next, roundFirst: [...next.roundFirst, null]}
        next = grantRoundCp(next)
    }
    return commit(game, next, now)
}

export const finishGame = (game, now) => game.status === STATUS_FINISHED ? game : commit(game, {...game, status: STATUS_FINISHED}, now)

// --- Очки миссии ---

export const getMissionItems = (game, round) => {
    const mission = getMissionData(game.missionId)
    if (!mission) return []
    return filter(mission.items, item => !item.rounds || (item.rounds === 'first' ? round === 1 : round > 1))
}

const hasScore = (game, player, turn, kind, item) => !!find(game.scores, s => s.player === player && s.turn === turn && s.kind === kind && s.item === item)

export const isMissionItemScored = (game, playerIndex, itemId, turn = game.turn) => hasScore(game, playerIndex, turn, 'mission', itemId)

// Пункт нельзя засчитать, если в этот ход уже отмечен несовместимый с ним (см. conflicts в missionData)
export const isMissionItemBlocked = (game, playerIndex, itemId, turn = game.turn) => {
    const items = getMissionItems(game, Math.floor(turn / 2) + 1)
    const item = find(items, ['id', itemId])
    if (!item) return false
    return items.some(other => other.id !== itemId && hasScore(game, playerIndex, turn, 'mission', other.id)
        && ((item.conflicts || []).includes(other.id) || (other.conflicts || []).includes(itemId)))
}

// Включает или выключает пункт подсчёта миссии за ход turn (по умолчанию текущий). Очки идут тому, чей это ход
export const toggleMissionItem = (game, playerIndex, itemId, turn = game.turn, now) => {
    if (game.status === STATUS_FINISHED || getTurnPlayer(game, turn) !== playerIndex || turn > game.turn) return game
    const round = Math.floor(turn / 2) + 1
    const item = find(getMissionItems(game, round), ['id', itemId])
    if (!item) return game
    if (hasScore(game, playerIndex, turn, 'mission', itemId)) {
        return commit(game, {...game, scores: filter(game.scores, s => !(s.player === playerIndex && s.turn === turn && s.kind === 'mission' && s.item === itemId))}, now)
    }
    if (isMissionItemBlocked(game, playerIndex, itemId, turn)) return game
    return commit(game, {...game, scores: [...game.scores, {player: playerIndex, turn, round, kind: 'mission', item: itemId, vp: item.vp}]}, now)
}

// Ручная правка очков (со знаком), если что-то не вписывается в таблицу
export const addManualVp = (game, playerIndex, vp, note = '', now) => {
    if (!vp) return game
    return commit(game, {...game, scores: [...game.scores, {player: playerIndex, turn: game.turn, round: getTurnInfo(game).round, kind: 'manual', item: note, vp}]}, now)
}

export const removeScore = (game, entry, now) => {
    const index = game.scores.indexOf(entry)
    if (index < 0) return game
    return commit(game, {...game, scores: [...game.scores.slice(0, index), ...game.scores.slice(index + 1)]}, now)
}

// --- Карточки тактик ---

// Стадии карточки у игрока: [{type, name, done, turn, round}] и next - тип следующей стадии (null, если все выполнены)
export const getTacticProgress = (game, playerIndex, cardId) => {
    const card = getTacticCard(cardId)
    if (!card) return null
    const done = filter(game.scores, s => s.player === playerIndex && s.kind === 'tactic' && s.card === cardId)
    const stages = card.stages.map(stage => {
        const entry = find(done, ['item', stage.type])
        return {...stage, done: !!entry, turn: entry?.turn, round: entry?.round}
    })
    const next = find(stages, stage => !stage.done)
    return {card, stages, next: next ? next.type : null, total: sumBy(done, 'vp')}
}

// Следующую стадию можно отметить, если карточка у игрока, стадий ещё не все, и в этот ход по этой карточке стадия ещё не была выполнена
export const canScoreTactic = (game, playerIndex, cardId, turn = game.turn) => {
    if (game.status === STATUS_FINISHED || getTurnPlayer(game, turn) !== playerIndex || turn > game.turn) return false
    if (!game.players[playerIndex].tactics.includes(cardId)) return false
    const progress = getTacticProgress(game, playerIndex, cardId)
    if (!progress.next) return false
    return !find(game.scores, s => s.player === playerIndex && s.kind === 'tactic' && s.card === cardId && s.turn === turn)
}

export const scoreTactic = (game, playerIndex, cardId, turn = game.turn, now) => {
    if (!canScoreTactic(game, playerIndex, cardId, turn)) return game
    const {next} = getTacticProgress(game, playerIndex, cardId)
    return commit(game, {...game, scores: [...game.scores, {player: playerIndex, turn, round: Math.floor(turn / 2) + 1, kind: 'tactic', card: cardId, item: next, vp: TACTIC_VP}]}, now)
}

// Снять можно только последнюю выполненную стадию - иначе нарушится порядок
export const canUnscoreTactic = (game, playerIndex, cardId) => {
    const progress = getTacticProgress(game, playerIndex, cardId)
    return !!progress && progress.stages.some(stage => stage.done)
}

export const unscoreTactic = (game, playerIndex, cardId, now) => {
    if (game.status === STATUS_FINISHED || !canUnscoreTactic(game, playerIndex, cardId)) return game
    const doneStages = getTacticProgress(game, playerIndex, cardId).stages.filter(stage => stage.done)
    const last = doneStages[doneStages.length - 1]
    return commit(game, {...game, scores: filter(game.scores, s => !(s.player === playerIndex && s.kind === 'tactic' && s.card === cardId && s.item === last.type))}, now)
}

export const setTactics = (game, playerIndex, cardIds, now) => {
    const unique = [...new Set(cardIds)].filter(id => getTacticCard(id)).slice(0, 2)
    if (find(game.scores, s => s.player === playerIndex && s.kind === 'tactic' && !unique.includes(s.card))) return game
    return commit(game, setPlayer(game, playerIndex, {tactics: unique}), now)
}

// --- Итоги ---

export const getPlayerTotals = (game, playerIndex) => {
    const own = filter(game.scores, ['player', playerIndex])
    const mission = sumBy(filter(own, ['kind', 'mission']), 'vp')
    const tactics = sumBy(filter(own, ['kind', 'tactic']), 'vp')
    const manual = sumBy(filter(own, ['kind', 'manual']), 'vp')
    const rounds = []
    for (let round = 1; round <= MAX_ROUNDS; round++) rounds.push(sumBy(filter(own, ['round', round]), 'vp'))
    return {mission, tactics, manual, total: mission + tactics + manual, rounds}
}

export const getResult = (game) => {
    const players = [getPlayerTotals(game, 0), getPlayerTotals(game, 1)]
    const winner = players[0].total === players[1].total ? null : players[0].total > players[1].total ? 0 : 1
    return {players, winner}
}

// --- Command Points ---

// CP между раундами сгорают: считаются только записи текущего раунда
export const getCp = (game, playerIndex) => sumBy(filter(game.players[playerIndex].cp, ['round', getTurnInfo(game).round]), 'amount')

export const spendCp = (game, playerIndex, amount = 1, note = '', now) => commit(game, setPlayer(game, playerIndex, player => ({
    cp: [...player.cp, {round: getTurnInfo(game).round, type: 'spend', amount: -Math.abs(amount), note}]
})), now)

export const adjustCp = (game, playerIndex, amount, now) => amount ? commit(game, setPlayer(game, playerIndex, player => ({
    cp: [...player.cp, {round: getTurnInfo(game).round, type: 'adjust', amount}]
})), now) : game
