import React, {useState, useReducer} from 'react';
import useDebounce from '../utilities/useDebounce'
import {sortByName} from '../utilities/utils'
import {search} from '../utilities/appState'
import Row from '../components/Row'
import './styles/Search.css'

const dataBase = require('../dataBase.json')

const Search = () => {
    const [value, setValue] = useState(search.value)
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)

    useDebounce(() => {
        if (value) {
            const warscrolls = dataBase.data.warscroll.filter((warscroll) => !warscroll.isSpearhead && warscroll.name.toLowerCase().includes(value.toLowerCase()))
            search.warscrolls = sortByName(warscrolls.splice(0, 20))
        } else {
            search.warscrolls = []
        }
        forceUpdate()
      }, [value], 300
    );

    const handleChange = (e) => {
        search.value = e.target.value
        setValue(e.target.value)
    }

    const renderWarscroll = (unit) => <Row
        key={unit.id}
        title={unit.name}
        navigateTo='warscroll'
        state={{unit}}
    />

    return <>
        <div id='searchContainer'>
            <input id='searchInput' onChange={handleChange} autoFocus placeholder='Start Typing' type='search' name='search' size={40} />
        </div>
        <div id='column' className='Chapter'>
            {search.warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default Search