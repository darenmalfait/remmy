import * as React from 'react'

import { useSettings } from '../context/settings-provider'
import { rename } from '../lib/utils/filename'

function NamePreview({
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
		<div className="rounded-base bg-background-muted p-4">
			<p>Your file will look like this:</p>
			<code>
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

export { NamePreview }
