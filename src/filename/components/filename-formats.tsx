import {
	Alert,
	Badge,
	Button,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	Sheet,
} from '@nerdfish/ui'
import { TrashIcon } from 'lucide-react'
import * as React from 'react'
import { Section } from '../../components/section'
import { useFilenameFormat } from '../filename-format-provider'
import { FilenameFormatForm } from '../forms/filename-format-form'
import { type FilenameFormat } from '../types'
import { rename } from '../utils'

function FilenameFormatItem(filenameFormat: FilenameFormat) {
	const { removeFilenameFormat, setDefaultFilenameFormat } = useFilenameFormat()

	function onDelete() {
		removeFilenameFormat(filenameFormat.id)
	}

	function setAsDefault() {
		setDefaultFilenameFormat(filenameFormat.id)
	}

	return (
		<li
			key={filenameFormat.id}
			className="flex max-w-full justify-between space-x-4 py-4"
		>
			<div className="flex max-w-[300px] flex-col gap-sm">
				<p className="text-sm font-medium text-foreground">
					{filenameFormat.name}
				</p>
				<p className="max-w-full truncate text-sm text-foreground-secondary">
					{rename({
						...filenameFormat,
						description: 'description',
						detail: 'detail',
						date: new Date(),
					})}
				</p>
			</div>
			<div className="flex items-center space-x-2">
				{filenameFormat.isDefault ? (
					<Badge variant="default" className="cursor-pointer">
						default
					</Badge>
				) : (
					<Button variant="secondary" size="sm" onClick={setAsDefault}>
						set default
					</Button>
				)}
				<Button
					variant="ghost"
					className="text-foreground-danger"
					size="sm"
					icon
					onClick={onDelete}
				>
					<TrashIcon />
				</Button>
			</div>
		</li>
	)
}

export function FilenameFormats() {
	const { filenameFormats } = useFilenameFormat()
	const [isAdding, setIsAdding] = React.useState<boolean>(false)

	return (
		<>
			{filenameFormats.length === 0 ? (
				<Section>
					<Alert
						variant="warning"
						title="No filename formats"
						description="No filename formats have yet been added. You can add filename formats by clicking the button below."
						className="mb-lg"
					/>
					<p>
						Filename formats are the pattern that will be used to rename your
						filenames
					</p>
					<Button className="mt-lg" onClick={() => setIsAdding(true)}>
						Add first format
					</Button>
				</Section>
			) : (
				<Section>
					<ul className="mb-lg divide-y divide-background-muted">
						{filenameFormats.map((filenameFormat) => (
							<FilenameFormatItem key={filenameFormat.id} {...filenameFormat} />
						))}
					</ul>

					<Button onClick={() => setIsAdding(true)}>Add format</Button>
				</Section>
			)}
			<Sheet open={isAdding} onOpenChange={(o) => setIsAdding(o)}>
				<SheetContent className="sm:max-w-[425px]">
					<SheetHeader className="mb-lg">
						<SheetTitle>Add format</SheetTitle>
						<SheetDescription>Add a format</SheetDescription>
					</SheetHeader>
					<FilenameFormatForm
						onSubmit={() => {
							setIsAdding(false)
						}}
					/>
				</SheetContent>
			</Sheet>
		</>
	)
}
