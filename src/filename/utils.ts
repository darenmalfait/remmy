import { saveLocal, loadLocal } from '../storage/utils'
import { padZero } from '../utils'
import { defaultFilenameSettings } from './settings'
import { type FilenameFormat } from './types'

export const STORAGE_KEY_FILENAME_FORMATS = 'remmy-filenameFormats'

export function loadFilenameFormats(): { filenameFormats?: FilenameFormat[] } {
	const { filenameFormats } = loadLocal(STORAGE_KEY_FILENAME_FORMATS) ?? {}

	return { filenameFormats }
}

export function saveFilenameFormats(filenameFormats: FilenameFormat[]): void {
	saveLocal(STORAGE_KEY_FILENAME_FORMATS, { filenameFormats })
}

export function transformName(
	str: string,
	separator = defaultFilenameSettings.inTextSeparator,
) {
	return str
		.replace(/[^a-zA-Z0-9]/g, separator)
		.replace(new RegExp(`${separator}{2,}`, 'g'), separator)
		.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '')
}

function formatDate(date?: Date, format?: string) {
	if (!date || !format) return ''
	let dateStr = ''
	const month = padZero(date.getMonth() + 1)
	const day = padZero(date.getDate())
	const year = date.getFullYear()

	switch (format.toLowerCase()) {
		case 'yyyy-mm-dd': {
			dateStr = `${year}-${month}-${day}`
			break
		}
		case 'yyyy_mm_dd': {
			dateStr = `${year}_${month}_${day}`
			break
		}
		case 'dd-mm-yyyy': {
			dateStr = `${day}-${month}-${year}`
			break
		}
		case 'dd_mm_yyyy': {
			dateStr = `${day}_${month}_${year}`
			break
		}
		case 'yyyy': {
			dateStr = `${year}`
			break
		}
		case 'yyyy_mm': {
			dateStr = `${year}_${month}`
			break
		}
		case 'yyyy-mm': {
			dateStr = `${year}-${month}`
			break
		}
		default: {
			dateStr = `${year}-${month}-${day}`
			break
		}
	}

	return dateStr
}

export interface RenameProps
	extends Omit<FilenameFormat, 'id' | 'name' | 'isDefault'> {
	extension?: string
	date?: Date
	description?: string
	detail?: string
}

export function rename({
	extension = 'pdf',
	date,
	description,
	detail,
	filenameConfiguration = [],
	inTextSeparator = defaultFilenameSettings.inTextSeparator,
}: RenameProps) {
	let fileName = ''

	filenameConfiguration.forEach((config) => {
		const { value, type } = config

		if (type === 'date') {
			if (!date) return
			fileName = `${fileName}${formatDate(date, value)}`
		} else if (type === 'description') {
			if (!description) return
			fileName = `${fileName}${transformName(
				description,
				inTextSeparator,
			).toLowerCase()}`
		} else if (type === 'detail') {
			if (!detail) return
			fileName = `${fileName}${transformName(
				detail,
				inTextSeparator,
			).toLowerCase()}`
		} else {
			fileName = `${fileName}${value}`
		}
	})

	const lastSeparator = filenameConfiguration
		.filter((c) => c.type === 'separator')
		.pop()

	if (lastSeparator && fileName.endsWith(lastSeparator.value)) {
		fileName = fileName.slice(0, -1)
	}

	return extension ? `${fileName}.${extension}` : fileName
}
