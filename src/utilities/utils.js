import parse from 'html-react-parser';
import Constants from '../Constants'

export const sortByName = (array) => 
    array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

export const unitsSortesByType = (units) => {
    const getUnitsByType = (type) => {
        const _units = units.filter(unit => unit?.referenceKeywords.includes(type.name) && (type.withoutHero ? !unit.referenceKeywords.includes('Hero') : true))
        if (_units.length > 0) {
            sortByName(_units)
            return {units: _units, title: type.name.replace(/,/g, '')}
        } else {
            return null
        }
    }
    return Constants.unitsTypes.map(getUnitsByType).filter(Boolean)
}

export const regimentSortesByGrandAlliances = (regiments) => {
    const getRegimentByGrandAlliances = (grandAlliance) => {
        const _regiments = regiments.filter(regiment => regiment.keywords.includes(grandAlliance.name))
        if (_regiments.length > 0) {
            sortByName(_regiments)
            return {regiments: _regiments, title: grandAlliance.name}
        } else {
            return null
        }
    }
    return Constants.grandAlliances.map(getRegimentByGrandAlliances).filter(Boolean)
}

export const getErrors = (roster) => {
    const errors = []
    if (!roster) {
        return errors
    }
    if (roster.points > 2000) {
        errors.push('You use more than 2000 points')
    }
    if (!roster.battleFormation  && !roster.withoutBattleFormation) {
        errors.push('Choose Battle Formation')
    }
    if (roster.generalRegimentIndex === null) {
        errors.push('Choose General')
    }
    const uniqueUnits = []
    roster.regiments.forEach((regiment, index) => {
        if (index === roster.generalRegimentIndex && regiment.units.length > 5) {
            errors.push("In General's Regiment you have more than 4 units")
        } else if (index !== roster.generalRegimentIndex && regiment.units.length > 4){
            errors.push(`In Regiment ${index + 1} you have more than 3 units`)
        }
        regiment.units.forEach(unit => {
            if (unit.referenceKeywords.includes('Unique')) {
                uniqueUnits.push(unit.name)
            }
        })
    })
    roster.auxiliaryUnits.forEach(unit => {
        if (unit.referenceKeywords.includes('Unique')) {
            uniqueUnits.push(unit.name)
        }
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
        let hasWizard = false
        roster.regiments.forEach((regiment, index) => {
            regiment.units.forEach(unit => {
                if (unit.referenceKeywords.includes('Wizard')) {
                    hasWizard = true
                }
            })
        })
        roster.auxiliaryUnits.forEach(unit => {
            if (unit.referenceKeywords.includes('Wizard')) {
                hasWizard = true
            }
        })
        if(Constants.regimentOfRenownsWithWizard.find(regimentOfRenown => regimentOfRenown?.id === roster.regimentOfRenown?.id)) {
            hasWizard = true
        }
        if (hasWizard) {
            warnings.push('Choose Manifestations Lore')
        }
    }
    if (roster.allegiance === 'Ogor Mawtribes' && !roster.factionTerrain) {
        warnings.push('Choose Faction Terrain')
    }
    if (roster.allegiance === 'Disciples of Tzeentch' && !roster.spellsLore) {
        warnings.push('Choose Spells Lore')
    }
    return warnings
}

export const getAvToDice = (count) => {
    const arr = [...Array(count+1).keys()]
    let sum = 0
    arr.forEach(number => sum = sum + number)
    return sum / count
}

export const getValue = (value) => {
    if (Number(value)) {
        return value
    }
    const splitedValue = value.toLowerCase().split('d')
    if (splitedValue.length === 2) {
        let average
        if (Number(splitedValue[1])) {
            average = getAvToDice(Number(splitedValue[1]))
        } else {
            const valueAfterD = splitedValue[1].split('').filter(item => item.trim())
            if (Number(valueAfterD[0])) {
                average = getAvToDice(Number(valueAfterD[0]))
            } else {
                return undefined
            }
            if (valueAfterD[1] === '-') {
                return average * (Number(splitedValue[0]) || 1) - Number(valueAfterD[2])
            } else {
                return average * (Number(splitedValue[0]) || 1) + Number(valueAfterD[2])
            }
        }
        if (splitedValue[0]) {
            return average * Number(splitedValue[0])
        } else {
            return average
        }
    }
}

export const capitalizeFirstLetter = (text) => {
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

export const camelCaseToWords = (text) => {
    if (text) {
        const result = text.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
    return text
}

export const getWoundsCount = (roster) => {
    let woundsCount = 0
    roster.regiments.forEach(regiment => {
        regiment.units.forEach(unit => {
            woundsCount = woundsCount + (unit.modelCount * (unit.isReinforced ? 2 : 1) * unit.health)
        })
    })
    if (roster.auxiliaryUnits.length > 0) {
        roster.auxiliaryUnits.forEach(unit => {
            woundsCount = woundsCount + (unit.modelCount * (unit.isReinforced ? 2 : 1) * unit.health)
        })
    }
    if (roster.regimentOfRenown) {
        roster.regimentsOfRenownUnits.forEach(unit => {
            woundsCount = woundsCount + (unit.modelCount * (unit.isReinforced ? 2 : 1) * unit.health)
        })
    }
    return woundsCount
}

export const replaceAsterisks = (string) => {
    if (string) {
        let newString = string.replace(/(\*\*\*(.*?)\*\*\*)|(\*\*(.*?)\*\*)|(\*(.*?)\*)/g, (match, p1, p2, p3, p4, p5, p6) => {
            if (p1) {
                return `<b><i>${p2}</i></b>`;
            } else if (p3) {
                return `<b>${p4}</b>`;
            } else if (p5) {
                return `<i>${p6}</i>`;
            }
            return match; // На случай, если ничего не подошло
        });
        if (newString.includes('<')) {
            return parse(newString)
        } else {
            return string
        }
    }
    return string
}

export const replaceQuotation = (string) => string.replace('’', "'")

export const randomFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

export const getScoreParams = (battleplan) => {
    const data = Constants.battleplans.find(_battleplan => _battleplan.id === battleplan.id)
    if (data.maxForObjectives) {
        return {score: [...data.scoreParams], maxForObjectives: data.maxForObjectives}
    } else {
        return {score: data.scoreParams}
    }
}

export const getNewRound = (battleplan) => {
    const newRound = {
        firstPlayer: {
            tactics: {name: '', id: ''},
            vp: 0,
            objectiveVp: 0,
            ...getScoreParams(battleplan)
        },
        secondPlayer: {
            actics: {name: '', id: ''},
            vp: 0,
            objectiveVp: 0,
            ...getScoreParams(battleplan)
        }
    }
    return newRound
}
