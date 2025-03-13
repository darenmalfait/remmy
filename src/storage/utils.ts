import path from 'path'
import { env } from '../env'

export const STORAGE_KEY_SETTINGS = 'remmy-settings'

export function getAppDataPath() {
	switch (process.platform) {
		case 'darwin': {
			return path.join(
				env.HOME ?? '',
				'Library',
				'Application Support',
				'Remmy',
			)
		}
		case 'win32': {
			return path.join(env.APPDATA ?? '', 'Remmy')
		}
		case 'linux': {
			return path.join(env.HOME ?? '', '.Remmy')
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

export function saveLocal(key: string, value: any): void {
	localStorage.setItem(key, JSON.stringify(value))
}

export function loadLocal(key: string) {
	const existing = localStorage.getItem(key)
	return existing ? JSON.parse(existing) : {}
}

export function clearStorage(): void {
	localStorage.clear()
}
