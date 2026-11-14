// Данные дашборда: 12 миссий Battleplans 2026-27 и 6 карточек тактик General's Handbook 2026-27.
// Названия, twist и текст подсчёта очков берутся из базы по id (см. getMission в missionInfo.js), здесь - только то, что нужно для подсчёта.
// conflicts: пункты, которые нельзя засчитать в тот же ход вместе с этим (связь работает в обе стороны)
// rounds: 'first' - пункт доступен только в первом раунде, 'later' - со второго, без поля - всегда

export const TACTIC_STAGES = ['affray', 'strike', 'domination']
export const TACTIC_VP = 5

const OBJ1 = {id: 'obj1', vp: 3, label: 'Control at least 1 objective'}
const OBJ2 = {id: 'obj2', vp: 3, label: 'Control 2 or more objectives'}
const MORE = {id: 'more', vp: 4, label: 'Control more objectives than your opponent'}

export const MISSIONS = [
    {id: '3954f6d2-275b-4286-b1b4-a0f1af2cda16', number: 1, name: 'Into the Fire', table: 1, items: [OBJ1, OBJ2, MORE]},
    {id: 'c702ab9c-5a67-4a49-ac8e-5d984d534453', number: 2, name: 'Bloodstained Coasts', table: 1, items: [
        OBJ1, OBJ2,
        {...MORE, rounds: 'first'},
        {id: 'captured', vp: 4, rounds: 'later', label: 'Control an objective that your opponent controlled at the start of the turn'}
    ]},
    {id: '6daa5cea-a553-4308-8fd3-19494803d736', number: 3, name: 'Avalanche of Ash', table: 1, items: [
        OBJ1, OBJ2, MORE,
        // Очки сгорают: при 2+ объектах нельзя взять пункты про терраин, при 1 объекте - «2 или больше» и «нет объектов», при 0 - только два пункта про терраин
        {id: 'terrain', vp: 3, label: 'No more than 1 objective and you control a non-Faction terrain in enemy territory', conflicts: ['obj2']},
        {id: 'noObjectives', vp: 7, label: 'No objectives and you control more non-Faction terrain than your opponent', conflicts: ['obj1', 'obj2', 'more']}
    ]},
    {id: '70cf4f09-d74b-4686-9482-2c2cea08e549', number: 4, name: 'Caverns of Slaughter', table: 1, items: [
        OBJ1, OBJ2,
        {id: 'pairs', vp: 4, label: 'Control any pairs of objectives'}
    ]},
    {id: '96248d4e-e89e-4333-9884-c99091684eb5', number: 5, name: "What's Yours is Ours", table: 1, items: [
        OBJ1,
        {id: 'coveted', vp: 3, label: 'Control the coveted pair of objectives'},
        MORE
    ]},
    {id: 'cb20b08d-aa41-4ec3-adf4-2815abf1583a', number: 6, name: 'Hidden Under Ash-Clouds', table: 1, items: [OBJ1, OBJ2, MORE]},
    {id: 'c470e454-1694-4da1-97bb-f6f78c8cb1ea', number: 7, name: 'Warped Ruins', table: 2, items: [
        OBJ1,
        {id: 'pairs', vp: 3, label: 'Control any pairs of objectives'},
        MORE
    ]},
    {id: '00be1371-eb41-4b1b-9edb-2bda06497a99', number: 8, name: 'Curse of the Gnaw', table: 2, items: [
        {id: 'lions', vp: 3, label: 'Control the Golden Lions objective'},
        {id: 'sun', vp: 3, label: 'Control the Sun Seekers objective'},
        MORE
    ]},
    {id: '1fd64722-4d14-49ff-9a3c-b80e33173cca', number: 9, name: 'Seize the Embers', table: 2, items: [
        OBJ1,
        {...OBJ2, rounds: 'first'},
        {id: 'baseCamp', vp: 3, rounds: 'later', label: "Used the 'Back to Base Camp' ability this turn"},
        MORE
    ]},
    {id: '455f35ca-8686-487d-9340-30acbdefaa5c', number: 10, name: 'Treacherous Ground', table: 2, items: [
        {id: 'stable1', vp: 3, label: 'Control at least 1 stable objective'},
        {id: 'stable2', vp: 3, label: 'Control 2 or more stable objectives'},
        {id: 'moreStable', vp: 4, label: 'Control more stable objectives than your opponent'}
    ]},
    {id: 'c9b27617-d66f-4887-b432-73545c903a9b', number: 11, name: 'Escape From the Coast', table: 2, items: [OBJ1, OBJ2, MORE]},
    {id: '1cbe21d2-d779-43d4-82c4-f1241294f64c', number: 12, name: 'Power of the Realms', table: 2, items: [
        {id: 'primary', vp: 3, label: 'Control the primary objective'},
        {id: 'secondary', vp: 3, label: 'Control 2 or more secondary objectives'},
        MORE
    ]}
]

// Карточки тактик (id - из базы). Стадии идут строго по порядку affray -> strike -> domination, по 5 VP
export const TACTIC_CARDS = [
    {id: '59050573-890f-443f-b76e-d776707b8aba', name: 'Burning for Vengeance', stages: [
        {type: 'affray', id: 'ef0c5f5b-b669-49e8-8a98-939e0d0f05bd', name: 'Search Every Inch'},
        {type: 'strike', id: '49e2be9f-8eb5-46a4-9b05-a79e066c27d4', name: 'Quick Pursuit'},
        {type: 'domination', id: '24aaa309-146d-49b0-ae85-edc971887b85', name: 'Bring Them In'}]},
    {id: '7582d1c1-427e-4c4c-81c8-0bf6a345bec6', name: 'Blazing Onslaught', stages: [
        {type: 'affray', id: '8ac09e03-0721-49b8-883d-f7fdb3e4f495', name: 'Master of Arms'},
        {type: 'strike', id: 'ad894f29-a5d8-4a5d-a81f-b646962af9c4', name: 'Break Their Defences'},
        {type: 'domination', id: '6bab328f-7ee6-404b-8c22-0e373f5989e7', name: 'No Survivors'}]},
    {id: 'e566013b-cb45-485f-80f2-76a9ea2ae700', name: 'Siege of Ashes', stages: [
        {type: 'affray', id: '639ab7fa-ccb9-41c8-932d-fa8c22497d65', name: 'Form a Wall'},
        {type: 'strike', id: 'f2fc8f48-6bfc-425f-95af-d3ff05754588', name: 'Outpost Resupply'},
        {type: 'domination', id: '9c3995e6-e8dd-4b85-89a9-3e0d70cdab38', name: 'Repel the Attackers'}]},
    {id: 'e4e02b51-e043-4557-8824-2e0ef82e1730', name: 'Flanking Firestorm', stages: [
        {type: 'affray', id: '85809f6a-6e5a-4f12-9bd7-213ff13db683', name: 'Ambuscade'},
        {type: 'strike', id: '33635ba2-0522-4f01-9bb5-49ed7cae5832', name: 'Surround the Enemy'},
        {type: 'domination', id: '24ed4763-08c3-4f49-8ca6-af8997c30f11', name: "Claim What's Yours"}]},
    {id: '190b3f5f-4ccd-4f60-88f0-44252f6fac56', name: 'Legend of the Parch', stages: [
        {type: 'affray', id: '050e01b0-fb22-480d-bfde-be3759449442', name: 'Daring Rescue'},
        {type: 'strike', id: '560d54eb-35bc-443b-a96b-f169e29f53d0', name: 'Command From the Front'},
        {type: 'domination', id: 'cb0b92b8-3d46-4642-a639-f87f4e8ee6f0', name: 'Hero of Legend'}]},
    {id: '361b0494-23b9-4ebf-a577-7774bcd11482', name: 'Smokescreen', stages: [
        {type: 'affray', id: 'd523ef1f-f27d-4012-902f-b55aa9ec0403', name: 'Keep the Enemy Close'},
        {type: 'strike', id: '19066f46-45ff-4b6b-ab79-05804db7327c', name: 'Feign Weakness'},
        {type: 'domination', id: '97306252-4f68-449c-81ce-c761b4c2755c', name: 'Execute the Plan'}]}
]

export const getMissionData = (id) => MISSIONS.find(mission => mission.id === id)
export const getTacticCard = (id) => TACTIC_CARDS.find(card => card.id === id)
// Карточка тактики по названию (ростер хранит тактики как rule_container/battle_tactic_card с именем)
export const findTacticCardByName = (name) => TACTIC_CARDS.find(card => card.name.toLowerCase() === String(name || '').trim().toLowerCase())
