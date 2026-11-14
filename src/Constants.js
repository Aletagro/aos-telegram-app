import {accordionSummaryClasses} from '@mui/joy/AccordionSummary'

const Constants = {
    domain: 'https://aos.aoscom.online',
    grandAlliances: [
        {
            name: 'Chaos',
            id: '90175462-fae6-41e4-a0fe-19e41a833c9a',
            image: 'https://dhss9aar8ocw.cloudfront.net/2a08adc1-4b87-43de-9c1a-7f8c9ca6699a'
        },
        {
            name: 'Death',
            id: '5c504c0c-cb25-4513-a137-7dd9efc172db',
            image: 'https://dhss9aar8ocw.cloudfront.net/ed6e96e2-c8db-4bd1-bdc6-25e3ce953305'
        },
        {
            name: 'Destruction',
            shortName: 'Destr.',
            id: '3abb8417-72f9-47ab-a372-4d3f84c03caa',
            image: 'https://dhss9aar8ocw.cloudfront.net/bffedbb2-a415-484a-abac-97aa5e92b3b6'
        },
        {
            name: 'Order',
            id: 'ecb12990-a5de-4f3e-bc53-39d73855cbea',
            image: 'https://dhss9aar8ocw.cloudfront.net/ae7d81ea-0642-4eae-9742-b0a061ff6feb'
        }
    ],
    armyEnhancements: [
        {
            title: 'Battle Traits',
            groupName: 'ability_group',
            ruleName: 'ability',
            ruleIdName: 'abilityGroupId',
            abilityGroupType: 'battleTraits',
            abilityKeywordsName: 'ability_keyword',
            abilityIdName: 'abilityId'
        },
        {
            title: 'Battle Formations',
            groupName: 'battle_formation',
            ruleName: 'battle_formation_rule',
            ruleIdName: 'battleFormationId'
        },
        {
            title: 'Artefacts of Power',
            groupName: 'ability_group',
            ruleName: 'ability',
            ruleIdName: 'abilityGroupId',
            abilityGroupType: 'artefactsOfPower',
            abilityKeywordsName: 'ability_keyword',
            abilityIdName: 'abilityId'
        },
        {
            title: 'Heroic Traits',
            groupName: 'ability_group',
            ruleName: 'ability',
            ruleIdName: 'abilityGroupId',
            abilityGroupType: 'heroicTraits',
            abilityKeywordsName: 'ability_keyword',
            abilityIdName: 'abilityId'
        },
        {
            title: 'Spell Lores',
            groupName: 'lore',
            ruleName: 'lore_ability',
            ruleIdName: 'loreId',
            abilityGroupType: undefined,
            abilityKeywordsName: 'lore_ability_keyword',
            abilityIdName: 'loreAbilityId',
            includesTexts: ['Lore of', 'Spell Lore', 'Arcane'],
            excludedTexts: ['Lore of the Abyss', 'Lore of Virulence', 'Lore of the Spirit-Song', 'Lore of the Everwinter', "Brodd's Bellows"]
        },
        {
            title: 'Prayer Lores',
            groupName: 'lore',
            ruleName: 'lore_ability',
            ruleIdName: 'loreId',
            abilityGroupType: undefined,
            abilityKeywordsName: 'lore_ability_keyword',
            abilityIdName: 'loreAbilityId',
            includesTexts: ['Prayer', 'Bless', 'Rites', 'Warbeats', 'Scriptures', 'Benedictions', 'Gifts', 'Lore of Virulence', 'Lore of the Spirit-Song', 'Proclamations', 'Lore of the Everwinter', "Brodd's Bellows"]
        }
    ],
    manifestationIncludesTexts: ['Manifestation', 'Invocations', 'Judgements', 'Lore of the Abyss', 'Manifested', 'Infernal Sorceries', 'Horrors of the Necropolis'],
    spearheadArmyEnhancements: [
        {
            ruleName: 'ability',
            title: 'Battle Traits',
            groupName: 'ability_group',
            abilityGroupType: 'battleTraits',
            withoutTitle: true
        },
        {
            ruleName: 'ability',
            title: 'Regiment Abilities',
            groupName: 'ability_group',
            abilityGroupType: 'regimentAbilities',
            withoutTitle: true
        },
        {
            ruleName: 'ability',
            title: 'Enhancements',
            groupName: 'ability_group',
            abilityGroupType: 'spearheadEnhancements',
            withoutTitle: true
        }
    ],
    coreDocumentsId: 'e918110c-418e-4a50-90bc-484581a0fa5c',
    ghbId: 'cf456401-f84b-4278-a63d-a4de52dde29f',
    ghb25_26Id: '3e05b549-40a4-43e5-b0f7-5ef6d1ffdbd2',
    sogPublicationId: '292d6e8e-a50d-4a5c-bd5f-70f85110c7f0',
    tacticsCardPublicationId: '03e7448e-15e4-498c-b5c8-971ec5224757',
    hideChaptersIds: [
        '27931b97-5750-4600-bac4-a09dada60dcd', // Spearhead Battlepack: Sand and Bone
        '308aceba-6694-4d60-a98a-233a4d7e9702', // Spearhead Battlepack: Fire and Jade
        '7b088793-8bc1-4c56-a5b2-7949af196076', // Spearhead Battlepack: City of Ash
        '75294bc3-bb11-4c35-8425-b41d741c62bb', // General's Handbook 2024-25: Advanced Rules
        '318c212e-cbcd-4b44-a44d-318f3ae180a0', // General's Handbook 2024-25: Matched Play Battlepack"
    ],
    manifestationsPublicationId: '38c85d13-0436-48ac-adb3-1c9319b16d13',
    regimentsOfRenownImage: 'https://dhss9aar8ocw.cloudfront.net/39478fae-cf03-40ee-a130-6fef03492c44',
    unitsTypes: [
        {
            name: 'Hero'
        },
        {
            name: 'Infantry',
            withoutHero: true
        },
        {
            name: 'Cavalry',
            withoutHero: true
        },
        {
            name: 'Beast,',
            withoutHero: true
        },
        {
            name: 'Monster',
            withoutHero: true
        },
        {
            name: 'War Machine',
            withoutHero: true
        },
        {
            name: 'Manifestation'
        },
        {
            name: 'Faction Terrain'
        }
    ],
    abilitiesTypes: {
        startOfTurn: '#020101',
        combatPhase: '#992212',
        heroPhase: '#b0953f',
        movementPhase: '#54534f',
        defensive: '#3f6b3a',
        chargePhase: '#c86011',
        shootingPhase: '#2f5d86',
        endOfTurn: '#5b3f7a'
    },
    tacticsTypes: {
        affray: '#3f6b3a',
        strike: '#2f5d86',
        domination: '#b05f22'
    },
    regimentOfRenownsWithWizard: [
        {
            id: '0d95831a-70f6-4ca0-8fcb-a438740ec203',
            name: "Braggit's Bottle-Snatchaz"
        },
        {
            id: '4eb81bd5-0209-4ea1-9780-c2ee5e6de3a6',
            name: "Brand's Oathbound"
        },
        {
            id: 'e6814e04-a5c0-40eb-9a42-a0b8573b37c0',
            name: "Neferata's Royal Echelon"
        },
        {
            id: '9aaa73cd-7282-4d6e-a33a-96df53de4866',
            name: 'The Blacktalons'
        },
        {
            id: 'af2b3337-b0d5-40f1-849a-f61bc4bafcdf',
            name: 'The Coven of Thryx'
        },
        {
            id: 'd14b3e70-d378-41fb-89e5-c108f735674a',
            name: "The Liche's Hand"
        },
        {
            id: '090e93b1-4d91-44f1-bf57-3d6282ec0e45',
            name: 'The Sorrowmourn Choir'
        },
        {
            id: 'b62bbcf9-d46e-427c-9b3b-c6ee6401705e',
            name: 'The Sternieste Garrison'
        },
        {
            id: 'dc211333-b689-4380-b0b6-eb6add5ac1f2',
            name: "The Summerking's Entourage"
        },
        {
            id: "037eca6d-f114-406d-87bd-8f26087f69bb",
            name: "Enforcers of the Tithe"
        },
        {
            id: "95c48875-b067-4876-b128-515bcf0459dd",
            name: "Goroan Scions"
        }
    ],
    calculatorAbilities: [
        {
            name: 'Crit (2 Hits)',
            type: 'doubleHit'
        },
        {
            name: 'Crit (Auto-wound)',
            type: 'autoWound'
        },
        {
            name: 'Crit (Mortal)',
            type: 'mortal'
        }
    ],
    calculatorCharacteristics: [
        {
            name: 'To Hit',
            type: 'toHit',
            values: [2, 3, 4, 5, 6]
        },
        {
            name: 'To Wound',
            type: 'toWound',
            values: [2, 3, 4, 5, 6]
        },
        {
            name: 'Rend',
            type: 'rend',
            values: [0, 1, 2, 3, 4]
        },
        {
            name: 'Damage',
            type: 'damage',
            values: [1, 2, 3, 4],
            hasCustom: true
        }
    ],
    calculatorInputs: [
        {
            name: 'Models',
            type: 'models'
        },
        {
            name: 'Attacks',
            type: 'attacks'
        }
    ],
    saves: [
        {value: 2, title: '2+'},
        {value: 3, title: '3+'},
        {value: 4, title: '4+'},
        {value: 5, title: '5+'},
        {value: 6, title: '6+'}
    ],
    critOn: [
        {modificator: 3, title: 'Crit on 4+'},
        {modificator: 2, title: 'Crit on 5+'},
        {modificator: 1, title: 'Crit on 6+'}
    ],
    toastParams: {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        theme: 'colored',
        pauseOnHove: false
    },
    newCalcUnit: {
        name: '',
        weapons:  [{critOn: {modificator: 1, title: '6+'}}]
    },
    accordionStyle: {
        borderRadius: 'md',
        [`& .${accordionSummaryClasses.button}:hover`]: {
            'background-color': '#2E2D32'
        },
        '& button:not([aria-selected="true"]):active': {
            background: '#2E2D32',
        },
        '& button:not([aria-selected="true"]):hover': {
            background: '#2E2D32',
        }
    },
    defaultIsCollapseUnitsTypes: {
        'Hero': false,
        'Infantry': false,
        'Cavalry': false,
        'Beast': false,
        'Monster': false,
        'War Machine': false,
        'Manifestation': false,
        'Faction Terrain': false
    },
    defaultIsCollapseRegimentAlliances: {
        'Chaos': false,
        'Death': false,
        'Destruction': false,
        'Order': false
    },
    defaultIsCollapseRosterInfo: {
        'Warscrolls': false,
        'Manifestations': false,
        'Faction Terrain': false,
        'Enhancements': false,
        'Battle Traits': true,
        'Battle Formations': false,
        'Spells Lore': true,
        'Prayer Lores': true,
        'Universal Commands': true,
        'Universal Abilities': true
    },
    legendaryArmies: ['262eabc2-f3b4-4296-9ef5-632d6cf1aadf', '5425ee6d-56cb-44a3-9f82-78b6864890da'],
    noBreakSpace: '\u00a0',
    listsMax: 4,
    supportLinks: {
        telegram: 'https://t.me/tribute/app?startapp=dRhg',
        web: 'https://web.tribute.tg/d/Rhg'
    },
    chaosFaction: [
        "Beasts of Chaos",
        "Blades of Khorne",
        "Disciples of Tzeentch",
        "Hedonites of Slaanesh",
        "Helsmiths of Hashut",
        "Maggotkin of Nurgle",
        "Skaven",
        "Slaves to Darkness"
    ],
    chaosAoRs: [
        "The Great-Grand Gnawhorde",
        "Thanquol's Mutated Menagerie",
        "The Swords of Chaos",
        "Tribes of the Snow Peaks",
        "Legion of the First Prince",
        "Gorechosen Champions",
        "The Baleful Lords",
        "Taar's Grand Forgehost",
        "Ziggurat Stampede",
        "Cycle of Corruption",
        "The Gardeners of Nurgle",
        "Change-Cult Uprising",
        "The Oracles of Fate",
        "Court of the Godlings",
        "Decadent Host"
    ],
    deathFaction: [
        "Flesh-eater Courts",
        "Nighthaunt",
        "Ossiarch Bonereapers",
        "Soulblight Gravelords"
    ],
    deathAoRs: [
        "The Equinox Feast",
        "The Knights of New Summercourt",
        "The Eternal Nightmare",
        "The Clattering Procession",
        "Knights of the Crimson Keep",
        "Scions of Nulahmia",
        "Barrow Legion",
        "The Null Myriad",
        "The Lance of Ossia"
    ],
    destructionFaction: [
        "Bonesplitterz",
        "Gloomspite Gitz",
        "Ironjawz",
        "Kruleboyz",
        "Ogor Mawtribes",
        "Sons of Behemat"
    ],
    destructionAoRs: [
        "The Roving Maw",
        "Meatfist Mawtribe",
        "Mawseeker Gollop",
        "Beastclaw Alfrostun",
        "Krazogg’s Grunta Stampede",
        "Zoggrok's Ironmongerz",
        "Murkvast Menagerie",
        "Big Waaagh!",
        "King Brodd's Stomp",
        "Stomper Tribe",
        "Matriarch's Mob",
        "Trugg's Troggherd",
        "Da King's Gitz",
        "Droggz's Gitmob"
    ],
    orderFaction: [
        'Cities of Sigmar',
        'Daughters of Khaine',
        'Fyreslayers',
        'Idoneth Deepkin',
        'Kharadron Overlords',
        'Lumineth Realm-lords',
        'Seraphon',
        'Stormcast Eternals',
        'Sylvaneth'
    ],
    orderAoRs: [
        'The Croneseer’s Pariahs',
        'Zainthar Kai',
        'Champions of the Arena',
        'Lofnir Drothkeepers',
        'Wardens of the Chorrileum',
        'The First Phalanx of Ionrach',
        'Grundstok Expeditionary Force',
        "The Magnate's Crew",
        'Pioneer Outpost',
        'Draconith Skywing',
        'Ruination Brotherhood',
        'Heroes of the First-Forged',
        'The Evergreen Hunt',
        'Lords of the Clan',
        'Soulpod Guardians',
        'Vanari Paragons',
        'Aelementiri Conclave',
        'The Iron March',
        'Allies of the Free Cities'
    ],
    tacticsCards: ['Burning for Vengeance', 'Legend of the Parch', 'Siege of Ashes', 'Flanking Firestorm', 'Smokescreen', 'Blazing Onslaught'],
    oldTacticsCards: ['Attuned to Ghyran', 'Master The Paths', 'Restless Energy', 'Intercept and Recover', 'Wrathful Cycles', 'Scouting Force'],
    universalCommands: [
        {name: 'Magical Intervention', id: '108d8f93-9216-495e-9245-971f9e74112b'},
        {name: 'Rally', id: '838515df-51c3-458d-b082-8551378e3a63'},
        {name: 'At the Double', id: '810e7c04-56f1-4a53-b2ef-9c678715cdd9'},
        {name: 'Redeploy', id: '8fec538b-0593-460c-ad0b-a36637e3061a'},
        {name: 'Covering Fire', id: 'd301bc99-6dfd-481e-bbd5-ed37f0c1c3d1'},
        {name: 'Counter-charge', id: 'ebd1dd7b-4087-4e0e-b587-e8653352e3a3'},
        {name: 'Forward to Victory', id: 'c0fc1fca-1686-4aa1-bcb7-8867c348ef05'},
        {name: 'All-out Attack', id: '68b6382e-ac34-44cc-86c0-01a96c6ad843'},
        {name: 'All-out Defence', id: '29cb6793-a18e-43e9-854e-547cac0347f1'},
        {name: 'Power Through', id: 'aca50afb-7096-418c-9f90-681ac81e167f'}
    ],
    universalAbilities: [
        {name: 'Activate Place of Power', id: 'd7a4d92a-0c0f-4d85-a2b0-e65335976358'},
        {name: 'Deploy Faction Terrain', id: '23580118-9620-459e-a6f7-4184340c8ebc'},
        {name: 'Deploy Regiment', id: '30238fab-a246-4aee-9f76-8ad483d8c4aa'},
        {name: 'Deploy Unit', id: '3a353bd5-9e49-4e5b-a3ad-f7a1cf77abdd'},
        {name: 'Banish Manifestation', id: '17dacc42-a30e-49ae-beab-8138cd754b89'},
        {name: 'Sacred Rites', id: '9afeed67-0bf6-4d38-8661-8e7214222ee5'},
        {name: 'Unbind', id: '323c81ab-d38c-43dc-b372-c7137ea3d4dd'},
        {name: 'Fly', id: '68c0aff7-2c03-4ffc-8e49-cfe0137e3aa4'},
        {name: 'Normal Move', id: '84ee4f51-a652-422b-98f6-ac9df75df77f'},
        {name: 'Retreat', id: '27a61018-34fb-4bb2-92d2-ad3fcb9c0300'},
        {name: 'Run', id: 'b497a269-d42c-41ef-9d02-e343dfdd8004'},
        {name: 'Guarded Hero', id: 'dc1ef658-2783-4692-81dc-e1dc0cb9028a'},
        {name: 'Shoot', id: 'd7a8c209-8721-4d85-9fd1-7691f5e31ba6'},
        {name: 'Charge', id: '2e5ce689-8a3c-4f13-8954-2fb8f43a09fc'},
        {name: 'Fight', id: '047cc685-8fdd-4321-91e0-320df82a700b'},
        {name: 'Ward Save', id: '600781dd-8d0c-4cfc-b763-7d9e832e8ec0'}
    ],
    unitKeywords: {
        "Beasts of Chaos": [],
        "Blades of Khorne": ['Daemon', 'Bloodbound'],
        "Disciples of Tzeentch": ['Daemon', 'Arcanite', 'Warflock'],
        "Hedonites of Slaanesh": ['Daemon', 'Sybarite'],
        "Helsmiths of Hashut": ['Duardin', 'Automaton'],
        "Maggotkin of Nurgle": ['Rotbringers', 'Daemon'],
        "Skaven": ['Skryre', 'Verminus', 'Eshin', 'Masterclan', 'Moulder', 'Pestilens', 'Daemon'],
        "Slaves to Darkness": ['Warriors of Chaos', 'Daemon', 'Darkoath', 'Pledged to Tzeentch'],
        "Flesh-eater Courts": ['Abhorrant', 'Noble', 'Knights', 'Serfs'],
        "Nighthaunt": [],
        "Ossiarch Bonereapers": [],
        "Soulblight Gravelords": ['Vampire', 'Deadwalkers', 'Deathrattle'],
        "Bonesplitterz": [],
        "Gloomspite Gitz": ['Troggoth', 'Gitmob', 'Moonclan', 'Squig', 'Spiderfang'],
        "Ironjawz": ['Maw-krusha', 'Maw‑grunta', 'Brute'],
        "Kruleboyz": [],
        "Ogor Mawtribes": ['Gutbusters', 'Beastclaw Raiders'],
        "Sons of Behemat": ['Big', 'Little'],
        'Cities of Sigmar': ['Aelf', 'Duardin', 'Sigmarite'],
        'Daughters of Khaine': ['Aelf'],
        'Fyreslayers': ['Magmadroth'],
        'Idoneth Deepkin': ['Akhelian', 'Eidolon', 'Isharann', 'Namarti'],
        'Kharadron Overlords': ['Skyfarer', 'Skyvessel', 'Auto-Endrin'],
        'Lumineth Realm-lords': ['Alarith', 'Vanari', 'Scinari', 'Hurakan', 'Ydrilan'],
        'Seraphon': ['Slann', 'Skink', 'Saurus', 'Kroxigor'],
        'Stormcast Eternals': ['Extremis Chamber', 'Warrior Chamber', 'Ruination Chamber', 'Vanguard Chamber'],
        'Sylvaneth': ['Kurnothi', 'Forest Elder', 'Revenant']
    },
    generalKeywords: ['HERO', 'HEROES', 'INFANTRY', 'MONSTER', 'MONSTERS', 'CAVALRY', 'BEAST', 'WAR MACHINE', 'MANIFESTATION', 'WIZARD', 'WIZARDS', 'PRIEST', 'PRIESTS', 'UNIQUE', 'FLY', 'WARFLOCK', 'HOBGROT', 'SKRYRE'],
    hiddenKeywords: ['', 'CORE', 'non-CORE', 'ATTACK', 'RAMPAGE', 'HERO', 'HEROES', 'non-HERO', 'non-HERO INFANTRY', 'UNIQUE', 'MONSTER', 'MONSTERS', 'non-MONSTER', 'INFANTRY', 'CAVALRY', 'BEAST', 'BEASTS', 'WAR MACHINE', 'MANIFESTATION', 'MANIFESTATIONS', 'SPELL', 'SPELLS', 'PRAYER', 'PRAYERS', 'X', 'WIZARD', 'WIZARDS', 'PRIEST', 'PRIESTS', 'FACTION TERRAIN', 'non-FACTION TERRAIN', 'STRIKE-LAST', 'STRIKE-FIRST', 'UNLIMITED', 'BLOOD TITHE', 'MOVE', 'SUMMON', 'SUMMON SPELL', 'non-SUMMON SPELL', 'BANISH', 'FLY', 'non-FLY', 'BURNING', 'EUPHORIC', 'non-EUPHORIC', 'HOBGROT', 'DISEASED', 'DELUSION', 'SENTENCED', 'non-UNIQUE DEATH', 'DEATH', 'UR-GOLD RUNE', 'TIDAL', 'IDONETH DEEPKIN MANIFESTATIONS', 'FLAGSHIP', 'AELSLING', 'ASTERISM', 'SACROSANCT CHAMBER', 'SOULBURNED', 'HUNTED', 'non-KURNOTHI', 'DESTRUCTION HERO', 'EXALTED'],
    myTgId: 530569849,
    myVkId: 45749262,
    developersIds: [
        530569849, // Я
        200821933, // Вован
    ],
    testersIds: [
        530569849, // Я
        210233387, // Загубин
        225084114, // Зайцев Ваня
        835889046, // Плакс
        208050275, // Гоша
        437257338, // Игорь
        205134265, // Петя
        94613054, // Семёнов
        200821933, // Вован
        306287992, // Тёма Курепин
        589760439, // Коля
        431627556 // Матвейка
    ],
    lastUpdate: '02.11.2026',
    fullDatelastUpdate: '2026-09-24T22:00:00.0000',
    spearheadBattlepacksId: '97942bd2-6e43-4a5d-8561-300ca6a8b956'
}

export default Constants