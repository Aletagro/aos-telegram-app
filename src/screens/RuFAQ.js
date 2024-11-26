import React from 'react';
import './styles/RuFAQ.css'

const ruFAQ = require('../ruFAQ.json')

const RuFAQ = () => {

    const renderQuestion = (item) => <div id='ruFAQContainer'>
        <p id='question'>Q: {item.question}</p>
        <p id='answer'>A: {item.answer}</p>
    </div>

    return <div id='column' className='Chapter'>
        {ruFAQ.data.map(renderQuestion)}
    </div>
}

export default RuFAQ