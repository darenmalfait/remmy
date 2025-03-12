import { loadLocal, saveLocal, STORAGE_KEY_SETTINGS } from '../storage/utils'
import { type SettingsState } from './settings-provider'

export function loadSettings(): { settings?: SettingsState } {
	const { settings } = loadLocal(STORAGE_KEY_SETTINGS) || {}

	return { settings }
}

export function saveSettings(settings: SettingsState): void {
	saveLocal(STORAGE_KEY_SETTINGS, { settings })
}
