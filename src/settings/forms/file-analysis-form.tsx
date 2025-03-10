import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Switch,
} from '@nerdfish/ui'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const fileAnalysisFormSchema = z.object({
	ocrEnabled: z.boolean(),
	vatLookupEnabled: z.boolean(),
	ownVatNumber: z.string().optional(),
})

type FileAnalysisFormSchema = z.infer<typeof fileAnalysisFormSchema>

interface FileAnalysisFormProps {
	initialValues?: FileAnalysisFormSchema
	onUpdate?: (values: FileAnalysisFormSchema) => void
}

export function FileAnalysisForm({
	initialValues,
	onUpdate,
}: FileAnalysisFormProps) {
	const form = useForm<FileAnalysisFormSchema>({
		resolver: zodResolver(fileAnalysisFormSchema),
		defaultValues: initialValues ?? {
			ocrEnabled: false,
			vatLookupEnabled: false,
			ownVatNumber: '',
		},
	})

	const onSubmit = React.useCallback(
		(values: FileAnalysisFormSchema) => {
			onUpdate?.(values)
		},
		[onUpdate],
	)

	const ocrEnabled = form.watch('ocrEnabled')
	const vatLookupEnabled = ocrEnabled && form.watch('vatLookupEnabled')

	return (
		<Form {...form}>
			<form
				noValidate
				onChange={form.handleSubmit(onSubmit)}
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-lg"
			>
				<FormField
					control={form.control}
					name="ocrEnabled"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex w-full cursor-pointer items-center justify-between gap-md rounded-base py-md transition-all hover:bg-background-muted hover:px-md">
								OCR
								<FormControl>
									<Switch
										variant="success"
										data-checked={field.value}
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormLabel>
							<FormMessage />
						</FormItem>
					)}
				/>

				{ocrEnabled ? (
					<FormField
						control={form.control}
						name="vatLookupEnabled"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex w-full cursor-pointer items-center justify-between gap-md rounded-base py-md transition-all hover:bg-background-muted hover:px-md">
									Lookup VAT numbers
									<FormControl>
										<Switch
											variant="success"
											data-checked={field.value}
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
				) : null}

				{vatLookupEnabled ? (
					<FormField
						control={form.control}
						name="ownVatNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Your VAT number
									<FormDescription>
										Enter your own VAT number to ignore this from invoices
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
			</form>
		</Form>
	)
}
