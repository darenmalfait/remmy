import { TooltipProvider } from '@nerdfish/react/tooltip'
import { type ReactNode } from 'react'
import { DestinationsProvider } from './destinations/destinations-provider'
import { FileUploadProvider } from './file/file-upload-provider'
import { FilenameFormatProvider } from './filename/filename-format-provider'
import { SettingsProvider } from './settings/settings-provider'

interface AppProvidersProps {
	children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
	return (
		<TooltipProvider>
			<SettingsProvider>
				<DestinationsProvider>
					<FilenameFormatProvider>
						<FileUploadProvider>{children}</FileUploadProvider>
					</FilenameFormatProvider>
				</DestinationsProvider>
			</SettingsProvider>
		</TooltipProvider>
	)
}
