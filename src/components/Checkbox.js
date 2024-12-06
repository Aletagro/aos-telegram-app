import React from 'react';
import GoldCheckmark from '../icons/goldCheckmark.svg'
import Checkmark from '../icons/checkmark.svg'

import './styles/Checkbox.css';

const Checkbox = ({onClick, checked, isGold}) => {   
    
    const handleClick = () => {
        onClick(!checked)
    }

    return <button id={'checkbox'} onClick={handleClick}>
        {checked
            ? <div id='checkmarkIcon'>
                <img src={isGold ? GoldCheckmark : Checkmark} alt="" />
            </div>
            : <div id='uncheckedCheckbox' style={{'border-color': isGold ? '#FFFFFF' : ' rgb(46, 46, 49)'}}/>
        }
    </button>
}

export default Checkbox