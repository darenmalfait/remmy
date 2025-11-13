import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'
import * as uuid from 'uuid'
import { type FilenameFormat } from './types'
import { loadFilenameFormats, saveFilenameFormats } from './utils'

export type FilenameActionResult = {
	status: 'success' | 'error' | string
	error?: {
		[key in keyof FilenameFormat]?: string
	} & {
		general?: string
	}
}

export const defaultFilenameFormats: FilenameFormat[] = []

interface FilenameFormatContextProps {
	filenameFormats: FilenameFormat[]
	addFilenameFormat: (value: Omit<FilenameFormat, 'id'>) => FilenameActionResult
	updateFilenameFormat: (props: FilenameFormat) => FilenameActionResult
	removeFilenameFormat: (id: string) => FilenameActionResult
	setDefaultFilenameFormat: (id: string) => FilenameActionResult
}

const FilenameFormatContext = createContext<FilenameFormatContextProps | null>(
	null,
)
FilenameFormatContext.displayName = 'FilenameFormatContext'

interface FilenameFormatProviderProps {
	children: ReactNode
}

// import { FilenameFormatProvider } from "config-to-context/FilenameFormatContext"
// use <FilenameFormatProvider> as a wrapper around the part you need the context for
function FilenameFormatProvider({ children }: FilenameFormatProviderProps) {
	const [filenameFormats, setFilenameFormats] = useState<FilenameFormat[]>(
		defaultFilenameFormats,
	)

	useEffect(() => {
		function restoreFilenameFormat() {
			const existing = loadFilenameFormats()

			if (existing.filenameFormats) {
				setFilenameFormats([
					...defaultFilenameFormats,
					...existing.filenameFormats,
				])
			}
		}

		restoreFilenameFormat()
	}, [])

	const updateFilenameFormat = useCallback(
		(updatedFilename: FilenameFormat) => {
			let error = {}

			const { id } = updatedFilename
			if (!filenameFormats.find((format) => format.id === id)) {
				error = {
					...error,
					filenameFormats: 'Filename format not found',
				}
			}

			if (
				filenameFormats.find(
					(format) => format.name === updatedFilename.name && format.id !== id,
				)
			) {
				error = {
					...error,
					filenameFormats: 'Filename format already exists',
				}
			}

			if (!updatedFilename.name) {
				error = {
					...error,
					name: 'Name is required',
				}
			}

			if (Object.keys(error).length > 0) {
				return {
					status: 'error',
					error,
				}
			}

			const newFilenameFormat = [
				...filenameFormats.filter((d) => d.id !== id),
				updatedFilename,
			]

			setFilenameFormats(newFilenameFormat)
			saveFilenameFormats(newFilenameFormat)

			return {
				status: 'success',
			}
		},
		[filenameFormats],
	)

	const removeFilenameFormat = useCallback(
		(id: string) => {
			const newFilenameFormat = filenameFormats.filter(
				(format) => format.id !== id,
			)
			setFilenameFormats(newFilenameFormat)
			saveFilenameFormats(newFilenameFormat)

			return {
				status: 'success',
			}
		},
		[filenameFormats],
	)

	const setDefaultFilenameFormat = useCallback(
		(defaultId: string) => {
			const newFilenameFormat = filenameFormats.map((format) => ({
				...format,
				isDefault: format.id === defaultId,
			}))
			setFilenameFormats(newFilenameFormat)
			saveFilenameFormats(newFilenameFormat)

			return {
				status: 'success',
			}
		},
		[filenameFormats],
	)

	const addFilenameFormat = useCallback(
		(values: Omit<FilenameFormat, 'id'>) => {
			let error = {}
			if (filenameFormats.find((format) => format.name === values.name)) {
				error = {
					...error,
					name: 'Filename already exists',
				}
			}

			if (!values.name) {
				error = {
					...error,
					name: 'Name is required',
				}
			}

			if (Object.keys(error).length > 0) {
				return {
					status: 'error',
					error,
				}
			}

			const id = uuid.v4()

			const newFilenameFormat = [
				...filenameFormats,
				{
					id,
					isDefault: filenameFormats.length === 0,
					...values,
				},
			]
			setFilenameFormats(newFilenameFormat)
			saveFilenameFormats(newFilenameFormat)

			return {
				status: 'success',
			}
		},
		[filenameFormats],
	)

	return (
		<FilenameFormatContext
			value={useMemo(
				() => ({
					filenameFormats,
					updateFilenameFormat,
					removeFilenameFormat,
					addFilenameFormat,
					setDefaultFilenameFormat,
				}),
				[
					filenameFormats,
					updateFilenameFormat,
					removeFilenameFormat,
					addFilenameFormat,
					setDefaultFilenameFormat,
				],
			)}
		>
			{children}
		</FilenameFormatContext>
	)
}

// import { useFilenameFormat } fron "config-to-context/FilenameFormatContext"
// within functional component
// const { sessionToken, ...FilenameFormatContext } = useFilenameFormat()
function useFilenameFormat(): FilenameFormatContextProps {
	const context = useContext(FilenameFormatContext)

	if (!context) {
		throw new Error(
			'You should use useFilenameFormat within an FilenameFormatContext',
		)
	}

	return context
}

export { FilenameFormatProvider, useFilenameFormat }
