import React from 'react';
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import Constants from '../Constants'

const dataBase = require('../dataBase.json')

const CoreDocuments = () => {
    const documentsIds = dataBase.data.publication_publication_group.filter((publication) => publication.publicationGroupId === Constants.coreDocumentsId)
    let documents = documentsIds.map(({publicationId}) => dataBase.data.publication.find(publication => publication.id === publicationId))
    documents = documents.filter(document => !document.spearheadName)
    documents.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderRow = (document) => <Row
        key={document.id}
        title={document.name}
        navigateTo='ruleSections'
        state={{document}}
    />

    const renderRuFAQRow = () => <Row
        title='Arrow City FAQ'
        navigateTo='ruFAQ'
    />

    return <>
        <HeaderImage src={Constants.rulesImage} alt='Core Documents' />
        <div id='column' className='Chapter'>
            {documents && documents.map(renderRow)}
            {renderRuFAQRow()}
        </div>
    </>
}

export default CoreDocuments