import { zodResolver } from '@hookform/resolvers/zod'
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	toast,
} from '@nerdfish/ui'
import * as React from 'react'
import { useForm } from 'react-hook-form'
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

	const handleSubmit = React.useCallback(
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
					name="filenameConfiguration"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Config</FormLabel>
							<FilenameFormatInput {...field} />
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="inTextSeparator"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Text separator</FormLabel>
							<FormDescription>
								Use this separator to separate within the same block of text
							</FormDescription>

							<Input {...field} />

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Save format</Button>
			</form>
		</Form>
	)
}
