import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import './styles/Warscroll.css'

const Warscroll = () => {
    const navigate = useNavigate()
    const unit = useLocation().state.unit

    // const renderMeleeWeapon = (weapon) => <div className='meleeWeapons'>
    //     <p className='weaponName'>{weapon.name}</p>
    //     <p className='weaponA'>A</p>
    //     <p className='weaponAttacks'>{weapon.attacks}</p>
    //     <p className='weaponH'>HIT</p>
    //     <p className='weaponHit'>{weapon.hit}+</p>
    //     <p className='weaponW'>W</p>
    //     <p className='weaponWound'>{weapon.wound}+</p>
    //     <p className='weaponR'>R</p>
    //     <p className='weaponRend'>{weapon.rend}</p>
    //     <p className='weaponD'>D</p>
    //     <p className='weaponDamage'>{weapon.damage}</p>
    // </div>

    // const renderAbility = (ability) => <div id='ability'>
    //     <p>{ability.title}</p>
    //     <h4>{ability.name}</h4>
    //     <p>Effect: {ability.effect}</p>
    //     <p>Lore: {ability.lore}</p>
    // </div>

    // const renderRegimentOption = (option) => <p>- {option}</p>

    // const renderKeywords = (keywords) => <p id='keyword'>{keywords}</p>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <h1 className='title'>{unit.name}</h1>
        <img src={unit.bannerImage} alt={unit.name} />
        <h5>{unit.lore}</h5>
        <div>
            <h4>Characteristics</h4>
            <p>move: {unit.move}</p>
            <p>health: {unit.health}</p>
            <p>control: {unit.control}</p>
            <p>save: {unit.save}</p>
        </div>
        {/* {unit.meleeWeapons
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
        } */}
        <>
            <h4>Unit Details</h4>
            <p>{unit.modelCount} model</p>
            <p>{unit.points} points</p>
            <h5>RegimentOptions</h5>
            <p>-</p>
            <p>Notes: {unit.notes}</p>
            <p>Размер базы: {unit.baseSize}</p>
        </>
        {unit.referenceKeywords
            ? <>
                <h4>Keywords</h4>
                <p>{unit.referenceKeywords}</p>
                {/* <div id='row' className='keywordsContainer'>
                    {unit.keywords.map(renderKeywords)}
                </div> */}
            </>
            : null
        }
    </>
}

export default Warscroll