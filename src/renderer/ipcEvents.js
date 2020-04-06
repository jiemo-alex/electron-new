const { ipcRenderer } = require('electron')
const path = require('path')
const { IPC_LOAD_HISTORY_REPLY, IPC_LOAD_DIR_REPLY, IPC_LOAD_FILE, IPC_LOAD_FILE_REPLY, IPC_SAVE_FILE_REPLY } = require('../constants')
const {
    createFileInMemery,
    saveCurrentFile,
    createFilelist,
    removeFileItems
} = require('./mixed')
const tabs = require('./tabs')

module.exports = elementFilesUl => {
    // render file list
    ipcRenderer.on(IPC_LOAD_DIR_REPLY, (_, {files}) => {
        removeFileItems(elementFilesUl)
        createFilelist(elementFilesUl, files)
    })

    // render file content
    ipcRenderer.on(IPC_LOAD_FILE_REPLY, (_, {title, content, path}) => {
        tabs.add({title, path, value: content}, (tab) => {
            tab.active()
            tab.textarea.focus()
        })
    })

    // refresh file title and content
    ipcRenderer.on(IPC_SAVE_FILE_REPLY, (_, {title, path}) => {
        const tab = tabs.getCurrentTab()
        tab.setTitle(title)
        tab.setPath(path)
        tab.textarea.focus()
    })

    ipcRenderer.on(IPC_LOAD_HISTORY_REPLY, (_, {files}) => {
        const element = document.getElementById('history-list')
        for (const f of files) {
            const li = document.createElement('li')
            const a = document.createElement('a')
            li.className = 'list-style-none font-small'
            li.appendChild(a)
            a.innerText = f
            a.href = '#'

            a.onclick = e => {
                e.preventDefault()
                const name = path.basename(f)
                ipcRenderer.send(IPC_LOAD_FILE, {name, path: f})
            }

            element.appendChild(li)
        }
    })

    ipcRenderer.on('new-file', _ => {
        createFileInMemery()
    })

    ipcRenderer.on('save-file', _ => {
        saveCurrentFile()
    })
}
