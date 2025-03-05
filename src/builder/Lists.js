import React from 'react'
import {useNavigate} from 'react-router-dom'
import {navigationState, roster} from '../utilities/appState'
import Add from '../icons/add.svg'

import map from 'lodash/map'
import find from 'lodash/find'

import Styles from './styles/Lists.module.css'

const dataBase = require('../dataBase.json')

const lists = [
    {
        id: 1,
        name: 'Крулы из болота молодцы, победили огурцы',
        alliganceId: '21ed7371-d9e3-4a05-8b2c-db46cee7d29d'
    },
    {
        id: 2,
        name: 'Костетрясы',
        alliganceId: '262eabc2-f3b4-4296-9ef5-632d6cf1aadf'
    },
    {
        id: 3,
        name: 'Джовсы',
        alliganceId: '298391fb-3d74-4a26-b9cc-5f3ad5fe4852'
    },
    {
        id: 4,
        name: 'Полотенца',
        alliganceId: '0e399a0d-a181-4870-960d-f3709686af0d'
    },
    {
        id: 5,
        name: 'Мамонты',
        alliganceId: '08135df6-633c-4d58-9adb-7d4b8563b0da'
    },
    {
        id: 6,
        name: 'Крысы',
        alliganceId: '7287a920-61ef-41e1-87b9-911319cfe865'
    },
    {
        id: 7,
        name: 'Тзинч',
        alliganceId: 'fc32e7a5-c952-430a-bcda-9aba4195c181'
    },
    {
        id: 8,
        name: 'Труг всем друг',
        alliganceId: '69149f93-d1b0-4b7e-826c-c0308a96b538'
    }
]

const Lists = () => {
    const navigate = useNavigate()

    const handleAddNewRoster = () => {
        navigate('/chooseGrandAlliance')
    }


    const getUnits = (units) => map(units, (unit) => {
        const _unit = find(dataBase.data.warscroll, ['id', unit.id])
        return {..._unit, ...unit}
    })

    const handleNavigateToRoster = (list) => () => {
        const regiments = map(list.regiments, (regiment) => {
            const units = getUnits(regiment.units)
            return {...regiment, units}
        })
        roster.allegiance = list.allegiance
        roster.auxiliaryUnits = getUnits(list.auxiliaryUnits)
        roster.battleFormation = list.battleFormation
        roster.factionTerrain = list.factionTerrain
        roster.generalRegimentIndex = list.generalRegimentIndex
        roster.grandAlliance = list.grandAlliance
        roster.manifestationLore = list.manifestationLore
        roster.manifestationsList = getUnits(list.manifestationsList)
        roster.points = list.points
        roster.pointsLimit = list.pointsLimit
        roster.prayersLore = list.prayersLore
        roster.regimentOfRenown = find(dataBase.data.ability_group, ['id', list.regimentOfRenown?.id]) 
        roster.regiments = regiments
        roster.regimentsOfRenownUnits = getUnits(list.regimentsOfRenownUnits)
        roster.requiredGeneral = list.requiredGeneral
        roster.spellsLore = list.spellsLore
        roster.withoutBattleFormation = list.withoutBattleFormation
        navigationState.isBuilder = true
        navigate('/builder', {state: {alliganceId: list.allegianceId}})
    }

    const renderList = (list) => {
        const army = find(dataBase.data.faction_keyword, ['id', list.alliganceId])
        return <button id={Styles.button} onClick={handleNavigateToRoster(bonsList)} key={list.id}>
            <img src={army?.moreInfoImage} alt={army?.name} id={Styles.image} />
            <div id={Styles.textContainer}>
                <p id={Styles.text}>{list.name}</p>
                <p id={Styles.text}>{army?.name}</p>
            </div>
        </button>
    }

    return  <div id='column' className='Chapter'>
        <button id={Styles.newRosterButton} onClick={handleAddNewRoster}>
            <p>New Roster</p>
            <img src={Add} alt='' />
        </button>
        <div id={Styles.buttonContainer}>
            {lists.map(renderList)}
        </div>
    </div>
}

export default Lists

const bonsList = {
    "grandAlliance": "Destruction",
    "allegiance": "Bonesplitterz",
    "allegianceId": "262eabc2-f3b4-4296-9ef5-632d6cf1aadf",
    "regiments": [
        {
            "units": [
                {
                    "id": "071faeda-0ed0-49ad-9035-2b8a09e3eaba",
                    "name": "Kragnos, the End of Empires",
                    "points": 580
                },
                {
                    "id": "ea71892b-edd0-4043-9a45-bf54d2ddc54a",
                    "name": "Savage Orruk Arrowboys",
                    "points": 140
                },
                {
                    "id": "ea71892b-edd0-4043-9a45-bf54d2ddc54a",
                    "name": "Savage Orruk Arrowboys",
                    "points": 280,
                    "isReinforced": true
                }
            ],
            "heroId": "071faeda-0ed0-49ad-9035-2b8a09e3eaba",
            "points": 1000
        },
        {
            "units": [
                {
                    "id": "57e6b64e-0208-48b1-ba38-f62a83469c95",
                    "name": "Maniak Weirdnob",
                    "points": 160,
                    "heroicTrait": "'Orrible Leer",
                    "artefact": "Dokk Juice"
                },
                {
                    "id": "ea71892b-edd0-4043-9a45-bf54d2ddc54a",
                    "name": "Savage Orruk Arrowboys",
                    "points": 140
                }
            ],
            "heroId": "57e6b64e-0208-48b1-ba38-f62a83469c95",
            "points": 300,
            "artefact": "",
            "heroicTrait": ""
        }
    ],
    "generalRegimentIndex": 0,
    "auxiliaryUnits": [
        {
            "id": "457fc0d0-f9d0-4f16-a888-79b0186840ce",
            "name": "Savage Big Boss",
            "points": 130
        }
    ],
    "regimentOfRenown": {
        "id": "65430964-f97c-4d31-965b-217cd400072b",
        "name": "Da Hurtlin' Hogz",
        "regimentOfRenownPointsCost": 420
    },
    "regimentsOfRenownUnits": [
        {
            "id": "a4e18ce4-008a-4dc3-a522-2611e96a52d3",
            "name": "Tuskboss on Maw-grunta",
            "points": 260
        },
        {
            "id": "071732ac-2e57-49df-8360-8f675cb7291c",
            "name": "Maw-grunta Gougers",
            "points": 210
        }
    ],
    "battleFormation": "Kop Rukk",
    "withoutBattleFormation": false,
    "spellsLore": "Lore of the Savage Beast",
    "prayersLore": "Prayers of the Living Wilds",
    "manifestationLore": "Twilit Sorceries",
    "manifestationsList": [
        {
            "id": "5b44489d-46ae-4903-9b00-4d2e02fd63fc",
            "name": "Geminids of Uhl-Gysh"
        },
        {
            "id": "f315ac3c-c2f7-4235-994e-e68b04b1703a",
            "name": "Prismatic Palisade"
        },
        {
            "id": "5db3ef5f-4f1e-4ae7-875a-b5a87743b3f9",
            "name": "Umbral Spellportal"
        }
    ],
    "factionTerrain": "",
    "pointsLimit": "2500",
    "points": 1850,
    "requiredGeneral": null
}
