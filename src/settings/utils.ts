import { loadLocal, saveLocal, STORAGE_KEY_SETTINGS } from '../storage/utils'
import { type SettingsState } from './settings-provider'
import { Appearance } from './types'

export function loadSettings(): { settings?: SettingsState } {
	const { settings } = loadLocal(STORAGE_KEY_SETTINGS) || {}

	return { settings }
}

export function saveSettings(settings: SettingsState): void {
	saveLocal(STORAGE_KEY_SETTINGS, { settings })
}

export const setLightMode = (): void => {
	document.documentElement.classList.remove('dark')
}

export const setDarkMode = (): void => {
	document.documentElement.classList.add('dark')
}

export const setAppearance = (mode?: Appearance): void => {
	switch (mode) {
		case Appearance.LIGHT:
			setLightMode()
			break

		case Appearance.DARK:
			setDarkMode()
			break

		case undefined:
		case Appearance.SYSTEM:
		default:
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				setDarkMode()
			} else {
				setLightMode()
			}
	}
}
