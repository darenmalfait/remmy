import * as React from 'react'
import * as uuid from 'uuid'

import {defaultFilenameSettings} from '../components/modules/filename-configuration'
import {setAppearance} from '../lib/utils/appearance'
import {setAutoLaunch} from '../lib/utils/comms'
import {loadSettings, saveSettings} from '../lib/utils/storage'
import {Appearance, FilenameConfiguration} from '../types'

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
  textSeparator: defaultFilenameSettings.textSeparator,
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

const SettingsContext = React.createContext<SettingsContextProps | null>(null)
SettingsContext.displayName = 'SettingsContext'

interface SettingsProviderProps {
  children: React.ReactNode
}

// import { SettingsProvider } from "path-to-context/SettingsContext"
// use <SettingsProvider> as a wrapper around the part you need the context for
function SettingsProvider({children}: SettingsProviderProps) {
  const [settings, setSettings] = React.useState<SettingsState>(defaultSettings)

  const restoreSettings = React.useCallback(() => {
    const existing = loadSettings()

    if (existing.settings) {
      setSettings({...defaultSettings, ...existing.settings})
    }
  }, [])

  React.useEffect(() => {
    restoreSettings()
  }, [restoreSettings])

  React.useEffect(() => {
    setAppearance(settings.appearance)
  }, [settings.appearance])

  const updateSetting = React.useCallback(
    (name: keyof SettingsState, value: boolean | Appearance) => {
      if (name === 'openAtStartup') {
        setAutoLaunch(value as boolean)
      }

      const newSettings = {...settings, [name]: value}
      setSettings(newSettings)
      saveSettings(newSettings)
    },
    [settings],
  )

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

// import { useSettings } fron "path-to-context/SettingsContext"
// within functional component
// const { sessionToken, ...SettingsContext } = useSettings()
function useSettings(): SettingsContextProps {
  const context = React.useContext(SettingsContext)

  if (!context) {
    throw new Error('You should use useSettings within an SettingsContext')
  }

  return context
}

export {SettingsProvider, useSettings, type SettingsState}
