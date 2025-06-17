const remoteMain = require('@electron/remote/main')
const dotenv = require('dotenv')
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const PDFParser = require('pdf2json')

dotenv.config()

remoteMain.initialize()
// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform != 'darwin') {
		app.quit()
	}
})

const isDev = !app.isPackaged

let mainWindow

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 900,
		webPreferences: {
			nodeIntegration: true, // Required for `require('electron')` in renderer
			contextIsolation: false, // Required if `nodeIntegration` is enabled
			sandbox: false,
		},
	})

	// Load the app
	mainWindow.loadURL(`file://${__dirname}/index.html`)
	remoteMain.enable(mainWindow.webContents)

	nativeTheme.on('updated', () => {
		if (nativeTheme.shouldUseDarkColors) {
			mainWindow.webContents.send('update-native-theme', 'DARK')
		} else {
			mainWindow.webContents.send('update-native-theme', 'LIGHT')
		}
	})

	// Open the DevTools automatically if in development mode
	if (isDev && !!process.env.CLIENT_DEBUG) {
		mainWindow.webContents.openDevTools({ mode: 'detach' })
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow)

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

function dropFileListener(_, files) {
	mainWindow.webContents.send('file-drop', files)
}

ipcMain.on('dropped-file', dropFileListener)

ipcMain.on('app-quit', () => {
	app.quit()
})

// PDF Parser functionality from the old file
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
