import * as path from 'path'
import {
	H1,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@nerdfish/ui'
import { Layout } from './components/layout'
import { Section } from './components/section'
import { useDestinations } from './destinations/destinations-provider'
import { DestinationForm } from './destinations/forms/destination-form'
import { FileModule } from './file-rename/file-module'
import { useFileUpload } from './file-rename/file-upload-provider'

const img = path.join(__dirname, 'assets/images', 'drag-to-icon.gif')

function HomePage() {
	const { addingFile, onFileRenamed, clearAddingFile } = useFileUpload()
	const { destinations } = useDestinations()

	return (
		<Layout>
			<Section>
				{destinations.length === 0 ? (
					<>
						<H1>Start by adding a destination</H1>
						<DestinationForm />
					</>
				) : (
					<>
						<div className="flex items-center justify-between">
							<H1 variant="primary">Archive a file</H1>
						</div>

						<p>You can add a file by dragging in into the taskbar icon</p>
						<img
							src={img}
							className="rounded-base shadow-outline w-full"
							alt="drag to icon"
						/>

						<Sheet open={!!addingFile} onOpenChange={clearAddingFile}>
							<SheetContent className="min-w-[500px] overflow-y-scroll">
								<SheetHeader className="mb-lg">
									<SheetTitle>Archive a file</SheetTitle>
									<SheetDescription>
										Fill in the form below to archive a file.
									</SheetDescription>
								</SheetHeader>
								{addingFile ? (
									<FileModule file={addingFile} onDone={onFileRenamed} />
								) : null}
							</SheetContent>
						</Sheet>
					</>
				)}
			</Section>
		</Layout>
	)
}

export { HomePage }
