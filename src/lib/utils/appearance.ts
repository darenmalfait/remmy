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
