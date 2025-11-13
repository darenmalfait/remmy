import { Alert, AlertDescription, AlertTitle } from '@nerdfish/react/alert'
import { Badge } from '@nerdfish/react/badge'
import { Button } from '@nerdfish/react/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@nerdfish/react/sheet'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
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
			className="space-x-friends py-friends flex max-w-full justify-between"
		>
			<div className="gap-sm flex max-w-75 flex-col">
				<p className="text-foreground text-sm font-medium">
					{filenameFormat.name}
				</p>
				<p className="text-foreground-muted max-w-full truncate text-sm">
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
					<Badge
						variant="success"
						appearance="muted"
						className="cursor-pointer"
					>
						default
					</Badge>
				) : (
					<Button variant="ghost" size="xs" onClick={setAsDefault}>
						set default
					</Button>
				)}
				<Button variant="destructive" size="xs" icon onClick={onDelete}>
					<TrashIcon />
				</Button>
			</div>
		</li>
	)
}

export function FilenameFormats() {
	const { filenameFormats } = useFilenameFormat()
	const [isAdding, setIsAdding] = useState<boolean>(false)

	return (
		<>
			{filenameFormats.length === 0 ? (
				<>
					<Alert variant="warning" className="mb-casual">
						<AlertTitle>No filename formats</AlertTitle>
						<AlertDescription>
							No filename formats have yet been added. You can add filename
							formats by clicking the button below.
						</AlertDescription>
					</Alert>
					<p>
						Filename formats are the pattern that will be used to rename your
						filenames
					</p>
					<Button className="mt-casual" onClick={() => setIsAdding(true)}>
						Add first format
					</Button>
				</>
			) : (
				<>
					<ul className="mb-casual divide-border divide-y">
						{filenameFormats.map((filenameFormat) => (
							<FilenameFormatItem key={filenameFormat.id} {...filenameFormat} />
						))}
					</ul>

					<Button onClick={() => setIsAdding(true)}>Add format</Button>
				</>
			)}
			<Sheet open={isAdding} onOpenChange={(o) => setIsAdding(o)}>
				<SheetContent variant="inset" className="sm:max-w-106.25">
					<SheetHeader className="mb-casual">
						<SheetTitle>Add format</SheetTitle>
						<SheetDescription>Add a format</SheetDescription>
					</SheetHeader>
					<div className="px-friends">
						<FilenameFormatForm
							onSubmit={() => {
								setIsAdding(false)
							}}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</>
	)
}
