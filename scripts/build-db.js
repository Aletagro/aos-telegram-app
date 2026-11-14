// Готовит базу данных к загрузке приложением: src/dataBase.json (источник, в бандл не попадает) превращается в
//   public/db/core.<hash>.json - все таблицы
//   public/db/manifest.json    - версия данных, имя файла и размер (для индикатора загрузки)
// Файл с хэшем в имени не меняется, поэтому его можно кэшировать надолго. Запускается автоматически перед start и build.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const SOURCE = path.join(__dirname, '..', 'src', 'dataBase.json')
const OUT = path.join(__dirname, '..', 'public', 'db')

const text = JSON.stringify(JSON.parse(fs.readFileSync(SOURCE, 'utf8')))
const hash = crypto.createHash('sha1').update(text).digest('hex').slice(0, 10)
const file = `core.${hash}.json`

// удаляем файлы прошлой сборки (если не получилось - не страшно, они просто не попадут в manifest)
fs.mkdirSync(OUT, {recursive: true})
fs.readdirSync(OUT).forEach((name) => {
    try {
        fs.unlinkSync(path.join(OUT, name))
    } catch (e) {}
})

fs.writeFileSync(path.join(OUT, file), text)
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({files: {core: {file, bytes: Buffer.byteLength(text)}}}))
console.log(`db: core ${(Buffer.byteLength(text) / 1e6).toFixed(1)}MB`)
