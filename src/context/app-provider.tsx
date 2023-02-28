import * as React from 'react'
import {ThemeProvider as DarenThemeProvider} from '@nerdfish/theme'
import {ToastProvider} from '@nerdfish/ui'

import {DestinationsProvider} from './destinations-provider'
import {FileUploadProvider} from './file-upload-provider'
import {SettingsProvider} from './settings-provider'

interface AppProvidersProps {
  children: React.ReactNode
}

function AppProviders({children}: AppProvidersProps) {
  return (
    <ToastProvider>
      <SettingsProvider>
        <DestinationsProvider>
          <FileUploadProvider>
            <DarenThemeProvider>{children}</DarenThemeProvider>
          </FileUploadProvider>
        </DestinationsProvider>
      </SettingsProvider>
    </ToastProvider>
  )
}

export {AppProviders}
