const { dialog } = require('electron')
const fs = require('graceful-fs')
const path = require('path')

function dialogSelect(type, callback) {
    const result = dialog.showOpenDialog({
        properties: [type]
    })
    result.then(callback)
}

function getFiles(array, basePath) {
    const result = []
    array.forEach((file, _) => {
        const filePath = path.join(basePath, file)
        const stat = fs.statSync(filePath)
        if (stat.isFile()) {
            result.push({
                name: file,
                path: filePath
            })
        }
    })
    return result;
}

function saveHistoryFile(storePath, dirPath, callback = null) {
    return fs.readFile(storePath, (err, data) => {
      if (err) {
        throw err
      }
      const json = JSON.parse(data).filter(d => d !== dirPath)
      fs.writeFile(storePath, JSON.stringify([
        dirPath,
        ...json
      ].slice(0, 6)), () => {
        if (callback) {
          callback()
        }
      })
    })
  }

module.exports = {
    dialogSelect,
    getFiles,
    saveHistoryFile
}
