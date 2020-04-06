const { app, ipcMain } = require('electron')
const fs = require('graceful-fs')
const path = require('path')
const { dialogSelect, getFiles, saveHistoryFile } = require('./functions')
const {
    IPC_LOAD_FILE,
    IPC_SELECT_FILE,
    IPC_SELECT_DIR,
    IPC_LOAD_FILE_REPLY,
    IPC_LOAD_DIR_REPLY,
    IPC_SAVE_FILE,
    IPC_SAVE_FILE_REPLY,
    IPC_LOAD_HISTORY,
    IPC_LOAD_HISTORY_REPLY
} = require('../constants')

const historyFile = path.join(app.getPath('appData'), 'histories.json')

module.exports = function ipcEvents(win) {

    ipcMain.on(IPC_SELECT_FILE, (event) => {
        dialogSelect('openFile', ({canceled, filePaths}) => {
            if (!canceled) {
                const selectedPath = filePaths[0]
                fs.readFile(selectedPath, {encoding:'utf-8'}, (_, data) => {
                    const basename = path.basename(selectedPath)
                    event.reply(IPC_LOAD_FILE_REPLY, {
                        title: basename,
                        content: data,
                        path: selectedPath
                    })
                })
            }
        })
    })

    ipcMain.on(IPC_LOAD_FILE, (event, {name, path}) => {
        fs.readFile(path, {encoding: 'utf-8'}, (_, data) => {
            saveHistoryFile(historyFile, path)
            event.reply(IPC_LOAD_FILE_REPLY, {
                title: name,
                content: data,
                path
            })
        })
    })

    ipcMain.on(IPC_SELECT_DIR, (event) => {
        dialogSelect('openDirectory', ({canceled, filePaths}) => {
            if (!canceled) {
                const selectedPath = filePaths[0]
                fs.readdir(selectedPath, (_, files) => {
                    const result = getFiles(files, selectedPath)
                    event.reply(IPC_LOAD_DIR_REPLY, {
                        files: result
                    })
                })
            }
        })
    })

    function saveFile(selectedPath, value, event) {
        fs.writeFile(selectedPath, value, _ => {
            const basename = path.basename(selectedPath)
            event.reply(IPC_SAVE_FILE_REPLY, {
                title: basename,
                path: selectedPath
            })
        })
    }

    ipcMain.on(IPC_SAVE_FILE, (event, {value, path: selectedPath}) => {
        if (!selectedPath) {
            dialogSelect('openFile',  ({canceled, filePaths}) => {
                if (canceled) {
                    return false
                }
                selectedPath = filePaths[0]
            })
        }
        saveFile(selectedPath, value, event)
    })

    ipcMain.on(IPC_LOAD_HISTORY, (event) => {
        const files = fs.readFileSync(historyFile, {encoding: 'utf-8'})
        event.reply(IPC_LOAD_HISTORY_REPLY, {files: JSON.parse(files)})
    })

}
