import { saveLocal, loadLocal } from '../storage/utils'
import { type Destination } from './types'

export const STORAGE_KEY_DESTINATIONS = 'remmy-destinations'

export function loadDestinations(): { destinations?: Destination[] } {
	const { destinations } = loadLocal(STORAGE_KEY_DESTINATIONS) || {}

	return { destinations }
}

export function saveDestinations(destinations: Destination[]): void {
	saveLocal(STORAGE_KEY_DESTINATIONS, { destinations })
}
