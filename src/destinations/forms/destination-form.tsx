import * as remote from '@electron/remote'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Button,
	ButtonGroup,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	toast,
} from '@nerdfish/ui'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDestinations } from '../destinations-provider'

const destinationFormSchema = z.object({
	name: z.string().min(1),
	path: z.string().min(1),
})

export type DestinationFormData = z.infer<typeof destinationFormSchema>

interface DestinationFormProps {
	onSubmit?: (values: DestinationFormData) => void
}

export function DestinationForm({ onSubmit }: DestinationFormProps) {
	const { addDestination } = useDestinations()

	const form = useForm<DestinationFormData>({
		resolver: zodResolver(destinationFormSchema),
		defaultValues: {},
	})

	const handleSubmit = React.useCallback(
		(values: DestinationFormData) => {
			const result = addDestination(values)

			if (result.status === 'success') {
				onSubmit?.(values)
			} else if (result.status === 'error') {
				toast.error(result.error?.general ?? 'An unknown error occurred')
			}
		},
		[addDestination, onSubmit],
	)

	const onFolderSelect = React.useCallback(async () => {
		remote.app.focus()

		await remote.dialog
			.showOpenDialog({
				filters: [],
				properties: ['openDirectory'],
			})
			.then((result) => {
				if (result.canceled) return

				if (result.filePaths.length > 0) {
					form.setValue('path', result.filePaths[0] ?? '')
					// validate field
					return form.trigger('path')
				}
			})
			.catch((err: any) => {
				console.error(err)
			})

		remote.app.focus()
	}, [form])

	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-lg"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="path"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Path</FormLabel>
							<ButtonGroup>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<Button onClick={onFolderSelect}>Browse</Button>
							</ButtonGroup>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Save destination</Button>
			</form>
		</Form>
	)
}
