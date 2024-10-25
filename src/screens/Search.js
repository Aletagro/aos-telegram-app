import React, {useState} from 'react';
import useDebounce from '../utilities/useDebounce'
import {sortByName} from '../utilities/utils'
import Row from '../components/Row'
import './styles/Search.css'

const dataBase = require('../dataBase.json')

const Search = () => {
    const [value, setValue] = useState('')
    const [warscrolls, setWarscrolls] = useState([])

    useDebounce(() => {
        if (value) {
            const warscrolls = dataBase.data.warscroll.filter((warscroll) => !warscroll.isSpearhead && warscroll.name.toLowerCase().includes(value.toLowerCase()))
            setWarscrolls(sortByName(warscrolls.splice(0, 20)))
        } else {
            setWarscrolls([])
        }
      }, [value], 300
    );

    const handleChange = (e) => setValue(e.target.value)

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
            {warscrolls && warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default Search