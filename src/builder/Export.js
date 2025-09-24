import React, {useEffect, useCallback, useState, useReducer} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import 'react-toastify/dist/ReactToastify.css'
import FloatingLabelInput from '../components/FloatingLabelInput'
import Checkbox from '../components/Checkbox'
import Constants from '../Constants'
import {roster, main} from '../utilities/appState'
import {getErrors, getWarnings, getWoundsCount} from '../utilities/utils'
import Close from '../icons/close.svg'

import map from 'lodash/map'
import get from 'lodash/get'
import size from 'lodash/size'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

import Styles from './styles/Export.module.css'

const tg = window.Telegram.WebApp

const rorKeys =  ['id', 'name', 'regimentOfRenownPointsCost']

const manifistationsKeys =  ['id', 'name']

const Export = () => {
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const [isCopy, setIsCopy] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [listName, setListName] = useState(roster.name || `List-${size(main.rosters)}`)
    const [isListPublic, setIsListPublic] = useState(true)
    const [saveAsNew, setSaveAsNew] = useState(false)
    const errors = getErrors(roster)
    const warnings = getWarnings(roster)
    const wounds = getWoundsCount(roster)
    const drops = roster.regiments.length + roster.auxiliaryUnits.length + (roster.regimentOfRenown ? 1 : 0)
    const user = tg.initDataUnsafe?.user
    const unitsKeys =  ['id', 'name', 'points', 'modelCount', 'isReinforced', 'heroicTrait', 'artefact', 'otherWarscrollOption', 'marksOfChaos', ...roster.otherEnhancements, 'weaponOptions'] 
    const disableButton = Boolean(size(errors))

    useEffect(() => {
        if (main.showSaveListModal) {
            main.showSaveListModal = false
            setIsModalOpen(true)
        }
        handleGetLists()
    // eslint-disable-next-line
    }, [])

    const getErrorText = (error) => `- ${error}`

    const getErrorsText = (_errors) => _errors.map(getErrorText).join('\n')

    const getEnchancement = (unit, enhancement) => unit[enhancement] ? `\n[${enhancement}]: ${unit[enhancement]}` : ''

    const getUnitForExport = (unit) => `${unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x ` : ''}${unit.name} (${unit.points || unit.regimentOfRenownPointsCost || 0} points)${unit.artefact ? `\n[Artefact]: ${unit.artefact}` : ''}${unit.heroicTrait ? `\n[Heroic Trait]: ${unit.heroicTrait}` : ''}${unit.weaponOptions ? `${getWeaponOptionsForExport(unit)}` : ''}${map(roster.otherEnhancements, otherEnhancement => getEnchancement(unit, otherEnhancement))}${unit.otherWarscrollOption ? `\n• ${unit.otherWarscrollOption}` : ''}`

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
`
        navigator.clipboard.writeText(rosterText)
        toast.success('List Copied', Constants.toastParams)
        setIsCopy(true)
    }

    const pickKeys = (unit, keys) => {
        return keys.reduce((acc, key) => {
            if (unit.hasOwnProperty(key)) {
                acc[key] = unit[key];
            }
            return acc;
        }, {});
    }

    const getShortUnits = (units = [], keys) => {
        if (size(units)) {
            return map(units, (unit) => {
                return pickKeys(unit, keys)
            })
        }
        return null
    }

    const getShortRegiments = () => {
        return map(roster.regiments, (regiment) => {
            const units = getShortUnits(regiment.units, unitsKeys)
            return JSON.stringify({...regiment, units})
        })
    }

    const handleSaveList = async () => {
        const data = {
            name: listName,
            allegiance: roster.allegiance,
            allegiance_id: roster.allegianceId,
            auxiliary_units: JSON.stringify(getShortUnits(roster.auxiliaryUnits, unitsKeys)),
            battle_formation: roster.battleFormation,
            faction_terrain: roster.factionTerrain,
            general_regiment_index: roster.generalRegimentIndex,
            grand_alliance: roster.grandAlliance,
            manifestation_lore: roster.manifestationLore,
            manifestations_list: JSON.stringify(getShortUnits(roster.manifestationsList, manifistationsKeys)),
            points: JSON.stringify(roster.points),
            points_limit: roster.pointsLimit,
            prayers_lore: roster.prayersLore,
            regiment_of_renown: roster.regimentOfRenown ? JSON.stringify(pickKeys(roster.regimentOfRenown, rorKeys)) : '',
            regiments: JSON.stringify(getShortRegiments()),
            regiments_of_renown_units: JSON.stringify(getShortUnits(roster.regimentsOfRenownUnits, unitsKeys)),
            spells_lore: roster.spellsLore,
            tactics: JSON.stringify(map(roster.tactics, 'name')),
            tg_id: user?.id,
            is_public: isListPublic,
            note: roster.id && roster.note ? JSON.stringify({...JSON.parse(roster.note), noteText: roster.noteText, wounds, drops}) : JSON.stringify({...roster.note, noteText: roster.noteText, wounds, drops}),
        }
        try {
            if (roster.id && !saveAsNew) {
                await fetch(`https://aoscom.online/rosters_db/update_roster?roster_id=${roster.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': "application/json, text/javascript, /; q=0.01"
                    }
                })
            } else {
                await fetch('https://aoscom.online/rosters_db/new_roster', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': "application/json, text/javascript, /; q=0.01"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    roster.id = get(data, 'roster_id')
                })
                .catch(error => console.error(error))
            }
        } catch (err) {
            console.error(err.message)
        }
        handleCloseModal()
        toast.success('List Saved', Constants.toastParams)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleClickSaveButton = () => {
        if (!get(main, 'user.tg_id')) {
            navigate('/registration')
        } else {
            setIsModalOpen(true)
        }
    }

    const handleDeleteList = (listId) => async () => {
        await fetch(`https://aoscom.online/rosters_db/delete_roster?roster_id=${listId}&tg_id=${user?.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json, text/javascript, /; q=0.01"
            }
        })
            .then(() => {
                main.rosters = filter(main.rosters, roster => roster.id !== listId)
                toast.success('List deleted', Constants.toastParams)
                forceUpdate()
            })
            .catch(error => console.error(error))
    }

    const handleGetLists = useCallback(async () => {
        fetch(`https://aoscom.online/rosters_db/rosters_by_user?tg_id=${user?.id}`)
            .then(response => response.json())
            .then(data => {
                main.rosters = data.rosters
                forceUpdate()
            })
            .catch(error => console.error(error))
      }, [user?.id])


    const renderList = (list) => <div id={Styles.listDeletedContainer} onClick={handleDeleteList(list.id)}>
        <div>
            <p id={Styles.listDeletedTitle}>{list.name}</p>
            <p id={Styles.listDeletedSubtitle}>{list.allegiance}</p>
        </div>
        <img id={Styles.allegianceInfoIcon} src={Close} alt="" />
    </div>

    const handleBlurName = (e) => {
        setListName(e.target.value)
    }

    const handleChangePublic = () => {
        setIsListPublic(!isListPublic)
    }

    const handleChangeAsNew = () => {
        setSaveAsNew(!saveAsNew)
    }

    const handleShowRosterInfo = () => {
        navigate('/rosterInfo', {state: {title: 'Roster Info'}})
    }

    const renderModalContent = () => {
        if (size(main.rosters) >= Constants.listsMax && !roster.id && !includes(Constants.developersIds, user?.id)) {
            return <>
                <b id={Styles.modalTitle}>You have reached limit of saved lists</b>
                <p id={Styles.modalText}>You can delete one of your list</p>
                {map(main.rosters, renderList)}
            </>
        }
        return <>
            <b id={Styles.modalTitle}>Save Roster</b>
            <FloatingLabelInput
                style={inputStyles.listName}
                onBlur={handleBlurName}
                label='List Name'
                defaultValue={listName}
            />
            <div id={Styles.publicCheckboxContainer} onClick={handleChangePublic}>
                <p id={Styles.potentialLegends}>Save as public</p>
                <Checkbox onClick={handleChangePublic} checked={isListPublic} />
            </div>
            <p id={Styles.publicNote}>Other users will be able to see this list.</p>
            {roster.id && size(main.rosters) > Constants.listsMax && !includes(Constants.developersIds, user?.id)
                ? <div id={Styles.publicCheckboxContainer} onClick={handleChangeAsNew}>
                    <p id={Styles.potentialLegends}>Save as new List</p>
                    <Checkbox onClick={handleChangeAsNew} checked={saveAsNew} />
                </div>
                : null
            }
            <button id={listName ? Styles.button : Styles.disabledButton} disabled={!listName} onClick={handleSaveList}>Save</button>
        </>
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
        <p><b>{unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x` : ''} {unit.name}</b> ({unit.points || unit.regimentOfRenownPointsCost || 0} points)</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
        {unit.weaponOptions ? renderWeaponOptions(unit.weaponOptions) : null}
        {unit.marksOfChaos ? <p>&#8226; Mark Of Chaos: {unit.marksOfChaos}</p> : null}
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
        <p>Regiment {index + 1}</p>
        {roster.generalRegimentIndex === index ? <p>General's regiment</p> : null}
        {regiment.units.map(renderUnit)}
    </div>

    const renderError = (error, index) => <p id={Styles.error}>&#8226; {error}</p>

    const renderWarning = (error, index) => <p  id={Styles.warning}>&#8226; {error}</p>

    return <div id={Styles.container}>
         <div id={Styles.buttonContainer}>
            <button id={disableButton ? Styles.disabledButton : Styles.button} onClick={handleClickSaveButton} disabled={disableButton}>Save List</button>
        </div>
        {disableButton
            ? <p id={Styles.errorText}>Until all errors are corrected, the list cannot be saved</p>
            : null
        }
        <div id={Styles.buttonContainer}>
            <button id={Styles.button} onClick={handleExportList}>{isCopy ? 'List Copied' : 'Copy List'}</button>
        </div>
        <div id={Styles.buttonContainer}>
            <button id={Styles.button} onClick={handleShowRosterInfo}>Show Roster Info</button>
        </div>
        {errors.length > 0
            ? <div id={Styles.errorsContainer}>
                <p id={Styles.error}>Roster errors:</p>
                {errors?.map(renderError)}
            </div>
            : null
        }
        {warnings.length > 0
            ? <div id={Styles.warningsContainer}>
                <p id={Styles.warning}>Roster warnings:</p>
                {warnings?.map(renderWarning)}
            </div>
            : null
        }
        <p>Grand Alliance: {roster.grandAlliance}</p>
        <p>Faction: {roster.allegiance}</p>
        <p>Battle Formation: {roster.battleFormation}{roster.points.battleFormation ? ` (${roster.points.battleFormation}pts)` : ''}</p>
        <p>Battle Tactics Cards: {get(roster, 'tactics[0].name', '')}{size(roster.tactics) === 2 ? ` and ${get(roster, 'tactics[1].name', '')}` : ''}</p>
        <p>Drops: {drops}</p>
        {roster.auxiliaryUnits.length > 0 ? <p>Auxiliaries: {roster.auxiliaryUnits.length}</p> : null}
        <br/>
        {roster.spellsLore ? <p>Spell Lore: {roster.spellsLore}{roster.points.spellsLore ? ` (${roster.points.spellsLore}${Constants.noBreakSpace}pts)` : ''}</p> : null}
        {roster.prayersLore ? <p>Prayer Lore: {roster.prayersLore}{roster.points.prayersLore ? ` (${roster.points.prayersLore}${Constants.noBreakSpace}pts)` : ''}</p> : null}
        {roster.manifestationLore ? <p>Manifestation Lore: {roster.manifestationLore}{roster.points.manifestations ? ` (${roster.points.manifestations}${Constants.noBreakSpace}pts)` : ''}</p> : null}
        {roster.factionTerrain ? <p>Faction Terrain: {roster.factionTerrain}{roster.points.terrain ? ` (${roster.points.terrain}${Constants.noBreakSpace}pts)` : ''}</p> : null}
        <hr/>
        {roster.regiments.map(renderRegiment)}
        <hr/>
        {roster.auxiliaryUnits.length > 0
            ? <div>
                <p>Auxiliary Units</p>
                {roster.auxiliaryUnits.map(renderUnit)}
                <hr/>
            </div>
            : null
        }
        {roster.regimentOfRenown
            ? <div>
                <p>Regiment Of Renown</p>
                {renderUnit(roster.regimentOfRenown)}
                {roster.regimentsOfRenownUnits?.map(renderRegimentsOfRenownUnit)}
                <hr/>
            </div>
            : null
        }
        <p>Wounds: {wounds}</p>
        <p>{roster.points.all}/{roster.pointsLimit} Pts</p>
        {roster.noteText ? <p>Note: {roster.noteText}</p> : null}
        <ToastContainer />
        <Modal open={isModalOpen} onClose={handleCloseModal}>
            <ModalDialog layout="center">
                {renderModalContent()}
            </ModalDialog>
        </Modal>
    </div>
}

export default Export

const inputStyles = {
    listName: {
        '--Input-minHeight': '48px',
        borderRadius: '4px',
        'border-color': '#B4B4B4',
        color: '#000000',
        'box-shadow': 'none',
        'font-family': 'Minion Pro Bold'
    }
}