// Вставка списка: формат (наше приложение, WH AoS, Listbot) определяется автоматически
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {MemoryRouter, Routes, Route} from 'react-router-dom'
import PasteList from './PasteList'
import {roster} from '../utilities/appState'

const dataBase = require('../utilities/db')
dataBase.setDatabase(require('../dataBase.json'))

const our = `Grand Alliance: Order
Faction: Stormcast Eternals
Battle Formation: Some Formation
Battle Tactics Cards: Intercept and Recover
Drops: 2

-----
Regiment 1
General's regiment
1 x Lord-Celestant (100 points)
5 x Liberators (90 points)
----
Wounds: 10
190/2000 Pts
`
const whaos = `My list
Order | Stormcast Eternals | Some Formation
General's Regiment
Lord-Celestant (100)
• General
Liberators (90)
Auxiliary Units
Vanguard-Hunters (110)
300/2000pts
`
const listbot = `Stormcast Eternals
Some Formation
[Intercept and Recover]

- 1 x Lord-Celestant (100)
[General]
- 5 x Liberators (90)

300/2000pts
`
const missing = our.replace('Liberators', 'Nonexistent Guys')

const run = (text) => {
    render(<MemoryRouter initialEntries={['/paste']}><Routes><Route path='/paste' element={<PasteList />} /><Route path='/builder' element={<div>BUILDER</div>} /></Routes></MemoryRouter>)
    fireEvent.change(document.querySelector('textarea'), {target: {value: text}})
    fireEvent.click(screen.getByText('Import list'))
}

test('our app', () => {
    run(our)
    expect(screen.getByText('BUILDER')).toBeTruthy()
    expect(roster.allegiance).toBe('Stormcast Eternals')
    expect(roster.regiments[0].units.length).toBe(2)
})
test('whaos', () => {
    run(whaos)
    expect(screen.getByText('BUILDER')).toBeTruthy()
    expect(roster.allegiance).toBe('Stormcast Eternals')
    expect(roster.auxiliaryUnits.length).toBe(1)
})
test('listbot', () => {
    run(listbot)
    expect(screen.getByText('BUILDER')).toBeTruthy()
    expect(roster.regiments[0].units.length).toBe(2)
})
test('garbage', () => {
    run('hello world')
    expect(screen.getByText(/Could not recognize/)).toBeTruthy()
})
test('missing unit gives note', () => {
    run(missing)
    expect(screen.getByText(/Unit not found and skipped: Nonexistent Guys/)).toBeTruthy()
    fireEvent.click(screen.getByText('Open list'))
    expect(screen.getByText('BUILDER')).toBeTruthy()
})

// Реальные варианты списков: запятые в конце строк (Telegram), новый формат WH AoS без разделителей, список без шапки, улучшения через точку
const withCommas = "Grand Alliance: Order  \nFaction: Cities of Sigmar  \nBattle Formation: Stalwart Guardians  \nBattle Tactics Cards: Legend of the Parch and Burning for Vengeance  \nDrops: 2  \n  \nSpell Lore: Spells of the Collegiate Arcane  \nPrayer Lore: Scriptures of Sigmar  \nManifestation Lore: Primal Energy (10 pts)  \nFaction Terrain: Dawners Triumph  \n━━━━━━━━━━  \nRegiment 1  \n1 x Cannonade Cogfort (530 points)  \n[Ironweld Innovations]: Prototype Arco-Combustor Uninhibitor,  \n1 x Alchemite Warforger (140 points)  \n[Artefact]: The Sphere Celestial  \n[Heroic Trait]: Cosmopolitan Leader,  \n1 x Jorvan Kreel, Heir of the Kraken (120 points),  \n━━━━━━━━━━  \nRegiment 2  \nGeneral's regiment  \n1 x Erasmus Zonn, the Enlightened One (160 points),  \n10 x Freeguild Cavaliers (370 points),  \n[Decorations for Valour]: Twin-Tailed Comet of Honour  \n10 x Freeguild Cavaliers (360 points),  \n10 x Freeguild Steelhelms (110 points),  \n3 x Freeguild Command Corps Adjutants (200 points),  \n2 x Freeguild Command Corps Auxiliaries (0 points),  \n1 x Freeguild Command Corps Whisperblade (0 points),  \n━━━━━━━━━━  \n  \nWounds: 132  \n2000/2000 Pts"
const whaosNew = "Ossiarch Bonereapers\nRemorseless Conquerors\nGeneral's Handbook 2026-27\nDrops: 2\nWounds: 124\nSpell Lore - Lore of Ossian Sorcery\nManifestation Lore - Horrors of the Necropolis\n\nBattle Tactic Cards: Siege of Ashes, Flanking Firestorm\n\nGeneral's Regiment\nKatakros, Mortarch of the Necropolis (450)\n• General\nKavalos War Chariot (140)\nTeratic Cohort (90)\nLiege-Kavalos on War Chariot (180)\n• Shard of the Necris\nMortis Reapers (110)\n\nRegiment 1\nMortisan Soulmason (140)\n• Immaculate Defender\nImmortis Guard (300)\n• Reinforced\nMorghast Archai (480)\n• Reinforced\n• Elongated Tibias (10)\nMortek Guard (100)\n\nFaction Terrain\nBone-tithe Nexus"
const headerless = "Battle Formation: Coven of Blood (20 pts)\nBurning for Vengeance\nSiege of Ashes\nDrops: 2\n\nSpell Lore: Lore of Shadows\nPrayer Lore: Prayers of the Khainite Cult\nManifestation Lore: Manifestations of Khaine\nFaction Terrain: Shrine of Dark Tribute (20 pts)\n━━━━━━━━━━\nRegiment 1\nGeneral's regiment\n1 x Morathi-Khaine (770 points)\n1 x The Shadow Queen (0 points)\n1 x Scourge of Aqshy: Melusai Ironscale (150 points)\n[Artefact]: Witchbrew\n[Heroic Trait]: Loyal Unto Death\n10 x Blood Sisters (340 points)\n5 x Khinerai Lifetakers (110 points)\n━━━━━━━━━━\nRegiment 2\n1 x Krethusa the Croneseer (220 points)\n9 x Khainite Shadowstalkers (130 points)\n20 x Witch Aelves (240 points)"
const bulletFormat = "Grand Alliance: Destruction\nFaction: Ironjawz\nBattle Formation: Ironjawz Brawl\nBattle Tactics Cards: Blazing Onslaught and Siege of Ashes\nDrops: 4\n\nSpell Lore: Lore of the Weird\nPrayer Lore: Warbeats\nManifestation Lore: Manifestations of Gorkamorka\nFaction Terrain: Bossrokk Tower\n\n\nRegiment 1 — General's regiment\n1 x Kragnos, the End of Empires (580 points)\n1 x Zoggrok Anvilsmasha (160 points)\n   • 1 x Grunta-tongs\n10 x Scourge of Aqshy: Brutes (340 points)\n  • 2 x Gore-choppa\n\nRegiment 2\n1 x Weirdnob Shaman (110 points)\n10 x Scourge of Aqshy: Brutes (340 points)\n  • 2 x Gore-choppa\n\nRegiment 3\n\nRegiment 4\n1 x Warchanter (110 points)\n   • Weird Skullz\n   • An Eye For Da Fight\n10 x Scourge of Aqshy: Brutes (340 points)\n  • 2 x Gore-choppa\n\n\n\nWounds: 127\n1980/2000 Pts"

test('trailing commas from Telegram are ignored', () => {
    run(withCommas)
    expect(screen.getByText('BUILDER')).toBeTruthy()
    expect(roster.allegiance).toBe('Cities of Sigmar')
    expect(roster.regiments.map(r => r.units.length)).toEqual([3, 7])
    expect(roster.generalRegimentIndex).toBe(1)
    expect(roster.battleFormation).toBe('Stalwart Guardians')
})
test('new WH AoS format', () => {
    run(whaosNew)
    expect(screen.getByText('BUILDER')).toBeTruthy()
    expect(roster.allegiance).toBe('Ossiarch Bonereapers')
    expect(roster.battleFormation).toBe('Remorseless Conquerors')
    expect(roster.regiments.map(r => r.units.length)).toEqual([5, 4])
    expect(roster.generalRegimentIndex).toBe(0)
})
test('list without header: faction comes from battle formation', () => {
    run(headerless)
    expect(screen.getByText('BUILDER')).toBeTruthy()
    expect(roster.allegiance).toBe('Daughters of Khaine')
    expect(roster.battleFormation).toBe('Coven of Blood')
    expect(roster.points.battleFormation).toBe(20)
    expect(roster.tactics.length).toBe(2)
})
test('bullet format: enhancements by name, weapons, typed bullets', () => {
    run(bulletFormat)
    expect(screen.getByText('BUILDER')).toBeTruthy()
    expect(roster.generalRegimentIndex).toBe(0)
    const units = roster.regiments.flatMap(r => r.units)
    expect(units.find(unit => unit.name === 'Warchanter').heroicTrait).toBeTruthy()
    expect(units.find(unit => unit.name === 'Zoggrok Anvilsmasha').weaponOptions).toBeTruthy()
    expect(Object.values(units.find(unit => unit.name === 'Scourge of Aqshy: Brutes').weaponOptions)[0]['Gore-choppa']).toBe(2)
})
