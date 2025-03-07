/* eslint-disable @next/next/no-img-element */
import * as path from 'path'
import { Button, H1 } from '@nerdfish/ui'
import { XIcon } from 'lucide-react'
import * as React from 'react'

import { Layout } from '../components/layout'
import { AddDestination } from '../components/modules/add-destination'
import { FileModule } from '../components/modules/file-module'
import { Section } from '../components/section'
import { useDestinations } from '../context/destinations-provider'
import { useFileUpload } from '../context/file-upload-provider'

const img = path.join(__dirname, 'assets/images', 'drag-to-icon.gif')

function IndexRoute() {
	const { addingFile, onFileRenamed, clearAddingFile } = useFileUpload()
	const { destinations } = useDestinations()

	return (
		<Layout>
			<Section>
				{destinations.length === 0 ? (
					<>
						<H1>Start by adding a destination</H1>
						<AddDestination />
					</>
				) : (
					<>
						<div className="flex items-center justify-between">
							<H1 variant="primary">Archive a file</H1>
							{addingFile ? (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => {
										clearAddingFile()
									}}
								>
									<XIcon className="size-4" />
								</Button>
							) : null}
						</div>
						{addingFile ? (
							<FileModule file={addingFile} onDone={onFileRenamed} />
						) : (
							<>
								<p>You can add a file by dragging in into the taskbar icon</p>
								<img
									src={img}
									className="w-full rounded-base shadow-outline"
									alt="drag to icon"
								/>
							</>
						)}
					</>
				)}
			</Section>
		</Layout>
	)
}

export { IndexRoute }
