const { app, Menu } = require('electron')

module.exports = win => {
  const template = [
    {
      label: '文件(F)',
      submenu: [
        {
          label: '新建文件 (N)',
          accelerator: 'CmdOrCtrl+N',
          click: async () => {
            win.webContents.send('new-file')
          }
        },
        {
          label: '保存 (S)',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            win.webContents.send('save-file')
          }
        },
        {
          label: '退出 (Q)',
          accelerator: 'CmdOrCtrl+Q',
          click: async () => {
            if (process.platform !== 'darwin') {
              app.quit()
            }
          }
        },
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
