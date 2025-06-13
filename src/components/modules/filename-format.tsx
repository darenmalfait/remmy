import { Description, Field, Input, Label } from '@nerdfish/ui'
import * as React from 'react'

import { FilenameConfiguration } from '../../file-rename/components/filename-configuration'
import { FilenamePreview } from '../../file-rename/components/filename-preview'
import { useSettings } from '../../settings/settings-provider'
import { Section } from '../section'

function FilenameFormat() {
	const { settings, updateSetting } = useSettings()

	return (
		<Section className="flex flex-col gap-lg">
			<FilenameConfiguration />

			<FilenamePreview
				date={new Date()}
				description="example document"
				extension="pdf"
				detail="example detail"
			/>

			<Field>
				<Label htmlFor="textSeparator">
					Text separator
					<Description>
						Use this separator to separate within the same block of text
					</Description>
				</Label>

				<Input
					id="textSeparator"
					name="textSeparator"
					onChange={(event) => {
						updateSetting('textSeparator', event.target.value)
					}}
					defaultValue={settings.textSeparator}
				/>
			</Field>

			<Field>
				<Label htmlFor="defaultSeparator">
					Default separator
					<Description>
						Use this separator to separate blocks of text
					</Description>
				</Label>

				<Input
					id="defaultSeparator"
					name="defaultSeparator"
					defaultValue={settings.defaultSeparator}
					onChange={(event) => {
						updateSetting('defaultSeparator', event.target.value)
					}}
				/>
			</Field>
		</Section>
	)
}

export { FilenameFormat }
