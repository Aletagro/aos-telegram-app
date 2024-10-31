const Constants = {
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
            abilityGroupType: 'artefactsOfPower'
        },
        {
            title: 'Heroic Traits',
            groupName: 'ability_group',
            ruleName: 'ability',
            ruleIdName: 'abilityGroupId',
            abilityGroupType: 'heroicTraits'
        },
        {
            title: 'Spell Lores',
            groupName: 'lore',
            ruleName: 'lore_ability',
            ruleIdName: 'loreId',
            abilityGroupType: undefined,
            abilityKeywordsName: 'lore_ability_keyword',
            abilityIdName: 'loreAbilityId',
            includesTexts: ['Lore of', 'Spell Lore', 'Arcane']
        },
        {
            title: 'Prayer Lores',
            groupName: 'lore',
            ruleName: 'lore_ability',
            ruleIdName: 'loreId',
            abilityGroupType: undefined,
            abilityKeywordsName: 'lore_ability_keyword',
            abilityIdName: 'loreAbilityId',
            includesTexts: ['Prayer', 'Bless', 'Rites', 'Warbeats', 'Scriptures']
        }
    ],
    coreDocumentsId: 'e918110c-418e-4a50-90bc-484581a0fa5c',
    rulesImage: 'https://dhss9aar8ocw.cloudfront.net/09a5c1fd-a186-4517-8a6f-0a107374eb45',
    manifestationsPublicationId: '318c212e-cbcd-4b44-a44d-318f3ae180a0',
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
            name: 'Beast',
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
    abilitiesType: {
        startOfTurn: {
            background: 'black',
            icon: ''
        },
        combatPhase: {
            background: 'darkred',
            icon: ''
        },
        heroPhase: {
            background: 'rgb(161, 146, 61)',
            icon: ''
        },
        movementPhase: {
            background: 'grey',
            icon: ''
        },
        defensive: {
            background: 'darkgreen',
            icon: ''
        },
        chargePhase: {
            background: 'rgb(182, 92, 28)',
            icon: ''
        },
        shootingPhase: {
            background: 'rgb(26, 72, 110)',
            icon: ''
        },
        endOfTurn: {
            background: 'indigo',
            icon: ''
        }
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
        }
    ]
}

export default Constants