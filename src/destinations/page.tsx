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
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@nerdfish/ui'
import { TrashIcon } from 'lucide-react'
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
				<Tooltip>
					<TooltipTrigger>
						<p className="max-w-full truncate text-sm text-foreground-secondary">
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
					<Badge variant="default" className="cursor-pointer">
						default
					</Badge>
				) : (
					<Button variant="secondary" size="sm" onClick={setAsDefault}>
						set default
					</Button>
				)}
				<Button
					variant="ghost"
					className="text-foreground-danger"
					size="sm"
					icon
					onClick={onDelete}
				>
					<TrashIcon />
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
			<Section>
				<Card>
					<CardHeader>
						<CardTitle>Configured destinations</CardTitle>
						<CardDescription>
							These destinations can be picked to move your document after
							renaming
						</CardDescription>
					</CardHeader>
					<CardContent>
						{destinations.length === 0 ? (
							<>
								<Alert
									variant="warning"
									title="No destinations"
									description="No destinations have yet been added. You can add destinations by clicking the button below."
									className="mb-lg"
								/>
								<p>
									Destinations are the paths to where your documents get moved
									after renaming.
								</p>
								<Button className="mt-lg" onClick={() => setIsAdding(true)}>
									Add first destination
								</Button>
							</>
						) : (
							<>
								<ul className="mb-lg divide-y divide-foreground-muted">
									{destinations.map((destination) => (
										<DestinationItem key={destination.id} {...destination} />
									))}
								</ul>

								<Button onClick={() => setIsAdding(true)}>
									Add destination
								</Button>
							</>
						)}
					</CardContent>
				</Card>
			</Section>

			<Sheet open={isAdding} onOpenChange={(o) => setIsAdding(o)}>
				<SheetContent className="sm:max-w-[425px]">
					<SheetHeader className="mb-lg">
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
