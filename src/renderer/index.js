const { ipcRenderer } = require('electron')
const ipcEvents = require('./ipcEvents')
const { IPC_SELECT_FILE, IPC_SELECT_DIR, IPC_LOAD_HISTORY } = require('../constants')
const { loadPage, createFileInMemery } = require('./mixed')

ipcEvents(document.getElementById('files-ul'))

loadPage('欢迎使用', '../view/page/welcome.html', (tab) => {
    const elementsNewFile = document.getElementsByClassName('new-file')
    for (const e of elementsNewFile) {
        e.onclick = event => {
            event.preventDefault()
            createFileInMemery()
        }
    }

    const elementsOpenFile = document.getElementsByClassName('open-file')
    for (const e of elementsOpenFile) {
        e.onclick = event => {
            event.preventDefault()
            ipcRenderer.send(IPC_SELECT_FILE)
        }
    }

    const elementsOpenDir = document.getElementsByClassName('open-dir')
    for (const e of elementsOpenDir) {
        e.onclick = event => {
            event.preventDefault()
            ipcRenderer.send(IPC_SELECT_DIR)
        }
    }

    ipcRenderer.send(IPC_LOAD_HISTORY)
})
