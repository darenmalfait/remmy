import { Description, Field, Input, Label } from '@nerdfish/ui'
import * as React from 'react'

import { useSettings } from '../../context/settings-provider'
import { NamePreview } from '../name-preview'
import { Section } from '../section'
import { FilenameConfiguration } from './filename-configuration'

function FilenameFormat() {
	const { settings, updateSetting } = useSettings()

	return (
		<Section>
			<FilenameConfiguration />

			<NamePreview
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
