import React from 'react'
import {MemoryRouter, Routes, Route} from 'react-router-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import Game from './Game'
import {createGame} from './gameModel'
import {saveGame, getGame} from './gameStorage'
import {MISSIONS, TACTIC_CARDS} from './missionData'

const dataBase = require('../utilities/db')

beforeEach(() => {
    localStorage.clear()
    window.scrollTo = () => {}
    dataBase.data.battle_tactic = []
    dataBase.data.faction_keyword = []
    dataBase.data.rule_container = [{id: MISSIONS[1].id, title: MISSIONS[1].name, subtitle: 'Battleplan 2 (Table 1)'}]
    const game = createGame({id: 'g1', setup: {missionId: MISSIONS[1].id}, players: [
        {name: 'Anna', army: {allegiance: 'Cities of Sigmar', name: 'My list'}, tactics: [TACTIC_CARDS[0].id, TACTIC_CARDS[1].id]},
        {name: 'Boris', army: {allegiance: 'Ossiarch Bonereapers', name: 'Bones'}, tactics: [TACTIC_CARDS[2].id, TACTIC_CARDS[3].id]}
    ], now: 1})
    saveGame(game)
})

const renderGame = () => render(<MemoryRouter initialEntries={[{pathname: '/game', state: {gameId: 'g1'}}]}>
    <Routes><Route path='/game' element={<Game />} /><Route path='/dashboard' element={<p>dashboard</p>} /></Routes>
</MemoryRouter>)

test('партия проходит от выбора первого игрока до результата', () => {
    renderGame()
    expect(screen.getByText('Round 1: who goes first?')).toBeTruthy()
    expect(screen.getByText('Next turn').closest('button').disabled).toBe(true)
    fireEvent.click(screen.getAllByRole('button', {name: 'Anna'})[0])
    expect(screen.getByText(/Turn of/)).toBeTruthy()
    // очки миссии и тактика
    fireEvent.click(screen.getAllByLabelText('Scored')[0])
    fireEvent.click(screen.getByLabelText('Score Search Every Inch'))
    expect(getGame('g1').scores.map(s => s.vp)).toEqual([3, 5])
    expect(screen.getByLabelText('Undo Search Every Inch')).toBeTruthy()
    // дальше до конца партии
    for (let i = 0; i < 10; i++) {
        const info = getGame('g1')
        if (info.status === 'finished') break
        const needsFirst = screen.queryByText(/Round \d: who goes first/)
        if (needsFirst) fireEvent.click(screen.getAllByRole('button', {name: 'Anna'})[0])
        fireEvent.click(screen.getByText(/Next turn|Finish battle/))
    }
    expect(getGame('g1').status).toBe('finished')
    expect(screen.getByText('Anna wins')).toBeTruthy()
    fireEvent.click(screen.getByText('Reopen battle'))
    expect(getGame('g1').status).toBe('playing')
})
