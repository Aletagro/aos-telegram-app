import {t} from '../utilities/i18n'
import React, {useState, useReducer} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import Button from '../components/Button'
import 'react-toastify/dist/ReactToastify.css'
import Constants from '../Constants'
import {roster} from '../utilities/appState'
import {encodeRosterCode, copyText} from '../utilities/rosterCode'
import {getErrors, getWarnings, getWoundsCount, toTelegramSafe, getDropsCount} from '../utilities/utils'

import map from 'lodash/map'
import get from 'lodash/get'
import size from 'lodash/size'

import useSaveList from './useSaveList'

import Styles from './styles/Export.module.css'

const dataBase = require('../utilities/db')

// Приписка в конце скопированного текста: откуда взят список
const getFooter = () => `Exported with Age of Sigmar Community App (Data Version: v${dataBase.metadata?.data_version})`

const Export = () => {
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const [isCopy, setIsCopy] = useState(false)
    const {handleClickSaveButton, saveModal} = useSaveList()
    const errors = getErrors(roster)
    const warnings = getWarnings(roster)
    const wounds = getWoundsCount(roster)
    const drops = getDropsCount(roster)
    const disableButton = Boolean(size(errors))

    const getErrorText = (error) => `- ${error}`

    const getErrorsText = (_errors) => _errors.map(getErrorText).join('\n')

    const getEnhancement = (unit, enhancement) => unit[enhancement] ? `\n[${enhancement}]: ${unit[enhancement]}` : ''

    const getUnitForExport = (unit) => `${unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x ` : ''}${unit.name} (${unit.points || unit.regimentOfRenownPointsCost || 0} points)${unit.artefact ? `\n[Artefact]: ${unit.artefact}` : ''}${unit.heroicTrait ? `\n[Heroic Trait]: ${unit.heroicTrait}` : ''}${unit.weaponOptions ? `${getWeaponOptionsForExport(unit)}` : ''}${map(roster.otherEnhancements, otherEnhancement => getEnhancement(unit, otherEnhancement))}${unit.otherWarscrollOption ? `\n• ${unit.otherWarscrollOption}` : ''}`

    const getRoRUnitForExport = (unit) => `${unit.modelCount ? `${unit.modelCount} x` : ''} ${unit.name} ${unit.artefact ? `\n[Artefact]: ${unit.artefact}` : ''}${unit.heroicTrait ? `\n[Heroic Trait]: ${unit.heroicTrait}` : ''}${unit.weaponOptions ? `${getWeaponOptionsForExport(unit)}` : ''}${unit.marksOfChaos ? `\n• ${unit.marksOfChaos}` : ''}${unit['Ensorcelled Banners'] ? `\n• ${unit['Ensorcelled Banners']}` : ''}${unit.otherWarscrollOption ? `\n• ${unit.otherWarscrollOption}` : ''}`

    const getUnitsForExport = (units, isRoR) => units.map(isRoR ? getRoRUnitForExport : getUnitForExport).join('\n')

    const getWeaponForExport = ([key, value]) => value
        ? `\n• ${value} x ${key}`
        : ''

    const getWeaponOptionForExport = ([key, value]) => {
        return Object.entries(value).map(getWeaponForExport)
    }

    const getWeaponOptionsForExport = (unit) => {
        const text = Object.entries(unit.weaponOptions).map(getWeaponOptionForExport)
        return `${text}`.replace(/,/g, '')
    }

    const getRegimentForExport = (regiment, index) => `Regiment ${index + 1}\n${roster.generalRegimentIndex === index ? "General's regiment\n" : ''}${regiment.units.map(getUnitForExport).join('\n')}\n----`

    const getRegimentsForExport = () => roster.regiments.map(getRegimentForExport).join('\n')

    const handleExportList = () => {
        const rosterText = `${errors.length > 0 ? `Roster errors:\n${getErrorsText(errors)}\n\n` : ''}${warnings.length > 0 ? `Roster warnings:\n${getErrorsText(warnings)}\n\n` : ''}Grand Alliance: ${roster.grandAlliance}
Faction: ${roster.allegiance}
Battle Formation: ${roster.battleFormation}${roster.points.battleFormation ? ` (${roster.points.battleFormation}${Constants.noBreakSpace}pts)` : ''}
Battle Tactics Cards: ${get(roster, 'tactics[0].name', '')}${size(roster.tactics) === 2 ? ` and ${get(roster, 'tactics[1].name', '')}` : ''}
Drops: ${drops}${roster.auxiliaryUnits.length > 0 ? `\nAuxiliaries: ${roster.auxiliaryUnits.length}` : ''}

${roster.spellsLore ? `Spell Lore: ${roster.spellsLore}${roster.points.spellsLore ? ` (${roster.points.spellsLore}${Constants.noBreakSpace}pts)` : ''}` : ''}${roster.prayersLore ? `\nPrayer Lore: ${roster.prayersLore}${roster.points.prayersLore ? ` (${roster.points.prayersLore}${Constants.noBreakSpace}pts)` : ''}` : ''}${roster.manifestationLore ? `\nManifestation Lore: ${roster.manifestationLore}${roster.points.manifestations ? ` (${roster.points.manifestations}${Constants.noBreakSpace}pts)` : ''}` : ''}${roster.factionTerrain ? `\nFaction Terrain: ${roster.factionTerrain}${roster.points.terrain ? ` (${roster.points.terrain}${Constants.noBreakSpace}pts)` : ''}` : ''}
-----
${getRegimentsForExport()}
${roster.regimentOfRenown ? `Regiment Of Renown\n${getUnitForExport(roster.regimentOfRenown)}\n` : ''}${roster.regimentsOfRenownUnits.length > 0 ? `\n${getUnitsForExport(roster.regimentsOfRenownUnits, true)}\n-----` : ''}${roster.auxiliaryUnits.length > 0 ? `\nAuxiliary Units\n${getUnitsForExport(roster.auxiliaryUnits)}\n-----` : ''}
Wounds: ${wounds}
${roster.points.all}/${roster.pointsLimit} Pts
${roster.noteText ? `Note: ${roster.noteText}` : ''}

${getFooter()}
`
        navigator.clipboard.writeText(toTelegramSafe(rosterText))
        toast.success(t('List Copied'), Constants.toastParams)
        setIsCopy(true)
    }

    const handleCopyCode = async () => {
        const ok = await copyText(encodeRosterCode(roster.id))
        if (ok) toast.success(t('Roster code copied'), Constants.toastParams)
        else toast.error(t('Could not copy the code'), Constants.toastParams)
    }

    const handleShowRosterInfo = () => {
        navigate('/rosterInfo', {state: {title: 'Roster Info'}})
    }

    const renderWeapon = ([key, value]) => value
        ? <p>&#8226; {value} x {key}</p>
        : null

    const renderWeaponOption = ([key, value]) => {
        return Object.entries(value).map(renderWeapon)
    }

    const renderWeaponOptions = (weaponOptions) => Object.entries(weaponOptions).map(renderWeaponOption)

    const renderAdditionalOption = (unit, additionalOption) =>
        unit[additionalOption] ? <p>&#8226; {additionalOption}: {unit[additionalOption]}</p> : null

    const renderUnit = (unit, index) => <div key={`${unit.id}-${index}`}>
        <p><b>{unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x` : ''} {unit.name}</b> ({unit.points || unit.regimentOfRenownPointsCost || 0} {t('points')})</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
        {unit.weaponOptions ? renderWeaponOptions(unit.weaponOptions) : null}
        {unit.marksOfChaos ? <p>{t('• Mark Of Chaos:')} {unit.marksOfChaos}</p> : null}
        {size(roster.otherEnhancements) ? map(roster.otherEnhancements, (otherEnhancement, index) => renderAdditionalOption(unit, otherEnhancement)) : null}
        {unit.otherWarscrollOption ? <p>&#8226; {unit.otherWarscrollOption}</p> : null}
    </div>

    const renderRegimentsOfRenownUnit = (unit) => <div>
        <p>{unit.modelCount ? `${unit.modelCount} x` : ''} {unit.name}</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
        {unit.otherWarscrollOption ? <p>&#8226; {unit.otherWarscrollOption}</p> : null}
    </div>

    const renderRegiment = (regiment, index) => <div key={index} id={Styles.regiment}>
        <p>{t('Regiment')} {index + 1}</p>
        {roster.generalRegimentIndex === index ? <p>{t('General\'s regiment')}</p> : null}
        {regiment.units.map(renderUnit)}
    </div>

    const renderError = (error, index) => <p id={Styles.error}>&#8226; {error}</p>

    const renderWarning = (error, index) => <p  id={Styles.warning}>&#8226; {error}</p>

    return <div id={Styles.container}>
        <div id={Styles.buttonContainer}>
            <Button className={disableButton ? Styles.disableButton : Styles.button} disabled={disableButton} onClick={handleClickSaveButton}>{t('Save List')}</Button>
        </div>
        {disableButton
            ? <p id={Styles.errorText}>{t('Until all errors are corrected, the list cannot be saved')}</p>
            : null
        }
        <div id={Styles.buttonContainer}>
            <Button className={Styles.button} type='secondary' onClick={handleExportList}>{isCopy ? t('List Copied') : t('Copy List')}</Button>
        </div>
        {roster.id ? <div id={Styles.buttonContainer}>
            <Button className={Styles.button} type='secondary' onClick={handleCopyCode}>{t('Copy roster code')}</Button>
        </div> : null}
        <div id={Styles.buttonContainer}>
            <Button className={Styles.button} type='secondary' onClick={handleShowRosterInfo}>{t('Show Roster Info')}</Button>
        </div>
        {errors.length > 0
            ? <div id={Styles.errorsContainer}>
                <p id={Styles.error}>{t('Roster errors:')}</p>
                {errors?.map(renderError)}
            </div>
            : null
        }
        {warnings.length > 0
            ? <div id={Styles.warningsContainer}>
                <p id={Styles.warning}>{t('Roster warnings:')}</p>
                {warnings?.map(renderWarning)}
            </div>
            : null
        }
        <div className={Styles.list}>
        <p>{t('Grand Alliance:')} {roster.grandAlliance}</p>
        <p>{t('Faction:')} {roster.allegiance}</p>
        <p>{t('Battle Formation:')} {roster.battleFormation}{roster.points.battleFormation ? ` (${roster.points.battleFormation}${t('pts')})` : ''}</p>
        <p>{t('Battle Tactics Cards:')} {get(roster, 'tactics[0].name', '')}{size(roster.tactics) === 2 ? ` and ${get(roster, 'tactics[1].name', '')}` : ''}</p>
        <p>{t('Drops:')} {drops}</p>
        {roster.auxiliaryUnits.length > 0 ? <p>{t('Auxiliaries:')} {roster.auxiliaryUnits.length}</p> : null}
        <br/>
        {roster.spellsLore ? <p>{t('Spell Lore:')} {roster.spellsLore}{roster.points.spellsLore ? ` (${roster.points.spellsLore}${Constants.noBreakSpace}${t('pts')})` : ''}</p> : null}
        {roster.prayersLore ? <p>{t('Prayer Lore:')} {roster.prayersLore}{roster.points.prayersLore ? ` (${roster.points.prayersLore}${Constants.noBreakSpace}${t('pts')})` : ''}</p> : null}
        {roster.manifestationLore ? <p>{t('Manifestation Lore:')} {roster.manifestationLore}{roster.points.manifestations ? ` (${roster.points.manifestations}${Constants.noBreakSpace}${t('pts')})` : ''}</p> : null}
        {roster.factionTerrain ? <p>{t('Faction Terrain:')} {roster.factionTerrain}{roster.points.terrain ? ` (${roster.points.terrain}${Constants.noBreakSpace}${t('pts')})` : ''}</p> : null}
        <hr/>
        {roster.regiments.map(renderRegiment)}
        <hr/>
        {roster.auxiliaryUnits.length > 0
            ? <div>
                <p>{t('Auxiliary Units')}</p>
                {roster.auxiliaryUnits.map(renderUnit)}
                <hr/>
            </div>
            : null
        }
        {roster.regimentOfRenown
            ? <div>
                <p>{t('Regiment Of Renown')}</p>
                {renderUnit(roster.regimentOfRenown)}
                {roster.regimentsOfRenownUnits?.map(renderRegimentsOfRenownUnit)}
                <hr/>
            </div>
            : null
        }
        <p>{t('Wounds:')} {wounds}</p>
        <p>{roster.points.all}/{roster.pointsLimit} {t('Pts')}</p>
        {roster.noteText ? <p>{t('Note:')} {roster.noteText}</p> : null}
        <p className={Styles.exportFooter}>{getFooter()}</p>
        </div>
        <ToastContainer />
        {saveModal}
    </div>
}

export default Export

