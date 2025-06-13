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
import { FilePreview } from './file-rename/file-preview'
import { FileRenamer } from './file-rename/file-renamer'
import { useFileUpload } from './file-rename/file-upload-provider'

function HomePage() {
	const { selectedFile, onFileRenamed, clearSelectedFile } = useFileUpload()
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

						<p className="pb-lg">
							You can add a file by dragging in into the taskbar icon
						</p>

						<div className="flex h-[75vh] w-full items-center justify-center rounded-base border-2 border-dashed border-foreground-muted bg-background">
							<p className="text-foreground">Drop your file here</p>
						</div>

						<Sheet open={!!selectedFile} onOpenChange={clearSelectedFile}>
							<SheetContent className="min-w-[1000px] overflow-y-scroll">
								<SheetHeader className="mb-lg">
									<SheetTitle>Archive a file</SheetTitle>
									<SheetDescription>
										Fill in the form below to archive a file.
									</SheetDescription>
								</SheetHeader>
								<div className="flex gap-lg">
									{selectedFile ? (
										<>
											<div className="w-full max-w-[600px]">
												<FilePreview file={selectedFile} />
											</div>
											<div className="w-full">
												<FileRenamer
													file={selectedFile}
													onDone={onFileRenamed}
												/>
											</div>
										</>
									) : null}
								</div>
							</SheetContent>
						</Sheet>
					</>
				)}
			</Section>
		</Layout>
	)
}

export { HomePage }
