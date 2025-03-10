import {
	Alert,
	Badge,
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@nerdfish/ui'
import { Trash } from 'lucide-react'
import * as React from 'react'
import { Layout } from '../components/layout'
import { Section } from '../components/section'
import { useDestinations } from './destinations-provider'
import { DestinationForm } from './forms/destination-form'
import { type Destination } from './types'

function DestinationItem(destination: Destination) {
	const { removeDestination, setDefaultDestination } = useDestinations()

	function onDelete() {
		removeDestination(destination.id)
	}

	function setAsDefault() {
		setDefaultDestination(destination.id)
	}

	return (
		<li
			key={destination.id}
			className="flex max-w-full justify-between space-x-4 py-4"
		>
			<div className="flex max-w-[300px] flex-col">
				<p className="text-sm font-medium text-foreground">
					{destination.name}
				</p>
				<p className="max-w-full truncate text-sm text-foreground-secondary">
					{destination.path}
				</p>
			</div>
			<div className="flex items-center space-x-2">
				{destination.isDefault ? (
					<Badge variant="success" className="cursor-pointer">
						default
					</Badge>
				) : (
					<Button variant="secondary" size="sm" onClick={setAsDefault}>
						set default
					</Button>
				)}
				<Button variant="danger" size="iconSm" onClick={onDelete}>
					<Trash className="size-4" />
				</Button>
			</div>
		</li>
	)
}

function DestinationsPage() {
	const { destinations } = useDestinations()
	const [isAdding, setIsAdding] = React.useState<boolean>(false)

	return (
		<Layout title="Destinations">
			<Dialog open={isAdding} onOpenChange={(o) => setIsAdding(o)}>
				{destinations.length === 0 ? (
					<Section>
						<Alert
							variant="warning"
							description="No destinations have yet been added. You can add destinations by clicking the button below."
						/>
						<p>
							Destinations are the paths to where your documents get moved after
							renaming.
						</p>
						<DialogTrigger asChild>
							<Button>Add first destination</Button>
						</DialogTrigger>
					</Section>
				) : (
					<Section>
						<ul className="divide-y divide-muted">
							{destinations.map((destination) => (
								<DestinationItem key={destination.id} {...destination} />
							))}
						</ul>
						<DialogTrigger asChild>
							<Button>Add destination</Button>
						</DialogTrigger>
					</Section>
				)}
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add destination path</DialogTitle>
						<DialogDescription>
							Add a destination path to where your documents get moved after
							renaming.
						</DialogDescription>
					</DialogHeader>
					<DestinationForm
						onSubmit={() => {
							setIsAdding(false)
						}}
					/>
				</DialogContent>
			</Dialog>
		</Layout>
	)
}

export { DestinationsPage }
