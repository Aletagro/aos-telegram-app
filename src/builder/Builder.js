import React, {useCallback, useReducer} from 'react';
import {useLocation} from 'react-router-dom'
import {roster} from './roster'
import Regiment from './Regiment'
import './styles/Builder.css'

const dataBase = require('../dataBase.json')

const spellsIncludesTexts = ['Lore of', 'Spell Lore', 'Arcane']
const preyersIncludesTexts = ['Prayer', 'Bless', 'Rites', 'Warbeats', 'Scriptures']

const emptyRegiment = {
    units: [],
    heroId: '',
    points: 0
}

const Builder = () => {
    const {alligance} = useLocation().state
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const lores = dataBase.data.lore.filter(lore => lore.factionId === alligance.id)
    const spellsLores = []
    const preyersLores = []
    const manifestationsLores = dataBase.data.lore.filter(lore => lore.factionId === null)
    lores.forEach(lore => {
        if (spellsIncludesTexts.find(text => lore.name.includes(text))) {
            spellsLores.push(lore)
        } else if (preyersIncludesTexts.find(text => lore.name.includes(text))) {
            preyersLores.push(lore)
        } else {
            manifestationsLores.push(lore)
        }
    })
    if (spellsLores.length === 1 && !roster.spellsLore) {
        roster.spellsLore = spellsLores[0].name
    }
    if (preyersLores.length === 1 && !roster.prayersLore) {
        roster.prayersLore = preyersLores[0].name
    }
    if (manifestationsLores.length === 1 && !roster.manifestationLore) {
        roster.manifestationLore = manifestationsLores[0].name
    }

    const handleAddRegiment = useCallback(() => {
        roster.regiments = [...roster.regiments, emptyRegiment]
        forceUpdate()
    }, [])

    const handleChangeLore = (rosterLoreName) => (e) => {
        roster[rosterLoreName] = e.target.value
        forceUpdate()
    }

    const renderRegiment = (regiment, index) => <Regiment
        key={index}
        regiment={regiment}
        alliganceId={alligance.id}
        index={index}
        forceUpdate={forceUpdate}
    />

    const renderLore = (rosterLoreName) => (lore) => <div id='chooseLoreContainer'>
        <p>{lore.name}</p>
        <input
            type='radio'
            name={rosterLoreName}
            value={lore.name}
            checked={lore.name === roster[rosterLoreName]}
            onChange={handleChangeLore(rosterLoreName)}
        />
    </div>

    const renderLores = (lores, loreType, rosterLoreName) => lores.length === 1
        ? <p>{loreType}: <b>{lores[0].name}</b></p>
        : <div>
            <p>{loreType}</p>
            {lores.map(renderLore(rosterLoreName))}
        </div>

    return <div id='column' className='Chapter'>
        <p>Grand Alliance: {roster.grandAlliance}</p>
        <p>Allegiance: {roster.allegiance}</p>
        <p>{roster.points} Points</p>
        {roster.regiments.length < 5 ? <button id='addRegimentButton' onClick={handleAddRegiment}>Add Regiment</button> : null}
        {roster.regiments.length > 0
            ? roster.regiments.map(renderRegiment)
            : null
        }
        <h4>Lores</h4>
        {spellsLores.length > 0 ? renderLores(spellsLores, 'Spell Lore', 'spellsLore') : null}
        {preyersLores.length > 0 ? renderLores(preyersLores, 'Prayer Lore', 'prayersLore') : null}
        {manifestationsLores.length > 0 ? renderLores(manifestationsLores, 'Manifestation Lore', 'manifestationLore') : null}
    </div>
}

export default Builder