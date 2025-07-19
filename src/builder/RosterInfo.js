import React, {useCallback, useReducer, useMemo} from 'react'
import {roster, isCollapseRosterInfo} from '../utilities/appState'
import {getRosterInfo} from '../utilities/utils'
import Ability from '../components/Ability'
import Accordion from '../components/Accordion'
import BattleTactic from '../components/BattleTactic'
import Row from '../components/Row'

import map from 'lodash/map'
import size from 'lodash/size'

const ChooseWeapon = () => {
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const {
        warscrolls, enchancements, factionTerrain, battleTraits, battleFormation,
        spells, prayers,battleTactics, universalCommands, universalAbilities
    } = useMemo(getRosterInfo, [])

    const handleChangeExpand = useCallback((e) => {
        isCollapseRosterInfo[e.nativeEvent.target?.innerText] = !isCollapseRosterInfo[e.nativeEvent.target?.innerText]
        forceUpdate()
    }, [])

    const renderWarscroll = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        rightText={unit?.points ? `${unit?.points} pts` : undefined}
        image={unit?.rowImage}
        navigateTo='warscroll'
        state={{unit, allegianceId: roster.allegianceId}}
    />

    const renderWarscrollsAccordion = (title, data) => <Accordion
        title={title}
        data={data}
        renderItem={renderWarscroll}
        expanded={!isCollapseRosterInfo[title]}
        onChangeExpand={handleChangeExpand}
    />

    const renderAbility = (ability) => <Ability
    key={ability.id}
    ability={ability}
    abilityKeywordsName='ability_keyword'
    abilityIdName='abilityId'
/>

    const renderAbilitiesAccordion = (title, data) => <Accordion
        title={title}
        data={data}
        renderItem={renderAbility}
        expanded={!isCollapseRosterInfo[title]}
        onChangeExpand={handleChangeExpand}
    />

    const renderBattleTactic = (tactic) => <BattleTactic
        key={tactic.id}
        tactic={tactic}/>

    const renderBattleTacticCard = (card) => <Accordion
        title={`Tactic card - ${card.name}`}
        data={card.tactics}
        renderItem={renderBattleTactic}
        expanded={!isCollapseRosterInfo[`Tactic card - ${card.name}`]}
        onChangeExpand={handleChangeExpand}
    />

    return  <div id='column' className='Chapter'>
        {size(warscrolls) ? renderWarscrollsAccordion('Warscrolls', warscrolls) : null}
        {size(roster.manifestationsList) ? renderWarscrollsAccordion('Manifestations', roster.manifestationsList) : null}
        {factionTerrain ? renderWarscrollsAccordion('Faction Terrain', [factionTerrain]) : null}
        {size(enchancements) ? renderAbilitiesAccordion('Enchancements', enchancements) : null}
        {size(battleTraits) ? renderAbilitiesAccordion('Battle Traits', battleTraits) : null}
        {size(battleFormation) ? renderAbilitiesAccordion('Battle Formation', battleFormation) : null}
        {size(spells) ? renderAbilitiesAccordion('Spells Lore', spells) : null}
        {size(prayers) ? renderAbilitiesAccordion('Prayers Lore', prayers) : null}
        {map(battleTactics, renderBattleTacticCard)}
        {renderAbilitiesAccordion('Universal Commands', universalCommands)}
        {renderAbilitiesAccordion('Universal Abilities', universalAbilities)}
    </div>
}

export default ChooseWeapon