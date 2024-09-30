import * as React from 'react'
import {ThemeProvider as DarenThemeProvider} from '@nerdfish/theme'

import {DestinationsProvider} from './destinations-provider'
import {FileUploadProvider} from './file-upload-provider'
import {SettingsProvider} from './settings-provider'

interface AppProvidersProps {
  children: React.ReactNode
}

function AppProviders({children}: AppProvidersProps) {
  return (
    <SettingsProvider>
      <DestinationsProvider>
        <FileUploadProvider>
          <DarenThemeProvider>{children}</DarenThemeProvider>
        </FileUploadProvider>
      </DestinationsProvider>
    </SettingsProvider>
  )
}

export {AppProviders}
