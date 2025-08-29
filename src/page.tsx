import * as remote from '@electron/remote'
import {
	Button,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@nerdfish/ui'
import { ipcRenderer } from 'electron'
import { FileUpIcon } from 'lucide-react'
import { Layout } from './components/layout'
import {
	Section,
	SectionHeader,
	SectionHeaderSubtitle,
	SectionHeaderTitle,
} from './components/section'
import { useDestinations } from './destinations/destinations-provider'
import { DestinationForm } from './destinations/forms/destination-form'
import { FilePreview } from './file/file-preview'
import { FileRenamer } from './file/file-renamer'
import { useFileUpload } from './file/file-upload-provider'

function HomePage() {
	const { selectedFile, onFileRenamed, clearSelectedFile } = useFileUpload()
	const { destinations } = useDestinations()

	const handleSelectFile = async () => {
		await remote.dialog
			.showOpenDialog({
				filters: [],
				properties: ['openFile'],
			})
			.then((result) => {
				if (result.canceled) return

				if (result.filePaths.length > 0) {
					// send file-drop event to main process
					ipcRenderer.send('dropped-file', result.filePaths)
				}
			})
			.catch((err: any) => {
				console.error(err)
			})

		remote.app.focus()
	}

	return (
		<Layout title="Archive a file" isRoot>
			<Section>
				{destinations.length === 0 ? (
					<SectionHeader>
						<SectionHeaderTitle>
							Start with adding a destination
						</SectionHeaderTitle>
						<SectionHeaderSubtitle className="mb-xl">
							Destinations can be selected when archiving files
						</SectionHeaderSubtitle>
						<DestinationForm />
					</SectionHeader>
				) : (
					<>
						<div className="flex w-full flex-1 flex-col items-center justify-center gap-md rounded-base text-center">
							<FileUpIcon className="size-8" />
							<p className="font-semibold text-foreground">
								Drag your file here
							</p>
							<Button size="sm" onClick={handleSelectFile}>
								Select a file
							</Button>
						</div>

						<Sheet open={!!selectedFile} onOpenChange={clearSelectedFile}>
							<SheetContent className="flex min-w-[1000px] flex-col">
								<SheetHeader>
									<SheetTitle>Archive a file</SheetTitle>
									<SheetDescription>
										Fill in the form below to archive a file.
									</SheetDescription>
								</SheetHeader>
								<div className="-mx-md flex-grow overflow-y-auto pb-sm pt-md">
									<div className="relative flex gap-md px-md">
										{selectedFile ? (
											<>
												<div className="sticky top-0 h-[85vh] w-full max-w-[600px]">
													<FilePreview file={selectedFile} />
												</div>
												<div className="relative mb-lg w-full pb-md">
													<FileRenamer
														file={selectedFile}
														onDone={onFileRenamed}
													/>
												</div>
											</>
										) : null}
									</div>
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
