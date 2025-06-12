import {
	Alert,
	Badge,
	Button,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	Sheet,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
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
				<p className="text-foreground text-sm font-medium">
					{destination.name}
				</p>
				<Tooltip>
					<TooltipTrigger>
						<p className="text-foreground-secondary max-w-full truncate text-sm">
							{destination.path}
						</p>
					</TooltipTrigger>
					<TooltipContent>
						<p>{destination.path}</p>
					</TooltipContent>
				</Tooltip>
			</div>
			<div className="flex items-center space-x-2">
				{destination.isDefault ? (
					<Badge variant="success" className="cursor-pointer">
						default
					</Badge>
				) : (
					<Button variant="secondary" size="xs" onClick={setAsDefault}>
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
					<Button onClick={() => setIsAdding(true)}>
						Add first destination
					</Button>
				</Section>
			) : (
				<Section>
					<ul className="divide-muted divide-y">
						{destinations.map((destination) => (
							<DestinationItem key={destination.id} {...destination} />
						))}
					</ul>

					<Button onClick={() => setIsAdding(true)}>Add destination</Button>
				</Section>
			)}
			<Sheet open={isAdding} onOpenChange={(o) => setIsAdding(o)}>
				<SheetContent className="sm:max-w-[425px]">
					<SheetHeader>
						<SheetTitle>Add destination path</SheetTitle>
						<SheetDescription>
							Add a destination path to where your documents get moved after
							renaming.
						</SheetDescription>
					</SheetHeader>
					<DestinationForm
						onSubmit={() => {
							setIsAdding(false)
						}}
					/>
				</SheetContent>
			</Sheet>
		</Layout>
	)
}

export { DestinationsPage }
