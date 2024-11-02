import React from 'react';
import Constants from '../Constants'
import './styles/DamageTable.css'

const DamageTable = ({weapons, target}) => {

    const getResultsForAllSaves = (result, rend, mortals) => {
        return Constants.saves.map(save => {
            const _result = result * (Math.min((save.value - 1 + rend), 6) / 6) + mortals
            return  _result.toFixed(2)
        })
    }

    const getDamage = (weapon) => {
        const attacks = weapon.models * weapon.attacks + (weapon.champion ? 1 : 0)
        const hited = attacks * ((7 - weapon.toHit + (weapon.doubleHit ? weapon.critOn?.modificator : 0) - (weapon.autoWound ? weapon.critOn?.modificator : 0) - (weapon.mortal ? 1 : 0)) / 6)
        const autoWounded = weapon.autoWound ? (attacks / 6) : 0
        const wounded = (hited * ((7 - weapon.toWound) / 6)) + autoWounded
        const damage = wounded * weapon.damage
        const resultBeforeSave = target.ward ? damage * ((target.ward - 1) / 6) : damage
        const rend = target.isEthereal ? 0 : weapon.rend
        const mortals = weapon.mortal ? (attacks * weapon.critOn?.modificator / 6 * weapon.damage) : 0
        const mortalsAfterWard = target.ward ?  mortals * ((target.ward - 1) / 6) : mortals
        const results = getResultsForAllSaves(resultBeforeSave, rend, mortalsAfterWard)
        return results
    }

    const results = weapons.map(weapon => getDamage(weapon))
    const data = ['Save']
    weapons.forEach((weapon, index) => {
        data.push(weapon.name || `Weapon ${index + 1}`)
    })
    Constants.saves.forEach((save, index) => {
        data.push(save.title)
        results.forEach(result => {
            data.push(Boolean(Number(result[index])) ? result[index] : 0)
        })
    })

    const renderCell = (text, index) => {
        const isFirstColumn = (index + 1) % (weapons.length + 1) === 1
        const isEvenRow = index % ((weapons.length + 1) * 2) < weapons.length + 1
        return <p
            id='damageTableText'
            style={{
                'text-align': `${isFirstColumn ? 'start' : 'end'}`,
                'padding-left': `${isFirstColumn ? '4px' : '0px'}`,
                'padding-right': `${isFirstColumn ? '0px' : '4px'}`,
                'background': `${isEvenRow ? 'rgb(236, 222, 183)' : ''}`
            }}
        >
            {text || 0}
        </p>
    }

    return  <div>
        <div style={{display: 'grid', 'grid-template-columns': `repeat(${weapons.length + 1}, 1fr)`}}>
            {data.map(renderCell)}
        </div>
    </div>
}

export default DamageTable