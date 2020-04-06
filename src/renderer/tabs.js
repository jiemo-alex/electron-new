const elementTavsTab = document.getElementById('tavs-tab')
const elementWorkSpace = document.getElementById('work-space')

function createEditorTab(title) {
    const main = document.createElement('li')
    const view = document.createElement('span')
    const close = document.createElement('span')
    main.className = 'tab d-flex list-style-none cursor-pointer font-small border-right float-left'
    main.setAttribute('title', title)
    view.innerText = title
    view.className = 'w-100'
    close.className = 'px-1 text-bold'
    close.style.height = '100%'
    close.innerHTML = '&times;'

    main.appendChild(view)
    main.appendChild(close)
    return [main, view, close]
}

class Tab {
    static current = null

    constructor({
        title,
        isPage,
        value,
        path
    }) {
        this.isPage = isPage
        this.area = this.createArea()
        this.appendTab(title)

        this.textarea = null
        this.path = path

        if (!isPage) {
            this.setValue(value ? value : '')
        }
    }

    createArea() {
        const area = document.createElement('div')
        area.className = 'area h-100'
        area.style.display = 'none'
        elementWorkSpace.appendChild(area)
        return area
    }

    appendTab(title) {
        const [main, view, close] = createEditorTab(title)
        view.onclick = this.active.bind(this)
        close.onclick = this.destruct.bind(this)
        this.main = main
        this.view = view
        this.close = close
        elementTavsTab.appendChild(main)
    }

    setValue(value) {
        const textarea = document.createElement('textarea')
        textarea.className = 'w-100 h-100 px-1 py-1 color-base'
        textarea.value = value
        this.area.innerText = ''
        this.area.appendChild(textarea)
        this.textarea = textarea
    }

    getValue() {
        return this.textarea ? this.textarea.value : null
    }

    getPath() {
        return this.path
    }

    setPath(path) {
        this.path = path
    }

    setTitle(title) {
        this.view.innerText = title
    }

    active() {
        const areas = document.getElementsByClassName('area')
        const tabs = document.getElementsByClassName('tab')
        for (const a of areas) {
            a.style.display = 'none'
        }
        for (const t of tabs) {
            t.style.backgroundColor = 'white'
        }
        this.main.style.backgroundColor = '#EEE'
        this.area.style.display = 'block'
        Tab.current = this
    }

    destruct() {
        elementWorkSpace.removeChild(this.area)
        elementTavsTab.removeChild(this.main)
        if (Tab.current === this) {
            Tab.current = null
        }
    }
}

class Tabs {
    add(options = {}, callback) {
        const tab = new Tab(options)
        callback(tab)
    }

    getCurrentTab() {
        return Tab.current
    }
}

const tabs = new Tabs()

module.exports = tabs
