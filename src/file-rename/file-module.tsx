import { H2 } from '@nerdfish/ui'
import { extractDateFromText } from 'extract-date-js'
import * as React from 'react'
import { Section } from '../components/section'
import { useFileUpload } from '../context/file-upload-provider'
import { getVATNumberFromText, ocr } from '../ocr/utils/ocr'
import { useSettings } from '../settings/settings-provider'
import { checkVat } from '../vat/utils/vat'
import { FileRenameForm } from './forms/file-rename-form'
import { transformName } from './utils'

function FileModule({ file, onDone }: { file: string; onDone: () => void }) {
	const [loadingStatus, setLoadingStatus] = React.useState<
		'loading' | 'loaded' | 'error'
	>('loading')
	const { clearAddingFile } = useFileUpload()
	const { settings } = useSettings()
	const [date, setDate] = React.useState<Date | undefined>()
	const [description, setDescription] = React.useState<string | undefined>()

	React.useEffect(() => {
		async function handleFile() {
			if (!settings.ocrEnabled) return

			try {
				const text = await ocr(file)

				if (!text) {
					setLoadingStatus('loaded')
					return
				}

				const documentDate = extractDateFromText(text)
				setDate(new Date(documentDate ?? Date.now()))

				if (settings.vatLookupEnabled) {
					const vat = getVATNumberFromText(text, [settings.ownVatNumber])

					if (vat) {
						const vatData = await checkVat(vat)

						if (!vatData?.name) {
							console.info('vat not found')
							setLoadingStatus('loaded')
							return
						}
						setDescription(transformName(vatData.name))
					}
				}

				setLoadingStatus('loaded')
			} catch (error) {
				console.error(error)
				setLoadingStatus('loaded')
			}
		}

		handleFile().catch((e: any) => {
			clearAddingFile()
			console.error(e.message)
		})
	}, [
		clearAddingFile,
		file,
		settings.ocrEnabled,
		settings.ownVatNumber,
		settings.vatLookupEnabled,
	])

	return (
		<>
			{loadingStatus === 'loading' ? (
				<div className="fixed inset-0 z-50 !mt-0 flex flex-col items-center justify-center space-y-6 bg-muted text-white">
					<H2>Analysing your file</H2>
					<div className="border-daren h-32 w-32 animate-spin rounded-full border-y-2" />
				</div>
			) : null}
			{loadingStatus === 'loaded' ? (
				<Section>
					<FileRenameForm
						file={file}
						initialValues={{
							date: date ?? new Date(),
							description: description ?? '',
						}}
						onSubmit={onDone}
					/>
				</Section>
			) : null}
			{loadingStatus === 'error' ? (
				<div className="flex items-center justify-center">error</div>
			) : null}
		</>
	)
}

export { FileModule }
