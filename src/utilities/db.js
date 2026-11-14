// Единая точка доступа к базе данных. Сама база лежит в public/db (готовится scripts/build-db.js)
// и загружается один раз при старте, до запуска приложения. После первой загрузки файл хранится в кэше браузера.
// Объект raw заполняется на месте, поэтому модули могут получать его через require и читать data позже.
const raw = {metadata: {}, data: {}}

const BASE_URL = `${process.env.PUBLIC_URL || ''}/db/`
const CACHE_NAME = 'db-cache'

const openCache = async () => {
  try {
    return typeof caches !== 'undefined' ? await caches.open(CACHE_NAME) : null
  } catch (e) {
    return null
  }
}

// Файл имеет хэш в имени, поэтому после первой загрузки лежит в кэше и больше не скачивается
const fetchJson = async (file, bytes, onChunk) => {
  const url = `${BASE_URL}${file}`
  const cache = await openCache()
  let response = cache ? await cache.match(url) : null
  if (!response) {
    response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to load ${file}`)
    if (cache) cache.put(url, response.clone()).catch(() => {})
  }
  if (!response.body || !response.body.getReader) {
    const json = await response.json()
    onChunk(bytes)
    return json
  }
  const reader = response.body.getReader()
  const chunks = []
  for (;;) {
    const {done, value} = await reader.read()
    if (done) break
    chunks.push(value)
    onChunk(value.length)
  }
  return new Response(new Blob(chunks)).json()
}

const fetchManifest = async () => {
  const url = `${BASE_URL}manifest.json`
  const cache = await openCache()
  try {
    const response = await fetch(url, {cache: 'no-cache'})
    if (!response.ok) throw new Error('manifest')
    if (cache) cache.put(url, response.clone()).catch(() => {})
    return await response.json()
  } catch (e) {
    // нет сети: берём последнюю сохранённую версию
    const saved = cache ? await cache.match(url) : null
    if (!saved) throw e
    return saved.json()
  }
}

// Подключает загруженную базу ({metadata, data})
const setDatabase = (core) => {
  raw.metadata = core.metadata
  Object.assign(raw.data, core.data)
}

// Загружает базу. onProgress получает долю от 0 до 1
const loadDatabase = async (onProgress = () => {}) => {
  const manifest = await fetchManifest()
  const {file, bytes} = manifest.files.core
  let loaded = 0
  const core = await fetchJson(file, bytes, (size) => {
    loaded += size
    onProgress(Math.min(1, loaded / bytes))
  })
  setDatabase(core)
}

// ---------- Язык интерфейса ----------
// Выбранный язык хранится на устройстве. По умолчанию английский, без автоопределения
const LANGUAGE_KEY = 'language'
const DEFAULT_LANGUAGE = 'en'

const LANGUAGES = [
  {id: 'en', name: 'English'},
  {id: 'de', name: 'Deutsch'},
  {id: 'es', name: 'Español'},
  {id: 'fr', name: 'Français'},
  {id: 'it', name: 'Italiano'},
  {id: 'ja', name: '日本語'},
  {id: 'ko', name: '한국어'},
  {id: 'zh', name: '中文'},
  {id: 'ru', name: 'Русский'}
]

const getLanguage = () => {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    if (saved && LANGUAGES.some(({id}) => id === saved)) return saved
  } catch (e) {}
  return DEFAULT_LANGUAGE
}

const setLanguage = (language) => {
  try {
    localStorage.setItem(LANGUAGE_KEY, language)
  } catch (e) {}
  // интерфейс читает язык один раз при загрузке, поэтому перезагружаем приложение
  window.location.reload()
}

module.exports = raw
module.exports.loadDatabase = loadDatabase
module.exports.setDatabase = setDatabase
module.exports.LANGUAGES = LANGUAGES
module.exports.getLanguage = getLanguage
module.exports.setLanguage = setLanguage
