import React from 'react';
import {useLocation } from 'react-router-dom'
import './styles/Warscroll.css'

const units = {
    Beastlord: {
        name: 'Beastlord',
        move: 6,
        health: 6,
        control: 2,
        save: 4,
        meleeWeapons: [
            {
                name: 'Paired Man-ripper Axes',
                attacks: 5,
                hit: 3,
                wound: 3,
                rend: 1,
                damage: 2,
                weaponAbilities: ['ANTI-HERO (+1 REND)', 'CRIT (2 HITS)']
            }
        ],
        abilities: [
            {
                name: 'Call of Battle',
                phase: 'Combat',
                title: 'Reaction: You declared a Fight ability for this unit',
                effect: 'Pick a friendly non-Hero Brayherd Infanntry unit',
                lore: 'а надо ли?'
            },
            {
                name: 'Hatred of Heroes',
                phase: 'Combat',
                title: 'Passive',
                effect: 'Add 1 to hit and wound rolls',
                lore: 'может и не нужно'
            }
        ],
        unitDetails: {
            quantity: 1,
            cost: 170,
            regimentOptions: ['Any Beasts of Chaos', 'Any Beasts of Chaos']
        },
        keywords: ['HERO', 'INFANTRY', 'CHAOS', 'BEASTS OF CHAOS', 'BEASTLORD']
    }
}

const Warscroll = () => {
    const state = useLocation().state
    const unit = units[state.unit]

    const renderMeleeWeapon = (weapon) => <div className='meleeWeapons'>
        <p className='weaponName'>{weapon.name}</p>
        <p className='weaponA'>A</p>
        <p className='weaponAttacks'>{weapon.attacks}</p>
        <p className='weaponH'>HIT</p>
        <p className='weaponHit'>{weapon.hit}+</p>
        <p className='weaponW'>W</p>
        <p className='weaponWound'>{weapon.wound}+</p>
        <p className='weaponR'>R</p>
        <p className='weaponRend'>{weapon.rend}</p>
        <p className='weaponD'>D</p>
        <p className='weaponDamage'>{weapon.damage}</p>
    </div>

    const renderAbility = (ability) => <div id='ability'>
        <p>{ability.title}</p>
        <h4>{ability.name}</h4>
        <p>Effect: {ability.effect}</p>
        <p>Lore: {ability.lore}</p>
    </div>

    const renderRegimentOption = (option) => <p>- {option}</p>

    const renderKeywords = (keywords) => <p id='keyword'>{keywords}</p>

    return <>
        <h1 className='title'>{unit.name}</h1>
        <div>
            <h4>Characteristics</h4>
            <p>move: {unit.move}</p>
            <p>health: {unit.health}</p>
            <p>control: {unit.control}</p>
            <p>save: {unit.save}+</p>
        </div>
        {unit.meleeWeapons
            ? <>
                <h4>Melee Weapons</h4>
                {unit.meleeWeapons.map(renderMeleeWeapon)}
            </>
            : null
        }
        {unit.abilities
            ? <>
                <h4>Abilities</h4>
                {unit.abilities.map(renderAbility)}
            </>
            : null
        }
        {unit.unitDetails
            ? <>
                <h4>Unit Details</h4>
                <p>{unit.unitDetails.quantity} model</p>
                <p>{unit.unitDetails.cost} points</p>
                <h5>RegimentOptions</h5>
                <p>{unit.unitDetails.regimentOptions.map(renderRegimentOption)}</p>
            </>
            : null
        }
        {unit.keywords
            ? <>
                <h4>Keywords</h4>
                <div id='row' className='keywordsContainer'>
                    {unit.keywords.map(renderKeywords)}
                </div>
            </>
            : null
        }
    </>
}

export default Warscroll