import { ThemeProvider as DarenThemeProvider } from '@nerdfish/theme'
import * as React from 'react'
import { FileUploadProvider } from './context/file-upload-provider'
import { DestinationsProvider } from './destinations/destinations-provider'
import { SettingsProvider } from './settings/settings-provider'

interface AppProvidersProps {
	children: React.ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
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

export { AppProviders }
