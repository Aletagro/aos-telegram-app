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
    const manifestationsLores = []
    lores.forEach(lore => {
        if (spellsIncludesTexts.find(text => lore.name.includes(text))) {
            spellsLores.push(lore)
        } else if (preyersIncludesTexts.find(text => lore.name.includes(text))) {
            preyersLores.push(lore)
        } else {
            manifestationsLores.push(lore)
        }
    })

    const handleAddRegiment = useCallback(() => {
        roster.regiments = [...roster.regiments, emptyRegiment]
        forceUpdate()
    }, [])

    const renderRegiment = (regiment, index) => <Regiment
        regiment={regiment}
        alliganceId={alligance.id}
        index={index}
        forceUpdate={forceUpdate}
    />

    return <div id='column' className='Chapter'>
        <p>Grand Alliance: {roster.grandAlliance}</p>
        <p>Allegiance: {roster.allegiance}</p>
        <p>{roster.points} Points</p>
        {roster.regiments.length < 5 ? <button id='addRegimentButton' onClick={handleAddRegiment}>Add Regiment</button> : null}
        {roster.regiments.length > 0
            ? roster.regiments.map(renderRegiment)
            : null
        }
        <p>Lores</p>
        {spellsLores.length > 0 ? <p>Spell Lore</p> : null}
        {preyersLores.length > 0 ? <p>Prayer Lore</p> : null}
        {manifestationsLores.length > 0 ? <p>Manifestation Lore</p> : null}
    </div>
}

export default Builder