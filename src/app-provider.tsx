import { ThemeProvider as DarenThemeProvider } from '@nerdfish/theme'
import { TooltipProvider } from '@nerdfish/ui'
import * as React from 'react'
import { DestinationsProvider } from './destinations/destinations-provider'
import { FileUploadProvider } from './file-rename/file-upload-provider'
import { SettingsProvider } from './settings/settings-provider'

interface AppProvidersProps {
	children: React.ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
	return (
		<TooltipProvider>
			<SettingsProvider>
				<DestinationsProvider>
					<FileUploadProvider>
						<DarenThemeProvider>{children}</DarenThemeProvider>
					</FileUploadProvider>
				</DestinationsProvider>
			</SettingsProvider>
		</TooltipProvider>
	)
}

export { AppProviders }
