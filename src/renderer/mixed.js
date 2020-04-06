const $ = require('jquery')
const { ipcRenderer } = require('electron')
const { IPC_SAVE_FILE, IPC_LOAD_FILE } = require('../constants')
const tabs = require('./tabs')

function loadPage(title, path, callback) {
    tabs.add({title, isPage: true}, (tab) => {
        $(tab.area).load(path, () => {
            tab.active()
            callback(tab)
        })
    })
}

function createFileInMemery() {
    tabs.add({title: '*未保存文件*'}, (tab) => {
        tab.active()
        tab.setValue('')
    })
}

function saveFile(path, value) {
    ipcRenderer.send(IPC_SAVE_FILE, {
        path: path,
        value: value
    })
}

function saveCurrentFile() {
    const tab = tabs.getCurrentTab()
    if (tab && !tab.isPage) {
        saveFile(tab.getPath(), tab.getValue())
    }
}

function createFileItem(name, path) {
    const li = document.createElement('li')
    li.className = 'side-list list-style-none cursor-pointer font-small text-dark-50'
    li.style.padding = '4px 0 0 1.5rem'
    li.innerText = name
    li.onclick = event => {
        event.preventDefault()
        ipcRenderer.send(IPC_LOAD_FILE, {name, path})
    }
    return li
}

function createFilelist(elementFilesUl, files) {
    files.forEach(({name, path}) => {
        elementFilesUl.appendChild(
            createFileItem(name, path)
        )
    });
}

function removeFileItems(elementFilesUl) {
    const lists = elementFilesUl.getElementsByTagName('li')
    for (const li of lists) {
        elementFilesUl.removeChild(li)
    }
}

module.exports = {
    loadPage,
    createFileInMemery,
    saveCurrentFile,
    saveFile,
    createFilelist,
    removeFileItems
}
