import fs from 'fs'
import * as React from 'react'
import * as uuid from 'uuid'

import { loadDestinations, saveDestinations } from '../lib/utils/storage'

export type Destination = {
	id: string
	name: string
	path: string
	isDefault?: boolean
}

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
	addDestination: (value: Omit<Destination, 'id'>) => DestinationActionResult
	updateDestination: (props: Destination) => DestinationActionResult
	removeDestination: (id: string) => DestinationActionResult
	setDefaultDestination: (id: string) => DestinationActionResult
}

const DestinationsContext =
	React.createContext<DestinationsContextProps | null>(null)
DestinationsContext.displayName = 'DestinationsContext'

interface DestinationsProviderProps {
	children: React.ReactNode
}

// import { DestinationsProvider } from "path-to-context/DestinationsContext"
// use <DestinationsProvider> as a wrapper around the part you need the context for
function DestinationsProvider({ children }: DestinationsProviderProps) {
	const [destinations, setDestinations] =
		React.useState<Destination[]>(defaultDestinations)

	React.useEffect(() => {
		function restoreDestinations() {
			const existing = loadDestinations()

			if (existing.destinations) {
				setDestinations([...defaultDestinations, ...existing.destinations])
			}
		}

		restoreDestinations()
	}, [])

	const updateDestination = React.useCallback(
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
			saveDestinations(newDestinations)

			return {
				status: 'success',
			}
		},
		[destinations],
	)

	const removeDestination = React.useCallback(
		(id: string) => {
			const newDestinations = destinations.filter(
				(destination) => destination.id !== id,
			)
			setDestinations(newDestinations)
			saveDestinations(newDestinations)

			return {
				status: 'success',
			}
		},
		[destinations],
	)

	const setDefaultDestination = React.useCallback(
		(defaultId: string) => {
			const newDestinations = destinations.map((destination) => ({
				...destination,
				isDefault: destination.id === defaultId,
			}))
			setDestinations(newDestinations)
			saveDestinations(newDestinations)

			return {
				status: 'success',
			}
		},
		[destinations],
	)

	const addDestination = React.useCallback(
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

			const newDestinations = [
				...destinations,
				{
					id,
					isDefault: destinations.length === 0,
					...values,
				},
			]
			setDestinations(newDestinations)
			saveDestinations(newDestinations)

			return {
				status: 'success',
			}
		},
		[destinations],
	)

	return (
		<DestinationsContext.Provider
			value={{
				destinations,
				updateDestination,
				removeDestination,
				addDestination,
				setDefaultDestination,
			}}
		>
			{children}
		</DestinationsContext.Provider>
	)
}

// import { useDestinations } fron "path-to-context/DestinationsContext"
// within functional component
// const { sessionToken, ...DestinationsContext } = useDestinations()
function useDestinations(): DestinationsContextProps {
	const context = React.useContext(DestinationsContext)

	if (!context) {
		throw new Error(
			'You should use useDestinations within an DestinationsContext',
		)
	}

	return context
}

export { DestinationsProvider, useDestinations }
