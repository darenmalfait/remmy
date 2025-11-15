import { zodResolver } from '@hookform/resolvers/zod'
import { getLocalTimeZone, parseDate } from '@internationalized/date'
import { Button } from '@nerdfish/react/button'
import { DateField, DateInput } from '@nerdfish/react/date-field'
import { DatePicker } from '@nerdfish/react/date-picker'
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
} from '@nerdfish/react/field'
import { Input } from '@nerdfish/react/input'
import { InputGroup, InputGroupAddon } from '@nerdfish/react/input-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@nerdfish/react/select'
import { format as formatDate } from 'date-fns'
import { defaults } from 'lodash'
import { CalendarIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
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

	const handleSubmit = useCallback(
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
		<form
			noValidate
			onSubmit={form.handleSubmit(handleSubmit)}
			className="space-y-casual"
		>
			<FieldGroup>
				<Controller
					control={form.control}
					name="filenameFormatId"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Format</FieldLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger>
									<SelectValue>{selectedFilenameFormat?.name}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={null}>Select a format</SelectItem>
									{filenameFormats.map((format) => (
										<SelectItem key={format.id} value={format.id}>
											{format.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="destination"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Destination</FieldLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger>
									<SelectValue>
										{
											destinations.find(
												(destination) => destination.path === field.value,
											)?.name
										}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={null}>Select a destination</SelectItem>
									{destinations.map((destination) => (
										<SelectItem key={destination.id} value={destination.path}>
											{destination.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="date"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Date</FieldLabel>
							<InputGroup>
								<DateField
									className="w-full"
									value={
										field.value
											? parseDate(formatDate(field.value, 'yyyy-MM-dd'))
											: undefined
									}
									onChange={(e) => {
										field.onChange(
											e
												? new Date(
														formatDate(
															e.toDate(getLocalTimeZone()),
															'yyyy-MM-dd',
														),
													)
												: undefined,
										)
									}}
								>
									<DateInput />
								</DateField>
								<InputGroupAddon
									align="inline-end"
									className="pr-friends@! ml-bff"
								>
									<DatePicker
										selected={field.value ? new Date(field.value) : undefined}
										onSelect={(value) =>
											field.onChange(
												value
													? new Date(formatDate(value, 'yyyy-MM-dd'))
													: undefined,
											)
										}
									>
										<Button variant="ghost" size="sm" icon>
											<CalendarIcon className="size-4" />
										</Button>
									</DatePicker>
								</InputGroupAddon>
							</InputGroup>

							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="description"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Description</FieldLabel>
							<FieldDescription>
								ie: company name, project name, etc.
							</FieldDescription>
							<Input aria-invalid={fieldState.invalid} {...field} />
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>

				{!!form.watch('description')?.length ? (
					<Controller
						control={form.control}
						name="detail"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>Detail</FieldLabel>
								<FieldDescription>
									ie: company name, project name, etc.
								</FieldDescription>
								<Input aria-invalid={fieldState.invalid} {...field} />
								{fieldState.invalid ? (
									<FieldError errors={[fieldState.error]} />
								) : null}
							</Field>
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
			</FieldGroup>

			<Button className="mt-casual" type="submit">
				Rename
			</Button>
		</form>
	)
}
