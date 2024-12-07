import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster, builderFilters} from '../utilities/appState'
import {unitsSortesByType, sortByName} from '../utilities/utils'
import UnitRow from './UnitRow'
import Checkbox from '../components/Checkbox'
import './styles/AddUnit.css'

const dataBase = require('../dataBase.json')

const AddUnit = () => {
    window.scrollTo(0, 0)
    const navigate = useNavigate()
    const [hidePotentialLegends, setHidePotentialLegends] = useState(builderFilters.hidePotentialLegends)
    const {alliganceId, heroId, regimentId, isAuxiliary, isRegimentsOfRenown} = useLocation().state
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === alliganceId).map(item => item.warscrollId)
    let units = []
    let hasPotentialLegends = false

    const hasKeyword = (unitKeywords, requiredKeywordsArray , excludedKeywords) => {
        let isHas = false
        requiredKeywordsArray.forEach((requiredKeywords, index) => {
            // Проверка, что все кейворды обязательные имеются
            const filtredKeywords = unitKeywords.filter(Keyword => requiredKeywords.find(requiredKeyword => requiredKeyword.id === Keyword.keywordId))
            if (requiredKeywords?.length === filtredKeywords?.length) {
                // Проверка, что нет исключающих кейвордов
                if (!unitKeywords.find(unitKeyword => unitKeyword.keywordId === excludedKeywords[index]?.id)) {
                    isHas = true
                }
            }
        })
        return isHas
    }

    const setHasPonentialLegends = (units) => {
        return units.find(unit => {
            if (unit.notes) {
                return unit.notes.includes('Legends on')
            }
            return false
        })
    }

    const filterPonentialLegends = (units) => {
        return units.filter(unit => {
            if (unit.notes) {
                return !unit.notes.includes('Legends on')
            }
            return true
        })
    }

    if (isRegimentsOfRenown) {
        const regimentsOfRenownKeywords = dataBase.data.ability_group_regiment_of_renown_permitted_faction_keyword.filter(keyword => keyword.factionKeywordId === alliganceId)
        units = regimentsOfRenownKeywords.map(keyword => dataBase.data.ability_group.find(group => group.id === keyword.abilityGroupId))
    } else if (isAuxiliary) {
        units = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends && !unit?.referenceKeywords?.includes('Manifestation') && !unit?.referenceKeywords?.includes('Terrain'))
        units = unitsSortesByType(units)
    } else if (heroId) {
        // определяем опция реджимента героя
        const regimentOptions = dataBase.data.warscroll_regiment_option.filter(({warscrollId}) => warscrollId === heroId)
        const regimentOptionsAny = regimentOptions.filter(option => !option.requiredWarscrollId)
        const regimentOptionsOne = regimentOptions.filter(option => option.requiredWarscrollId)
        // находим кейворды обязательных опций
        const optionRequiredKeywords = regimentOptionsAny.map(({id}) => dataBase.data.warscroll_regiment_option_required_keyword.filter(({warscrollRegimentOptionId}) => warscrollRegimentOptionId === id))
        const requiredKeywords = optionRequiredKeywords.map(keywords => keywords.map(keyword => dataBase.data.keyword.find(({id}) => id === keyword?.keywordId)))
        // находим кейворды исключающих опций
        const optionExcludedKeywords = regimentOptionsAny.map(({id}) => dataBase.data.warscroll_regiment_option_excluded_keyword.find(({warscrollRegimentOptionId}) => warscrollRegimentOptionId === id))
        const excludedKeywords = optionExcludedKeywords.map(keyword => dataBase.data.keyword.find(({id}) => id === keyword?.keywordId))
        // определяем всех юнитов фракции
        const allUnits = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends && !unit?.referenceKeywords?.includes('Manifestation') && !unit?.referenceKeywords?.includes('Terrain'))
        // определяем кейворды всех юнитов фракции
        const allUnitsKeywordsIds = allUnits.map(unit => dataBase.data.warscroll_keyword.filter(keyword => keyword.warscrollId === unit.id))
        // ищем нужных нам юнитов
        const legalUnits = allUnitsKeywordsIds.filter(unitKeywordsIds => hasKeyword(unitKeywordsIds, requiredKeywords, excludedKeywords))
        const legalUnitsIds = legalUnits.map(unit => unit[0].warscrollId)
        units = legalUnitsIds.map(legalUnitsId => allUnits.find(unit => unit.id === legalUnitsId))
        // ищем юнитов из опций с обязательным юнитом
        if (regimentOptionsOne.length > 0) {
            const zeroToOneUnits  = regimentOptionsOne.map(option => dataBase.data.warscroll.find(warscroll => warscroll.id === option.requiredWarscrollId))
            units = [...units, ...zeroToOneUnits]
        }
        units = [...new Set(units)]
        hasPotentialLegends = setHasPonentialLegends(units)
        if (hasPotentialLegends && hidePotentialLegends) {
            units = filterPonentialLegends(units)
        }
        units = unitsSortesByType(units)
    } else {
        units = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends && unit.referenceKeywords.includes('Hero') && !unit.requiredPrimaryHeroWarscrollId)
        hasPotentialLegends = setHasPonentialLegends(units)
        if (hasPotentialLegends && hidePotentialLegends) {
            units = filterPonentialLegends(units)
        }
        sortByName(units)
    }

    const handleClick = (unit) => {
        navigate(-1)
        if (isRegimentsOfRenown) {
            roster.regimentOfRenown = unit
        } else if (isAuxiliary) {
            roster.auxiliaryUnits.push(unit)
        } else {
            let newRegiment = {...roster.regiments[regimentId]}
            newRegiment.units = [...roster.regiments[regimentId]?.units, unit]
            newRegiment.points = newRegiment.points + unit.points
            if (!heroId) {
                newRegiment.heroId = unit.id
                // Проверка есть ли у героя привязанные к нему юниты
                const requiredHeroUnits = dataBase.data.warscroll.filter(scroll => scroll.requiredPrimaryHeroWarscrollId === unit.id && !scroll.isSpearhead && !scroll.isLegends)
                if (requiredHeroUnits?.length > 0) {
                    newRegiment.units = [...newRegiment.units, ...requiredHeroUnits]
                }
            }
            roster.regiments[regimentId] = newRegiment
        }
        roster.points = roster.points + (unit.points || unit.regimentOfRenownPointsCost || 0)
    }

    const handleChangeHidePotentialLegends = () => {
        setHidePotentialLegends(!hidePotentialLegends)
        builderFilters.hidePotentialLegends = !hidePotentialLegends
    }

    const renderRow = (unit) => <UnitRow key={unit?.id} unit={unit} onClick={handleClick} isAddUnit/>

    const renderUnitsType = (type) => <div key={type.title}>
        <h4 id='unitType'>{type.title}</h4>
        {type.units.map(renderRow)}
    </div>

    return <div id='column' className='Chapter'>
        {hasPotentialLegends
            ? <div id='potentialLegendsContainer' onClick={handleChangeHidePotentialLegends}>
                <p id='potentialLegends'>Hide Potential Legends</p>
                <Checkbox onClick={handleChangeHidePotentialLegends} checked={hidePotentialLegends} />
            </div>
            : null
        }
        {heroId || isAuxiliary
            ? units.map(renderUnitsType)
            : units.map(renderRow)
        }
    </div>
}

export default AddUnit