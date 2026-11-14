const load = (language) => {
    let module
    localStorage.clear()
    if (language) localStorage.setItem('language', language)
    jest.isolateModules(() => { module = require('./i18n') })
    return module
}

test('по умолчанию английский, ключ возвращается как есть', () => {
    const {t, isEnglish} = load()
    expect(isEnglish()).toBe(true)
    expect(t('Save')).toBe('Save')
    expect(t('{{count}} model|{{count}} models', {count: 1})).toBe('1 model')
    expect(t('{{count}} model|{{count}} models', {count: 3})).toBe('3 models')
})

test('перевод, подстановка и множественное число (русский)', () => {
    const {t} = load('ru')
    expect(t('Save')).toBe('Сохранить')
    expect(t('Player {{number}}', {number: 2})).toBe('Игрок 2')
    expect(t('{{count}} error|{{count}} errors', {count: 1})).toBe('1 ошибка')
    expect(t('{{count}} error|{{count}} errors', {count: 3})).toBe('3 ошибки')
    expect(t('{{count}} error|{{count}} errors', {count: 5})).toBe('5 ошибок')
})

test('нет перевода - показывается английский, игровые термы не трогаются', () => {
    const {t} = load('de')
    expect(t('Some unknown text')).toBe('Some unknown text')
    expect(t('Underdog')).toBe('Underdog')
})

test('tr переводит готовый английский текст по шаблону', () => {
    const {tr, tEn} = load('ru')
    expect(tr(tEn('In Regiment {{index}} you have more than 3 units', {index: 2}))).toBe('В Regiment 2 больше 3 отрядов')
    expect(tr('Choose General')).toBe('Выберите General')
    expect(tr('Totally unknown')).toBe('Totally unknown')
})

test('все локали содержат одинаковый набор ключей', () => {
    const keys = Object.keys(require('../locales/ru').default).sort()
    ;['de', 'es', 'fr', 'it', 'ja', 'ko', 'zh'].forEach(l => {
        expect(Object.keys(require(`../locales/${l}`).default).sort()).toEqual(keys)
    })
})
