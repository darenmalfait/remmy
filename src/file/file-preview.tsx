import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString()

export function FilePreview({ file }: { file?: string }) {
	const [numPages, setNumPages] = useState<number>()

	if (!file) return null

	if (file.endsWith('.pdf')) {
		return (
			<div className="rounded-base flex h-full w-full flex-col overflow-y-scroll">
				<Document
					file={file}
					onLoadSuccess={({ numPages: _numPages }) => setNumPages(_numPages)}
				>
					{Array.from(new Array(numPages), (_el, index) => (
						<Page key={`page_${index + 1}`} pageNumber={index + 1} />
					))}
				</Document>
			</div>
		)
	}

	if (
		file.toLowerCase().endsWith('.jpg') ||
		file.toLowerCase().endsWith('.jpeg') ||
		file.toLowerCase().endsWith('.png') ||
		file.toLowerCase().endsWith('.gif') ||
		file.toLowerCase().endsWith('.bmp') ||
		file.toLowerCase().endsWith('.tiff') ||
		file.toLowerCase().endsWith('.ico') ||
		file.toLowerCase().endsWith('.webp')
	) {
		return (
			<div className="rounded-base flex h-full w-full flex-col overflow-y-scroll">
				<img src={file} alt="File" />
			</div>
		)
	}

	return <div>Unsupported file type</div>
}
