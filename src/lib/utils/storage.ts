import {Destination} from '../../context/destinations-provider'
import {SettingsState} from '../../context/settings-provider'
import {Constants} from './constants'

function saveLocal(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadLocal(key: string) {
  const existing = localStorage.getItem(key)
  return existing ? JSON.parse(existing) : {}
}

function loadSettings(): {settings?: SettingsState} {
  const {settings} = loadLocal(Constants.STORAGE_KEY_SETTINGS) || {}

  return {settings}
}

function saveSettings(settings: SettingsState): void {
  saveLocal(Constants.STORAGE_KEY_SETTINGS, {settings})
}

function clearStorage(): void {
  localStorage.clear()
}

function loadDestinations(): {destinations?: Destination[]} {
  const {destinations} = loadLocal(Constants.STORAGE_KEY_DESTINATIONS) || {}

  return {destinations}
}

function saveDestinations(destinations: Destination[]): void {
  saveLocal(Constants.STORAGE_KEY_DESTINATIONS, {destinations})
}

export {
  loadSettings,
  saveSettings,
  clearStorage,
  loadDestinations,
  saveDestinations,
}
