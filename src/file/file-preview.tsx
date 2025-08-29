import * as React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString()

export function FilePreview({ file }: { file?: string }) {
	const [numPages, setNumPages] = React.useState<number>()

	function onDocumentLoadSuccess({
		numPages: _numPages,
	}: {
		numPages: number
	}): void {
		setNumPages(_numPages)
	}

	if (!file) return null

	return (
		<div className="flex h-full w-full flex-col overflow-y-scroll rounded-base">
			<Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
				{Array.from(new Array(numPages), (_el, index) => (
					<Page key={`page_${index + 1}`} pageNumber={index + 1} />
				))}
			</Document>
		</div>
	)
}
