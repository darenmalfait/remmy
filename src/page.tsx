import * as remote from '@electron/remote'
import { Button } from '@nerdfish/react/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@nerdfish/react/empty'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@nerdfish/react/sheet'
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

export function HomePage() {
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
						<SectionHeaderSubtitle className="mb-acquaintances">
							Destinations can be selected when archiving files
						</SectionHeaderSubtitle>
						<DestinationForm />
					</SectionHeader>
				) : (
					<>
						<div className="flex size-full flex-1 items-center justify-center">
							<div className="px-acquaintances py-friends rounded-container border-border items-center justify-center border border-dashed text-center">
								<Empty>
									<EmptyHeader>
										<EmptyMedia variant="icon">
											<FileUpIcon />
										</EmptyMedia>
										<EmptyTitle>Drag your file here</EmptyTitle>
										<EmptyDescription>
											To get started, add a file
										</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										<Button onClick={handleSelectFile}>Select a file</Button>
									</EmptyContent>
								</Empty>
							</div>
						</div>

						<Sheet open={!!selectedFile} onOpenChange={clearSelectedFile}>
							<SheetContent variant="inset" className="flex min-w-250 flex-col">
								<SheetHeader>
									<SheetTitle>Archive a file</SheetTitle>
									<SheetDescription>
										Fill in the form below to archive a file.
									</SheetDescription>
								</SheetHeader>
								<div className="px-friends pb-best-friends grow overflow-y-auto">
									<div className="gap-friends relative flex">
										{selectedFile ? (
											<>
												<div className="sticky top-0 h-[85vh] w-full max-w-150">
													<FilePreview file={selectedFile} />
												</div>
												<div className="mb-casual pb-friends relative w-full">
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
