import { ThemeProvider as DarenThemeProvider } from '@nerdfish/theme'
import { TooltipProvider } from '@nerdfish/ui'
import * as React from 'react'
import { DestinationsProvider } from './destinations/destinations-provider'
import { FileUploadProvider } from './file/file-upload-provider'
import { FilenameFormatProvider } from './filename/filename-format-provider'
import { SettingsProvider } from './settings/settings-provider'

interface AppProvidersProps {
	children: React.ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
	return (
		<TooltipProvider>
			<SettingsProvider>
				<DestinationsProvider>
					<FilenameFormatProvider>
						<FileUploadProvider>
							<DarenThemeProvider>{children}</DarenThemeProvider>
						</FileUploadProvider>
					</FilenameFormatProvider>
				</DestinationsProvider>
			</SettingsProvider>
		</TooltipProvider>
	)
}

export { AppProviders }
