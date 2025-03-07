import path from 'path'
import { type Destination } from '../../destinations/destinations-provider'
import { type SettingsState } from '../../settings/settings-provider'
import { Constants } from './constants'

function getAppDataPath() {
	switch (process.platform) {
		case 'darwin': {
			return path.join(
				process.env.HOME ?? '',
				'Library',
				'Application Support',
				'Remmy',
			)
		}
		case 'win32': {
			return path.join(process.env.APPDATA ?? '', 'Remmy')
		}
		case 'linux': {
			return path.join(process.env.HOME ?? '', '.Remmy')
		}
		case 'aix': {
			throw new Error('Not implemented yet: "aix" case')
		}
		case 'android': {
			throw new Error('Not implemented yet: "android" case')
		}
		case 'freebsd': {
			throw new Error('Not implemented yet: "freebsd" case')
		}
		case 'haiku': {
			throw new Error('Not implemented yet: "haiku" case')
		}
		case 'openbsd': {
			throw new Error('Not implemented yet: "openbsd" case')
		}
		case 'sunos': {
			throw new Error('Not implemented yet: "sunos" case')
		}
		case 'cygwin': {
			throw new Error('Not implemented yet: "cygwin" case')
		}
		case 'netbsd': {
			throw new Error('Not implemented yet: "netbsd" case')
		}
		default: {
			console.info('Unsupported platform!')
			process.exit(1)
		}
	}
}

function saveLocal(key: string, value: any): void {
	localStorage.setItem(key, JSON.stringify(value))
}

function loadLocal(key: string) {
	const existing = localStorage.getItem(key)
	return existing ? JSON.parse(existing) : {}
}

function loadSettings(): { settings?: SettingsState } {
	const { settings } = loadLocal(Constants.STORAGE_KEY_SETTINGS) || {}

	return { settings }
}

function saveSettings(settings: SettingsState): void {
	saveLocal(Constants.STORAGE_KEY_SETTINGS, { settings })
}

function clearStorage(): void {
	localStorage.clear()
}

function loadDestinations(): { destinations?: Destination[] } {
	const { destinations } = loadLocal(Constants.STORAGE_KEY_DESTINATIONS) || {}

	return { destinations }
}

function saveDestinations(destinations: Destination[]): void {
	saveLocal(Constants.STORAGE_KEY_DESTINATIONS, { destinations })
}

export {
	loadSettings,
	saveSettings,
	clearStorage,
	loadDestinations,
	saveDestinations,
	getAppDataPath,
}
