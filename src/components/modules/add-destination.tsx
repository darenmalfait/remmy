import * as remote from '@electron/remote'
import {
	Button,
	ErrorDescription,
	Field,
	Input,
	Label,
	Paragraph,
} from '@nerdfish/ui'
import * as React from 'react'
import {
	type Destination,
	type DestinationActionResult,
	useDestinations,
} from '../../destinations/destinations-provider'
import { Section } from '../section'

function AddDestination({
	onSave,
}: {
	onSave?: (destination: Pick<Destination, 'name' | 'path'>) => void
}) {
	const [path, setPath] = React.useState<string>('')
	const [name, setName] = React.useState<string>('')

	const { addDestination } = useDestinations()

	const [error, setError] = React.useState<DestinationActionResult['error']>()

	function handleSave() {
		const result = addDestination({ name, path })

		if (result.status === 'success') {
			onSave?.({
				name,
				path,
			})

			setPath('')
			setName('')
		} else if (result.status === 'error') {
			setError(result.error)
		}
	}

	async function onFolderSelect() {
		remote.app.focus()

		await remote.dialog
			.showOpenDialog({
				filters: [],
				properties: ['openDirectory'],
			})
			.then((result) => {
				if (result.canceled) return

				if (result.filePaths.length > 0) {
					setPath(result.filePaths[0])
				}
			})
			.catch((err: any) => {
				console.error(err)
			})

		remote.app.focus()
	}

	return (
		<Section>
			<Paragraph>
				Enter the path to the destination.
				<br />
				For example,{' '}
				<code className="text-foreground">/Users/daren/Downloads</code>
			</Paragraph>
			<div className="space-y-4">
				<Field>
					<Label>Alias</Label>
					<Input
						inputSize="sm"
						value={name}
						onChange={(e) => setName(e.target.value)}
						name="new-destination-name"
					/>
					{error?.name ? (
						<ErrorDescription>{error.name}</ErrorDescription>
					) : null}
				</Field>
				<div className="flex items-end space-x-2">
					<Field>
						<Input
							inputSize="sm"
							value={path}
							onChange={(e) => setPath(e.target.value)}
							name="new-destination-path"
						>
							<Button size="sm" variant="outline" onClick={onFolderSelect}>
								Browse
							</Button>
						</Input>
						{error?.path ? (
							<ErrorDescription>{error.path}</ErrorDescription>
						) : null}
					</Field>
				</div>
				<Button size="sm" variant="success" onClick={handleSave}>
					Save destination
				</Button>
			</div>
		</Section>
	)
}

export { AddDestination }
