import {
	createContext,
	useCallback,
	useEffect,
	useContext,
	useState,
	type ReactNode,
	useMemo,
} from 'react'
import * as uuid from 'uuid'

import { defaultFilenameSettings } from '../filename/settings'
import { type FilenameConfiguration } from '../filename/types'
import { Appearance } from './types'
import {
	setAutoLaunch,
	loadSettings,
	saveSettings,
	setAppearance,
} from './utils'

interface SettingsState {
	ownVatNumber: string
	vatLookupEnabled: boolean
	ocrEnabled: boolean
	participating: boolean
	playSound: boolean
	openAtStartup: boolean
	appearance: Appearance
	textSeparator: string
	defaultSeparator: string
	filenameConfiguration: FilenameConfiguration[]
}

const defaultSettings: SettingsState = {
	ownVatNumber: '',
	vatLookupEnabled: false,
	ocrEnabled: true,
	participating: false,
	playSound: true,
	openAtStartup: false,
	appearance: Appearance.SYSTEM,
	textSeparator: defaultFilenameSettings.inTextSeparator,
	defaultSeparator: defaultFilenameSettings.separator,
	filenameConfiguration: [
		{
			id: uuid.v4(),
			type: 'date',
			value: defaultFilenameSettings.date,
		},
		{
			id: uuid.v4(),
			type: 'separator',
			value: defaultFilenameSettings.separator,
		},
		{
			id: uuid.v4(),
			type: 'description',
			value: defaultFilenameSettings.description,
		},
		{
			id: uuid.v4(),
			type: 'separator',
			value: defaultFilenameSettings.separator,
		},
		{
			id: uuid.v4(),
			type: 'detail',
			value: defaultFilenameSettings.detail,
		},
	],
}

interface SettingsContextProps {
	settings: SettingsState
	updateSetting: (key: keyof SettingsState, value: any) => void
}

const SettingsContext = createContext<SettingsContextProps | null>(null)
SettingsContext.displayName = 'SettingsContext'

interface SettingsProviderProps {
	children: ReactNode
}

// import { SettingsProvider } from "path-to-context/SettingsContext"
// use <SettingsProvider> as a wrapper around the part you need the context for
function SettingsProvider({ children }: SettingsProviderProps) {
	const [settings, setSettings] = useState<SettingsState>(defaultSettings)

	const restoreSettings = useCallback(() => {
		const existing = loadSettings()

		if (existing.settings) {
			setSettings({ ...defaultSettings, ...existing.settings })
		}
	}, [])

	useEffect(() => {
		restoreSettings()
	}, [restoreSettings])

	useEffect(() => {
		setAppearance(settings.appearance)
	}, [settings.appearance])

	const updateSetting = useCallback(
		(name: keyof SettingsState, value: boolean | Appearance) => {
			if (name === 'openAtStartup') {
				setAutoLaunch(value as boolean)
			}

			const newSettings = { ...settings, [name]: value }
			setSettings(newSettings)
			saveSettings(newSettings)
		},
		[settings],
	)

	return (
		<SettingsContext
			value={useMemo(
				() => ({
					settings,
					updateSetting,
				}),
				[settings, updateSetting],
			)}
		>
			{children}
		</SettingsContext>
	)
}

// import { useSettings } fron "path-to-context/SettingsContext"
// within functional component
// const { sessionToken, ...SettingsContext } = useSettings()
function useSettings(): SettingsContextProps {
	const context = useContext(SettingsContext)

	if (!context) {
		throw new Error('You should use useSettings within an SettingsContext')
	}

	return context
}

export { SettingsProvider, useSettings, type SettingsState }
