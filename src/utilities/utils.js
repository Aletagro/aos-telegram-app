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