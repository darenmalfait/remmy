import { Alert, AlertDescription, AlertTitle } from '@nerdfish/react/alert'
import { Badge } from '@nerdfish/react/badge'
import { Button } from '@nerdfish/react/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@nerdfish/react/card'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@nerdfish/react/sheet'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@nerdfish/react/tooltip'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
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
			className="space-x-friends py-friends group/destination-item flex max-w-full justify-between"
		>
			<div className="flex grow flex-col">
				<p className="typography-body-small line-clamp-1">{destination.name}</p>
				<Tooltip>
					<TooltipTrigger className="cursor-default">
						<p className="text-foreground-muted line-clamp-1 max-w-full text-left text-sm">
							{destination.path}
						</p>
					</TooltipTrigger>
					<TooltipContent>
						<p>{destination.path}</p>
					</TooltipContent>
				</Tooltip>
			</div>
			<div className="space-x-best-friends flex items-center">
				{destination.isDefault ? (
					<Badge
						variant="success"
						appearance="muted"
						className="cursor-pointer"
					>
						default
					</Badge>
				) : (
					<Button variant="ghost" size="xs" onClick={setAsDefault}>
						set default
					</Button>
				)}
				<Button variant="destructive" size="xs" icon onClick={onDelete}>
					<TrashIcon />
				</Button>
			</div>
		</li>
	)
}

export function DestinationsPage() {
	const { destinations } = useDestinations()
	const [isAdding, setIsAdding] = useState<boolean>(false)

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
								<Alert variant="warning" className="mb-casual">
									<AlertTitle>No destinations</AlertTitle>
									<AlertDescription>
										No destinations have yet been added. You can add
										destinations by clicking the button below.
									</AlertDescription>
								</Alert>
								<p className="typography-body">
									Destinations are the paths to where your documents get moved
									after renaming.
								</p>
								<Button className="mt-casual" onClick={() => setIsAdding(true)}>
									Add first destination
								</Button>
							</>
						) : (
							<>
								<ul className="mb-casual divide-border divide-y">
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
				<SheetContent variant="inset" className="sm:max-w-106.25">
					<SheetHeader className="mb-casual">
						<SheetTitle>Add destination path</SheetTitle>
						<SheetDescription>
							Add a destination path to where your documents get moved after
							renaming.
						</SheetDescription>
					</SheetHeader>
					<div className="px-friends">
						<DestinationForm
							onSubmit={() => {
								setIsAdding(false)
							}}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</Layout>
	)
}
