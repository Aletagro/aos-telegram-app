import React from 'react';
import Row from './Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const coreDocumentsId = 'e918110c-418e-4a50-90bc-484581a0fa5c'
const rulesImage = 'https://dhss9aar8ocw.cloudfront.net/09a5c1fd-a186-4517-8a6f-0a107374eb45'

const CoreDocuments = () => {
    const documents = dataBase.data.publication.filter((publication) => publication.publicationGroupId === coreDocumentsId && !publication.spearheadName)
    documents.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderRow = (document) => <Row
        key={document.id}
        title={document.name}
        navigateTo='ruleSections'
        state={{document}}
    />

    return <>
        <p className='title'>Core Documents</p>
        <img src={rulesImage} alt='Core Documents' width='100%' />
        <div id='column' className='Chapter'>
            {documents && documents.map(renderRow)}
        </div>
    </>
}

export default CoreDocuments