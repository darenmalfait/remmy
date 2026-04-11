import fs from 'fs'
import {
	createContext,
	useCallback,
	useEffect,
	useContext,
	useState,
	type ReactNode,
	useMemo,
} from 'react'
import * as uuid from 'uuid'
import { type Destination } from './types'
import { loadDestinations, saveDestinations } from './utils'

export type DestinationActionResult = {
	status: 'success' | 'error' | string
	error?: {
		[key in keyof Destination]?: string
	} & {
		general?: string
	}
}

export const defaultDestinations: Destination[] = []

interface DestinationsContextProps {
	destinations: Destination[]
	sameFolderAsDefault: boolean
	addDestination: (value: Omit<Destination, 'id'>) => DestinationActionResult
	updateDestination: (props: Destination) => DestinationActionResult
	removeDestination: (id: string) => DestinationActionResult
	setDefaultDestination: (id: string) => DestinationActionResult
	setSameFolderAsDefault: () => DestinationActionResult
}

const DestinationsContext = createContext<DestinationsContextProps | null>(null)
DestinationsContext.displayName = 'DestinationsContext'

interface DestinationsProviderProps {
	children: ReactNode
}

// import { DestinationsProvider } from "path-to-context/DestinationsContext"
// use <DestinationsProvider> as a wrapper around the part you need the context for
function DestinationsProvider({ children }: DestinationsProviderProps) {
	const [destinations, setDestinations] =
		useState<Destination[]>(defaultDestinations)
	const [sameFolderAsDefault, setSameFolderAsDefault] = useState(false)

	useEffect(() => {
		function restoreDestinations() {
			const existing = loadDestinations()

			if (existing.destinations) {
				let restored = [...defaultDestinations, ...existing.destinations]
				const useSameFolder =
					!!existing.sameFolderAsDefault && restored.length > 0
				if (useSameFolder) {
					restored = restored.map((d) => ({ ...d, isDefault: false }))
				}
				setDestinations(restored)
				setSameFolderAsDefault(useSameFolder)
			}
		}

		restoreDestinations()
	}, [])

	const updateDestination = useCallback(
		(updatedDestination: Destination) => {
			let error = {}

			const { id } = updatedDestination
			if (!destinations.find((destination) => destination.id === id)) {
				error = {
					...error,
					path: 'Destination not found',
				}
			}

			if (
				destinations.find(
					(destination) =>
						destination.name === updatedDestination.name &&
						destination.id !== id,
				)
			) {
				error = {
					...error,
					path: 'Destination already exists',
				}
			}

			if (!updatedDestination.name) {
				error = {
					...error,
					name: 'Name is required',
				}
			}

			if (!updatedDestination.path) {
				error = {
					...error,
					path: 'Path is required',
				}
			}

			if (Object.keys(error).length > 0) {
				return {
					status: 'error',
					error,
				}
			}

			const newDestinations = [
				...destinations.filter((d) => d.id !== id),
				updatedDestination,
			]

			setDestinations(newDestinations)
			saveDestinations(newDestinations, sameFolderAsDefault)

			return {
				status: 'success',
			}
		},
		[destinations, sameFolderAsDefault],
	)

	const removeDestination = useCallback(
		(id: string) => {
			const newDestinations = destinations.filter(
				(destination) => destination.id !== id,
			)
			const nextSameFolder = sameFolderAsDefault && newDestinations.length > 0
			setDestinations(newDestinations)
			setSameFolderAsDefault(nextSameFolder)
			saveDestinations(newDestinations, nextSameFolder)

			return {
				status: 'success',
			}
		},
		[destinations, sameFolderAsDefault],
	)

	const setDefaultDestination = useCallback(
		(defaultId: string) => {
			const newDestinations = destinations.map((destination) => ({
				...destination,
				isDefault: destination.id === defaultId,
			}))
			setDestinations(newDestinations)
			setSameFolderAsDefault(false)
			saveDestinations(newDestinations, false)

			return {
				status: 'success',
			}
		},
		[destinations],
	)

	const setSameFolderAsDefaultChoice = useCallback(() => {
		const newDestinations = destinations.map((destination) => ({
			...destination,
			isDefault: false,
		}))
		setDestinations(newDestinations)
		setSameFolderAsDefault(true)
		saveDestinations(newDestinations, true)

		return {
			status: 'success',
		}
	}, [destinations])

	const addDestination = useCallback(
		(values: Omit<Destination, 'id'>) => {
			let error = {}
			if (
				destinations.find((destination) => destination.name === values.name)
			) {
				error = {
					...error,
					name: 'Destination already exists',
				}
			}

			if (!values.name) {
				error = {
					...error,
					name: 'Name is required',
				}
			}

			if (!values.path) {
				error = {
					...error,
					path: 'Path is required',
				}
			}

			// check if path is a valid directory
			if (!fs.existsSync(values.path)) {
				error = {
					...error,
					path: 'Path is not a valid directory',
				}
			}

			if (Object.keys(error).length > 0) {
				return {
					status: 'error',
					error,
				}
			}

			const id = uuid.v4()

			const isFirst = destinations.length === 0
			const newDestinations = [
				...destinations,
				{
					id,
					isDefault: isFirst,
					...values,
				},
			]
			const nextSameFolder = isFirst ? false : sameFolderAsDefault
			setDestinations(newDestinations)
			setSameFolderAsDefault(nextSameFolder)
			saveDestinations(newDestinations, nextSameFolder)

			return {
				status: 'success',
			}
		},
		[destinations, sameFolderAsDefault],
	)

	return (
		<DestinationsContext
			value={useMemo(
				() => ({
					destinations,
					sameFolderAsDefault,
					updateDestination,
					removeDestination,
					addDestination,
					setDefaultDestination,
					setSameFolderAsDefault: setSameFolderAsDefaultChoice,
				}),
				[
					destinations,
					sameFolderAsDefault,
					updateDestination,
					removeDestination,
					addDestination,
					setDefaultDestination,
					setSameFolderAsDefaultChoice,
				],
			)}
		>
			{children}
		</DestinationsContext>
	)
}

// import { useDestinations } fron "path-to-context/DestinationsContext"
// within functional component
// const { sessionToken, ...DestinationsContext } = useDestinations()
function useDestinations(): DestinationsContextProps {
	const context = useContext(DestinationsContext)

	if (!context) {
		throw new Error(
			'You should use useDestinations within an DestinationsContext',
		)
	}

	return context
}

export { DestinationsProvider, useDestinations }
