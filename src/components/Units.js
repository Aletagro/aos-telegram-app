import React from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom'
import './styles/Army.css'

const dataBase = require('../dataBase.json')

const Units = () => {
    const navigate = useNavigate()
    const alligance = useLocation().state.alligance
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === alligance.id).map(item => item.warscrollId)
    const units = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends)
    const heroes = units.filter(unit => unit.referenceKeywords.includes('Hero'))
    const infantries = units.filter(unit => unit.referenceKeywords.includes('Infantry') && !unit.referenceKeywords.includes('Hero'))
    const cavalries = units.filter(unit => unit.referenceKeywords.includes('Cavalry') && !unit.referenceKeywords.includes('Hero'))
    const beasts = units.filter(unit => unit.referenceKeywords.includes('Beast') && !unit.referenceKeywords.includes('Hero'))
    const monsters = units.filter(unit => unit.referenceKeywords.includes('Monster') && !unit.referenceKeywords.includes('Hero'))
    const manifestations = units.filter(unit => unit.referenceKeywords.includes('Manifestation'))
    const factionTerrain = units.filter(unit => unit.referenceKeywords.includes('Faction Terrain'))

    const setSort = (items) => items.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    setSort(heroes)
    setSort(cavalries)
    setSort(infantries)
    setSort(beasts)
    setSort(monsters)
    setSort(manifestations)
    setSort(factionTerrain)

    const renderButton = (unit) => <Link key={unit?.id} to={'warscroll'} state={{unit}}>{unit?.name}</Link>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <p className='title'>{alligance.name}</p>
        <img src={alligance.factionHeaderImage} alt={alligance.name} width='100%' />
        <div id='column' className='Chapter'>
        {heroes.length > 0
            ? <>
                <h4>Hero</h4>
                {heroes.map(renderButton)}
            </>
            : null
        }
        {infantries.length > 0
            ? <>
                <h4>Infantry</h4>
                {infantries.map(renderButton)}
            </>
            : null
        }
        {cavalries.length > 0
            ? <>
                <h4>Cavalry</h4>
                {cavalries.map(renderButton)}
            </>
            : null
        }
        {beasts.length > 0
            ? <>
                <h4>Beast</h4>
                {beasts.map(renderButton)}
            </>
            : null
        }
        {monsters.length > 0
            ? <>
                <h4>Monster</h4>
                {monsters.map(renderButton)}
            </>
            : null
        }
        {manifestations.length > 0
            ? <>
                <h4>Manifestation</h4>
                {manifestations.map(renderButton)}
            </>
            : null
        }
        {factionTerrain.length > 0
            ? <>
                <h4>Faction Terrain</h4>
                {factionTerrain.map(renderButton)}
            </>
            : null
        }
        </div>
    </>
}

export default Units