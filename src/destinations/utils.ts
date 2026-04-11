import { saveLocal, loadLocal } from '../storage/utils'
import { type Destination } from './types'

export const STORAGE_KEY_DESTINATIONS = 'remmy-destinations'

export type PersistedDestinations = {
	destinations?: Destination[]
	sameFolderAsDefault?: boolean
}

export function loadDestinations(): PersistedDestinations {
	return loadLocal(STORAGE_KEY_DESTINATIONS) ?? {}
}

export function saveDestinations(
	destinations: Destination[],
	sameFolderAsDefault: boolean,
): void {
	saveLocal(STORAGE_KEY_DESTINATIONS, {
		destinations,
		sameFolderAsDefault,
	})
}
