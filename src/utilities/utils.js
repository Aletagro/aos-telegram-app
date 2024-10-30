import Constants from '../Constants'

export const sortByName = (array) => 
    array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

export const unitsSortesByType = (units) => {
    const getUnitsByType = (type) => {
        const _units = units.filter(unit => unit?.referenceKeywords.includes(type.name) && (type.withoutHero ? !unit.referenceKeywords.includes('Hero') : true))
        if (_units.length > 0) {
            sortByName(_units)
            return {units: _units, title: type.name}
        } else {
            return null
        }
    }
    return Constants.unitsTypes.map(getUnitsByType).filter(Boolean)
}

export const getErrors = (roster) => {
    const errors = []
    if (!roster) {
        return errors
    }
    if (roster.points > 2000) {
        errors.push('You use more than 2000 points')
    }
    if (!roster.battleFormation) {
        errors.push('Choose Battle Formation')
    }
    if (roster.generalRegimentIndex === null) {
        errors.push('Choose General')
    }
    const uniqueUnits = []
    roster.regiments.forEach((regiment, index) => {
        if (index === roster.generalRegimentIndex && regiment.units.length > 5) {
            errors.push("In General's Regiment you have more than 4 units")
        } else if (regiment.units.length > 4){
            errors.push(`In regiment ${index + 1} you have more than 3 units`)
        }
        regiment.units.forEach(unit => {
            if (unit.referenceKeywords.includes('Unique')) {
                uniqueUnits.push(unit.name)
            }
        })
    })
    const duplicateUniqueUnits = uniqueUnits.filter((unit, index, units) => {
        return units.indexOf(unit) !== index;
    })
    duplicateUniqueUnits.forEach(unit => {
        errors.push(`You have more then one ${unit}`)
    })
    return errors
}

export const getWarnings = (roster) => {
    const warnings = []
    if (!roster) {
        return warnings
    }
    if (!roster.manifestationLore) {
        warnings.push('Choose Manifestations Lore')
    }
    if (roster.allegiance === 'Ogor Mawtribes' && !roster.factionTerrain) {
        warnings.push('Choose Faction Terrain')
    }
    if (roster.allegiance === 'Disciples of Tzeentch' && !roster.spellsLore) {
        warnings.push('Choose Spells Lore')
    }
    return warnings
}