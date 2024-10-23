import React from 'react';
import Row from '../components/Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const coreDocumentsId = 'e918110c-418e-4a50-90bc-484581a0fa5c'
const rulesImage = 'https://dhss9aar8ocw.cloudfront.net/09a5c1fd-a186-4517-8a6f-0a107374eb45'

const CoreDocuments = () => {
    const documentsIds = dataBase.data.publication_publication_group.filter((publication) => publication.publicationGroupId === coreDocumentsId)
    let documents = documentsIds.map(({publicationId}) => dataBase.data.publication.find(publication => publication.id === publicationId))
    documents = documents.filter(document => !document.spearheadName)
    documents.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderRow = (document) => <Row
        key={document.id}
        title={document.name}
        navigateTo='ruleSections'
        state={{document}}
    />

    return <>
        <img src={rulesImage} alt='Core Documents' width='100%' />
        <div id='column' className='Chapter'>
            {documents && documents.map(renderRow)}
        </div>
    </>
}

export default CoreDocuments