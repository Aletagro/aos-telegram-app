import React from 'react';
import Row from '../components/Row'
import Constants from '../Constants'
import './styles/Main.css'

const Main = () => {

    const renderRow = (grandAlliance) => <Row
        key={grandAlliance.id}
        title={grandAlliance.name}
        navigateTo='catalog'
        state={{grandAlliance}}
    />

    return <>
        <img src='https://kartinki.pics/uploads/posts/2022-08/thumbs/1660848806_7-kartinkin-net-p-varkhammer-fentezi-malekit-oboi-krasivo-8.jpg' alt='main' width='100%' />
        <div id='column' className='Chapter'>
            <Row title='Core Documents' navigateTo='coreDocuments' />
            {Constants.grandAlliances.map(renderRow)}
            <Row title='Regiment Of Renown' navigateTo='regimentOfRenownList' />
            <Row title='Manifestations' navigateTo='manifestations' />
            {/* <Row title='Builder' navigateTo='chooseGrandAlliance' /> */}
        </div>
    </>
}

export default Main