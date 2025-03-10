import { app } from '@electron/remote'
import { ipcRenderer, shell } from 'electron'

async function openExternalLink(url: string): Promise<void> {
	await shell.openExternal(url)
}

function setAutoLaunch(value: boolean): void {
	app.setLoginItemSettings({
		openAtLogin: value,
		openAsHidden: value,
	})
}

function updateTrayIcon(notificationsLength = 0): void {
	if (notificationsLength > 0) {
		ipcRenderer.send('update-icon', 'TrayActive')
	} else {
		ipcRenderer.send('update-icon')
	}
}

function reOpenWindow(): void {
	ipcRenderer.send('reopen-window')
}

function restoreSetting(setting: string, value: any): void {
	ipcRenderer.send(setting, value)
}

export {
	openExternalLink,
	setAutoLaunch,
	updateTrayIcon,
	reOpenWindow,
	restoreSetting,
}
