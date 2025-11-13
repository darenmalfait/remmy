import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nerdfish/react/button'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@nerdfish/react/field'
import { Input } from '@nerdfish/react/input'
import { toast } from '@nerdfish/react/toast'
import { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { type z } from 'zod'
import { useFilenameFormat } from '../filename-format-provider'
import { defaultFilenameSettings } from '../settings'
import { filenameFormatSchema } from '../types'
import { FilenameFormatInput } from './filename-format-input'

const formSchema = filenameFormatSchema.pick({
	name: true,
	inTextSeparator: true,
	filenameConfiguration: true,
})

export type FilenameFormatFormData = z.infer<typeof formSchema>

interface FilenameFormatFormProps {
	onSubmit?: (values: FilenameFormatFormData) => void
}

export function FilenameFormatForm({ onSubmit }: FilenameFormatFormProps) {
	const { addFilenameFormat } = useFilenameFormat()

	const form = useForm<FilenameFormatFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			inTextSeparator: defaultFilenameSettings.inTextSeparator,
		},
	})

	const handleSubmit = useCallback(
		(values: FilenameFormatFormData) => {
			const result = addFilenameFormat(values)

			if (result.status === 'success') {
				onSubmit?.(values)
			} else if (result.status === 'error') {
				toast.error(result.error?.general ?? 'An unknown error occurred')
			}
		},
		[addFilenameFormat, onSubmit],
	)

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit(handleSubmit)}
			className="space-y-casual"
		>
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
					name="filenameConfiguration"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Config</FieldLabel>
							<FilenameFormatInput {...field} />
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="inTextSeparator"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Text separator</FieldLabel>
							<FieldDescription>
								Use this separator to separate within the same block of text
							</FieldDescription>
							<Input aria-invalid={fieldState.invalid} {...field} />
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
			</FieldGroup>

			<Button className="mt-casual" type="submit">
				Save format
			</Button>
		</form>
	)
}
