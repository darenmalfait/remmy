import { type SettingsState } from '../../settings/settings-provider'
import { rename } from '../utils'

export interface FilenamePreviewProps {
	extension: string
	description?: string
	detail?: string
	date?: Date
	config: Pick<SettingsState, 'filenameConfiguration' | 'textSeparator'>
}

export function FilenamePreview({
	extension,
	description,
	detail,
	date,
	config,
}: FilenamePreviewProps) {
	return (
		<div className="rounded-base border border-muted bg-background-muted p-md">
			<p className="m-0">Your file will look like this:</p>
			<code className="text-foreground">
				{rename({
					extension,
					date,
					description,
					detail,
					filenameConfiguration: config.filenameConfiguration,
					textSeparator: config.textSeparator,
				})}
			</code>
		</div>
	)
}
