import {getMissionData} from './missionData'

const dataBase = require('../utilities/db')

// Название и подзаголовок миссии берутся из базы (там и полный текст: twist, способности, подсчёт очков)
export const getMissionTitle = (id) => {
    const container = dataBase.data.rule_container.find(item => item.id === id)
    return {name: container?.title || getMissionData(id)?.name || '', subtitle: container?.subtitle || ''}
}
