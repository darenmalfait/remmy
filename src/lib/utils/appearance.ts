import { Appearance } from '../../types'

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

		case undefined: {
			throw new Error('Not implemented yet: undefined case')
		}
		case Appearance.SYSTEM: {
			throw new Error('Not implemented yet: Appearance.SYSTEM case')
		}
		default:
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				setDarkMode()
			} else {
				setLightMode()
			}
	}
}
