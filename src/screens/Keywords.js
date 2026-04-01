import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Row from '../components/Row'

import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

const dataBase = require('../dataBase.json')

const Keywords = () => {
    const {keywords, alliganceId} = useLocation().state
    const navigate = useNavigate()

    const handleClick = (keyword) => () => {
        const keywordId = find(dataBase.data.keyword, ['name', keyword])?.id
        let warscrollIds = filter(dataBase.data.warscroll_keyword, ['keywordId', keywordId])
        if (alliganceId) {
            const alliganceWarscrollIds = map(filter(dataBase.data.warscroll_faction_keyword, (item) => item.factionKeywordId === alliganceId), item => item.warscrollId)
            warscrollIds = filter(warscrollIds, ({warscrollId}) => includes(alliganceWarscrollIds, warscrollId))
        }
        const units = filter(map(warscrollIds, ({warscrollId}) => find(dataBase.data.warscroll, ['id', warscrollId])), unit => !unit.isSpearhead && !unit.isLegends)
        navigate(`/units`, {state: {units, title: keyword}})
    }

    const renderKeyword = (keyword) => <Row
        title={keyword}
        onClick={handleClick(keyword)}
    />

    return <div id='column' className='Chapter'>
        {map(keywords, renderKeyword)}
    </div>
}

export default Keywords
