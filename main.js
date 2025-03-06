const path = require('path')

const remoteMain = require('@electron/remote/main')
const { ipcMain, app, nativeTheme } = require('electron')
const { menubar } = require('menubar')
const PDFParser = require('pdf2json')
const { onFirstRunMaybe } = require('./first-run')

remoteMain.initialize()

const iconIdle = path.join(
	__dirname,
	'assets',
	'images',
	'tray-idleTemplate.png',
)
const iconActive = path.join(__dirname, 'assets', 'images', 'tray-active.png')

const browserWindowOpts = {
	width: 625,
	height: 500,
	minWidth: 625,
	minHeight: 500,
	resizable: false,
	webPreferences: {
		enableRemoteModule: true,
		overlayScrollbars: true,
		nodeIntegration: true,
		contextIsolation: false,
	},
}

const isDevMode = !app.isPackaged

const delayedHideAppIcon = () => {
	if (app.dock && app.dock.hide) {
		// Setting a timeout because the showDockIcon is not currently working
		// See more at https://github.com/maxogden/menubar/issues/306
		setTimeout(() => {
			app.dock.hide()
		}, 1500)
	}
}

app.on('ready', async () => {
	await onFirstRunMaybe()
})

const menubarApp = menubar({
	icon: iconIdle,
	index: `file://${__dirname}/index.html`,
	browserWindow: browserWindowOpts,
	preloadWindow: true,
})

menubarApp.on('before-load', () => {
	remoteMain.enable(menubarApp.window.webContents)
})

menubarApp.on('ready', () => {
	delayedHideAppIcon()

	menubarApp.tray.setIgnoreDoubleClickEvents(true)

	// autoUpdater.checkForUpdatesAndNotify()

	nativeTheme.on('updated', () => {
		if (nativeTheme.shouldUseDarkColors) {
			menubarApp.window.webContents.send('update-native-theme', 'DARK')
		} else {
			menubarApp.window.webContents.send('update-native-theme', 'LIGHT')
		}
	})

	if (isDevMode) {
		menubarApp.window.webContents.openDevTools({ mode: 'detach' })
	}

	function dropFileListener(_, files) {
		menubarApp.showWindow()
		menubarApp.window.webContents.send('file-drop', files)
	}

	menubarApp.tray.on('drop-files', dropFileListener)

	ipcMain.on('reopen-window', () => menubarApp.showWindow())
	ipcMain.on('app-quit', () => menubarApp.app.quit())
	ipcMain.on('update-icon', (_, arg) => {
		if (!menubarApp.tray.isDestroyed()) {
			if (arg === 'TrayActive') {
				menubarApp.tray.setImage(iconActive)
			} else {
				menubarApp.tray.setImage(iconIdle)
			}
		}
	})
	ipcMain.on('prefix-convert-pdf', (event, file_base_path) => {
		const pdfParser = new PDFParser(null, 1)

		pdfParser.on('pdfParser_dataError', (errData) => {
			event.sender.send('prefix-pdf-converted-error', errData)
		})

		pdfParser.on('pdfParser_dataReady', (pdfData) => {
			event.sender.send(
				'prefix-pdf-converted',
				pdfParser.getRawTextContent(pdfData),
			)
		})

		pdfParser.loadPDF(file_base_path)
	})
})
