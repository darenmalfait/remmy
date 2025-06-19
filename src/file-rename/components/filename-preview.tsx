import { useSettings } from '../../settings/settings-provider'
import { rename } from '../utils'

function FilenamePreview({
	extension,
	description,
	detail,
	date,
}: {
	extension: string
	description?: string
	detail?: string
	date?: Date
}) {
	const { settings } = useSettings()

	return (
		<div className="rounded-base border border-muted bg-background-muted p-md">
			<p className="m-0">Your file will look like this:</p>
			<code className="text-foreground">
				{rename({
					extension,
					date,
					description,
					detail,
					filenameConfiguration: settings.filenameConfiguration,
					textSeparator: settings.textSeparator,
				})}
			</code>
		</div>
	)
}

export { FilenamePreview }
