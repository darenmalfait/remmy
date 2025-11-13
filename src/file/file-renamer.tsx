import { Skeleton } from '@nerdfish/react/skeleton'
import { Spinner } from '@nerdfish/react/spinner'
import { extractDateFromText } from 'extract-date-js'
import { useEffect, useState } from 'react'
import { Section } from '../components/section'
import { transformName } from '../filename/utils'
import { getVATNumberFromText, ocr } from '../ocr/utils/ocr'
import { useSettings } from '../settings/settings-provider'
import { checkVat } from '../vat/utils/vat'
import { useFileUpload } from './file-upload-provider'
import { FileRenameForm } from './forms/file-rename-form'

export function FileRenamer({
	file,
	onDone,
}: {
	file: string
	onDone: () => void
}) {
	const [loadingStatus, setLoadingStatus] = useState<
		'loading' | 'loaded' | 'error'
	>('loading')
	const { clearSelectedFile } = useFileUpload()
	const { settings } = useSettings()
	const [date, setDate] = useState<Date | undefined>()
	const [description, setDescription] = useState<string | undefined>()

	useEffect(() => {
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

						const d = transformName(vatData.name)
						setDescription(d.length ? transformName(vatData.name) : undefined)
					}
				}

				setLoadingStatus('loaded')
			} catch (error) {
				console.error(error)
				setLoadingStatus('loaded')
			}
		}

		handleFile().catch((e: any) => {
			clearSelectedFile()
			console.error(e.message)
		})
	}, [
		clearSelectedFile,
		file,
		settings.ocrEnabled,
		settings.ownVatNumber,
		settings.vatLookupEnabled,
	])

	return (
		<>
			{loadingStatus === 'loading' ? (
				<div className="space-y-casual absolute inset-0 z-50 mt-0! flex flex-col items-center justify-center text-center">
					<Skeleton className="absolute inset-0 -z-1 size-full" />
					<h2 className="typography-heading-sm">Analysing your file</h2>
					<Spinner className="size-12" />
				</div>
			) : null}
			{loadingStatus === 'loaded' ? (
				<Section>
					<FileRenameForm
						file={file}
						initialValues={{
							date: date ?? new Date(),
							description,
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
