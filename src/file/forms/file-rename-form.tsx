import { zodResolver } from '@hookform/resolvers/zod'
import {
	Button,
	DateTimePicker,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@nerdfish/ui'
import { defaults } from 'lodash'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDestinations } from '../../destinations/destinations-provider'
import { FilenamePreview } from '../../filename/components/filename-preview'
import { useFilenameFormat } from '../../filename/filename-format-provider'
import { rename, transformName } from '../../filename/utils'
import { addTrailingSlash } from '../../utils'
import { moveFile } from '../utils'

const fileRenameFormSchema = z.object({
	date: z.date().optional(),
	description: z.string().optional(),
	detail: z.string().optional(),
	destination: z.string().min(1),
	filenameFormatId: z.string(),
})

type FileRenameFormSchema = z.infer<typeof fileRenameFormSchema>

function getIntialFileInfo(file: string, date?: Date) {
	const extension = file.split('.').slice(-1).join('.')
	return {
		extension,
		initialFilename: file
			.split('/')
			.slice(-1)
			.join('')
			.replace(`.${extension}`, '')
			.replace(transformName(date?.toISOString().split('T')[0] ?? ''), ''),
	}
}

interface FileRenameFormProps {
	file: string
	initialValues?: Partial<FileRenameFormSchema>
	onSubmit?: (values: FileRenameFormSchema) => void
}

export function FileRenameForm({
	file,
	initialValues,
	onSubmit,
}: FileRenameFormProps) {
	const { destinations } = useDestinations()
	const { filenameFormats } = useFilenameFormat()

	const { extension, initialFilename } = getIntialFileInfo(
		file,
		initialValues?.date,
	)

	const defaultFilenameFormat = filenameFormats.find(
		({ isDefault }) => !!isDefault,
	)

	const form = useForm<FileRenameFormSchema>({
		resolver: zodResolver(fileRenameFormSchema),
		defaultValues: defaults(initialValues, {
			date: new Date(),
			description: transformName(initialFilename),
			destination: destinations[0]?.path,
			filenameFormatId: defaultFilenameFormat?.id,
		}),
	})

	const handleSubmit = React.useCallback(
		(values: FileRenameFormSchema) => {
			const format = filenameFormats.find(
				({ id }) => id === values.filenameFormatId,
			)

			if (!format) throw new Error('filename format could not be found')

			const newLocation = `${addTrailingSlash(values.destination)}${rename({
				extension,
				date: new Date(values.date ?? new Date()),
				description: values.description,
				detail: values.detail,
				filenameConfiguration: format.filenameConfiguration,
				inTextSeparator: format.inTextSeparator,
			})}`

			const ok = moveFile(file, newLocation)

			if (!ok) {
				console.error('Could not move file')
				return
			}

			onSubmit?.(values)
		},
		[extension, file, filenameFormats, onSubmit],
	)

	const selectedFilenameFormat = filenameFormats.find(
		({ id }) => id === form.watch('filenameFormatId'),
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
					name="filenameFormatId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Format</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a format" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{filenameFormats.map((format) => (
											<SelectItem key={format.id} value={format.id}>
												{format.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="destination"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Destination</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a destination" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{destinations.map((destination) => (
											<SelectItem key={destination.id} value={destination.path}>
												{destination.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<DateTimePicker
									{...field}
									onChange={(value) => field.onChange(value)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Description{' '}
								<FormDescription>
									ie: company name, project name, etc.
								</FormDescription>
							</FormLabel>

							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{!!form.watch('description')?.length ? (
					<FormField
						control={form.control}
						name="detail"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Detail
									<FormDescription>
										ie: article title, project name, etc.
									</FormDescription>
								</FormLabel>

								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				) : null}

				{selectedFilenameFormat ? (
					<FilenamePreview
						extension={extension}
						description={form.watch('description')}
						detail={form.watch('detail')}
						date={form.watch('date')}
						filenameConfiguration={selectedFilenameFormat.filenameConfiguration}
						inTextSeparator={selectedFilenameFormat.inTextSeparator}
					/>
				) : null}

				<Button type="submit">Rename</Button>
			</form>
		</Form>
	)
}
