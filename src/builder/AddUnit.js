import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster} from './roster'
import {unitsSortesByType} from '../utilities/utils'
import UnitRow from './UnitRow'
import './styles/Builder.css'

const dataBase = require('../dataBase.json')

const AddUnit = () => {
    const navigate = useNavigate()
    const {alliganceId, heroId, regimentId} = useLocation().state
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === alliganceId).map(item => item.warscrollId)
    let units = []

    const hasKeyword = (unitKeywords, requiredKeywords , excludedKeywords) => {
        let isHas = false
        unitKeywords.forEach((keyword, index) => {
            // определяем есть ли у юнита нужный кейворд
            const isFound = requiredKeywords.find((requiredKeyword, index) => {
                if (requiredKeyword) {
                   return requiredKeyword?.id === keyword.keywordId
                }
                // если requiredKeyword нет, тогда сразу проверся на запрещающие кейворды
                if (!unitKeywords.find(unitKeyword => unitKeyword.keywordId === excludedKeywords[index]?.id)) {
                    isHas = true
                }
                return false
            })
            if (isFound) {
                // находим индекс кейворда среди requiredKeywords
                const keywordIndex = requiredKeywords.findIndex(requiredKeyword => requiredKeyword.id === isFound.id)
                // проверяем найденного юнита на запрещающие кейворды
                if (!unitKeywords.find(unitKeyword => unitKeyword.keywordId === excludedKeywords[keywordIndex]?.id)) {
                    isHas = true
                }
            }
        })
        return isHas
    }

    if (heroId) {
        // определяем опция реджимента героя
        const regimentOptions = dataBase.data.warscroll_regiment_option.filter(({warscrollId}) => warscrollId === heroId)
        // находим кейворды обязательных опций
        const optionRequiredKeywords = regimentOptions.map(({id}) => dataBase.data.warscroll_regiment_option_required_keyword.find(({warscrollRegimentOptionId}) => warscrollRegimentOptionId === id))
        const requiredKeywords = optionRequiredKeywords.map(keyword => dataBase.data.keyword.find(({id}) => id === keyword?.keywordId))
        // находим кейворды исключающих опций
        const optionExcludedKeywords = regimentOptions.map(({id}) => dataBase.data.warscroll_regiment_option_excluded_keyword.find(({warscrollRegimentOptionId}) => warscrollRegimentOptionId === id))
        const excludedKeywords = optionExcludedKeywords.map(keyword => dataBase.data.keyword.find(({id}) => id === keyword?.keywordId))
        // определяем всех юнитов фракции
        const allUnits = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends && !unit.referenceKeywords.includes('Manifestation'))
        // определяем кейворды всеъ юнитов фракции
        const allUnitsKeywordsIds = allUnits.map(unit => dataBase.data.warscroll_keyword.filter(keyword => keyword.warscrollId === unit.id))
        // ищем нужных нам юнитов
        const legalUnits = allUnitsKeywordsIds.filter(unitKeywordsIds => hasKeyword(unitKeywordsIds, requiredKeywords, excludedKeywords))
        const legalUnitsIds = legalUnits.map(unit => unit[0].warscrollId)
        units = legalUnitsIds.map(legalUnitsId => allUnits.find(unit => unit.id === legalUnitsId))
        units = unitsSortesByType(units)
    } else {
        units = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends && unit.referenceKeywords.includes('Hero'))
    }

    const handleClick = (unit) => {
        navigate(-1)
        let newRegiment = {...roster.regiments[regimentId]}
        newRegiment.units = [...roster.regiments[regimentId]?.units, unit]
        newRegiment.points = newRegiment.points + unit.points
        if (!heroId) {
            newRegiment.heroId = unit.id
        }
        roster.regiments[regimentId] = newRegiment
        roster.points = roster.points + unit.points
    }

    const renderRow = (unit) => <UnitRow key={unit?.id} unit={unit} onClick={handleClick}/>

    const renderUnitsType = (type) => <div key={type.title}>
        <h4 id='unitType'>{type.title}</h4>
        {type.units.map(renderRow)}
    </div>

    return <div id='column' className='Chapter'>
        {heroId
            ? units.map(renderUnitsType)
            : units.map(renderRow)
        }
    </div>
}

export default AddUnit