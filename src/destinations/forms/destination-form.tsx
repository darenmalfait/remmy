import * as remote from '@electron/remote'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nerdfish/react/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@nerdfish/react/field'
import { Input } from '@nerdfish/react/input'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@nerdfish/react/input-group'
import { toast } from '@nerdfish/react/toast'
import { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
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

	const handleSubmit = useCallback(
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

	const onFolderSelect = useCallback(async () => {
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
		<form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
			<FieldGroup>
				<Controller
					control={form.control}
					name="name"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Name</FieldLabel>
							<Input aria-invalid={fieldState.invalid} {...field} />
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="path"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Path</FieldLabel>
							<InputGroup>
								<InputGroupInput
									aria-invalid={fieldState.invalid}
									className="rounded-r-none"
									{...field}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton size="xs" onClick={onFolderSelect}>
										Browse
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>

							{field.value ? (
								<div className="gap-best-friends pt-bff flex items-center justify-between">
									<span className="text-foreground-muted line-clamp-1 text-xs">
										{field.value}
									</span>
									<Button
										variant="link"
										value=""
										className="text-foreground-danger p-0"
										onClick={field.onChange}
									>
										Remove
									</Button>
								</div>
							) : null}
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
			</FieldGroup>

			<Button className="mt-casual" type="submit">
				Save destination
			</Button>
		</form>
	)
}
