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
import { useSettings } from '../settings-provider'

const fileAnalysisFormSchema = z.object({
	ocrEnabled: z.boolean(),
	vatLookupEnabled: z.boolean(),
	ownVatNumber: z.string().optional(),
})

type FileAnalysisFormSchema = z.infer<typeof fileAnalysisFormSchema>

export function FileAnalysisForm({
	onSubmit,
}: {
	onSubmit?: (values: FileAnalysisFormSchema) => void
}) {
	const { settings, updateSetting } = useSettings()

	const form = useForm<FileAnalysisFormSchema>({
		resolver: zodResolver(fileAnalysisFormSchema),
		defaultValues: {
			ocrEnabled: settings.ocrEnabled,
			vatLookupEnabled: settings.vatLookupEnabled,
			ownVatNumber: settings.ownVatNumber,
		},
	})

	const handleSubmit = React.useCallback(
		(values: FileAnalysisFormSchema) => {
			updateSetting('ocrEnabled', values.ocrEnabled)
			updateSetting('vatLookupEnabled', values.vatLookupEnabled)
			updateSetting('ownVatNumber', values.ownVatNumber)

			onSubmit?.(values)
		},
		[onSubmit, updateSetting],
	)

	const ocrEnabled = form.watch('ocrEnabled')
	const vatLookupEnabled = ocrEnabled && form.watch('vatLookupEnabled')

	return (
		<Form {...form}>
			<form
				noValidate
				onChange={form.handleSubmit(handleSubmit)}
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-md"
			>
				<FormField
					control={form.control}
					name="ocrEnabled"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex w-full cursor-pointer items-center justify-between gap-md rounded-base py-md transition-all hover:bg-background-muted hover:px-md">
								Enable OCR
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
									Enable VAT lookup
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
