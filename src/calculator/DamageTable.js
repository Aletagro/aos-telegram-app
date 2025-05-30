import React from 'react'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Constants from '../Constants'

import map from 'lodash/map'
import size from 'lodash/size'
import replace from 'lodash/replace'

import Styles from './styles/DamageTable.module.css'

const DamageTable = ({units, target}) => {

    const getResultsForAllSaves = (result, rend, mortals) => {
        return Constants.saves.map(save => {
            const _result = result * (Math.min((save.value - 1 + rend), 6) / 6) + mortals
            return  _result.toFixed(2)
        })
    }

    const getDamage = (weapon) => {
        const attacks = weapon.models * weapon.attacks + (weapon.champion ? 1 : 0)
        const hited = attacks * ((7 - weapon.toHit + (weapon.doubleHit ? weapon.critOn?.modificator : 0) - (weapon.autoWound ? weapon.critOn?.modificator : 0) - (weapon.mortal ? 1 : 0)) / 6)
        const autoWounded = weapon.autoWound ? (attacks / 6) * weapon.critOn?.modificator : 0
        const wounded = (hited * ((7 - weapon.toWound) / 6)) + autoWounded
        const damage = wounded * weapon.damage
        const resultBeforeSave = target.ward ? damage * ((target.ward - 1) / 6) : damage
        const rend = target.isEthereal ? 0 : weapon.rend
        const mortals = weapon.mortal ? (attacks * weapon.critOn?.modificator / 6 * weapon.damage) : 0
        const mortalsAfterWard = target.ward ?  mortals * ((target.ward - 1) / 6) : mortals
        const results = getResultsForAllSaves(resultBeforeSave, rend, mortalsAfterWard)
        return results
    }

    const getResults = () => {
        if (units.length === 1) {
            const weapons = units[0].weapons
            weapons.forEach((weapon, index) => {
                data.push(weapon.name || `W ${index + 1}`)
            })
            const _results = weapons.map(weapon => getDamage(weapon))
            if (weapons.length > 1) {
                data.push('SUM')
                _results.push(getSumUnitDamage(_results))
            }
            return _results
        }
        const _results = []
        units.forEach((unit, index) => {
            data.push(unit.name || `U ${index + 1}`)
            const weapons = unit.weapons
            const unitResult = getSumUnitDamage(weapons.map(weapon => getDamage(weapon)))
            _results.push(unitResult)
        })
        return _results
    }

    const getSumUnitDamage = (weaponsDamage) => {
        const sumDamage = Array(weaponsDamage[0].length).fill(0)
        weaponsDamage[0].forEach((_, index) => {
            weaponsDamage.forEach((arr) => {
                const result = Number(sumDamage[index]) + Number(arr[index])
                sumDamage[index] = (result*1).toFixed(2)
            })
        })
        return sumDamage
    }

    const data = ['Save']
    const results = getResults()

    Constants.saves.forEach((save, index) => {
        data.push(save.title)
        results.forEach(result => {
            data.push(Boolean(Number(result[index])) ? result[index] : 0)
        })
    })

    const handleCopy = () => {
         // Находим индекс первого элемента с "+" (начало строк данных)
        const firstDataRowIndex = data.findIndex(item => item.endsWith('+'))
        // Заголовки - все элементы до "2+"
        const headers = map(data.slice(0, firstDataRowIndex), item => replace(item, /\s-\s.*$/, ''))
        const columnCount = size(headers)
        // Преобразуем данные в двумерный массив
        const tableData = [headers]
        const rowCount = (data.length - firstDataRowIndex) / columnCount
        for (let i = 0; i < rowCount; i++) {
            const startIndex = firstDataRowIndex + i * columnCount;
            const row = data.slice(startIndex, startIndex + columnCount);
            tableData.push(row);
        }
        // Рассчитываем максимальную ширину для каждой колонки
        const columnWidths = map(tableData[0], (_, colIndex) =>
            Math.max(...map(tableData, row => String(row[colIndex] || '').length))
        )
        let textToCopy = ''
        textToCopy += tableData[0].map((header, i) => ` ${header.padEnd(columnWidths[i])} `).join('|') + '\n'
        // Разделительная линия
        textToCopy += columnWidths.map(width => '-'.repeat(width + 2)).join('+') + '\n'
        for (let i = 1; i < tableData.length; i++) {
            textToCopy += tableData[i].map((cell, j) => 
            ` ${String(cell).padEnd(columnWidths[j] + 2)} `).join('|') + '\n'
        }
        navigator.clipboard.writeText(textToCopy)
        toast.success('Data Copied', Constants.toastParams)
    }

    const renderCell = (text, index) => {
        const isFirstColumn = (index + 1) % (results.length + 1) === 1
        const isEvenRow = index % ((results.length + 1) * 2) < results.length + 1
        return <p
            id={Styles.text}
            style={{
                'text-align': `${isFirstColumn ? 'start' : 'end'}`,
                'padding-left': `${isFirstColumn ? '4px' : '0px'}`,
                'padding-right': `${isFirstColumn ? '0px' : '4px'}`,
                'background': `${isEvenRow ? '#ECECEC' : ''}`
            }}
        >
            {text || 0}
        </p>
    }

    return <div id={Styles.container} onClick={handleCopy} style={{display: 'grid', 'grid-template-columns': `repeat(${results.length + 1}, 1fr)`}}>
        {data.map(renderCell)}
        <ToastContainer />
    </div>
}

export default DamageTable