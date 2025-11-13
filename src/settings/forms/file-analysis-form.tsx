import { zodResolver } from '@hookform/resolvers/zod'
import {
	FieldGroup,
	FieldLabel,
	FieldError,
	Field,
	FieldDescription,
} from '@nerdfish/react/field'
import { Input } from '@nerdfish/react/input'
import { Switch } from '@nerdfish/react/switch'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
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

	const handleSubmit = useCallback(
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
		<form
			noValidate
			onChange={form.handleSubmit(handleSubmit)}
			onSubmit={form.handleSubmit(handleSubmit)}
			className="space-y-md"
		>
			<FieldGroup>
				<Controller
					control={form.control}
					name="ocrEnabled"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel className="gap-friends rounded-base py-friends hover:bg-background-muted hover:px-friends flex w-full cursor-pointer items-center justify-between transition-all">
								<span>Enable OCR</span>
								<Switch
									aria-invalid={fieldState.invalid}
									data-checked={field.value}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FieldLabel>

							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>

				{ocrEnabled ? (
					<Controller
						control={form.control}
						name="vatLookupEnabled"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel className="gap-friends rounded-base py-friends hover:bg-background-muted hover:px-friends flex w-full cursor-pointer items-center justify-between transition-all">
									<span>Enable VAT lookup</span>
									<Switch
										aria-invalid={fieldState.invalid}
										data-checked={field.value}
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FieldLabel>

								{fieldState.invalid ? (
									<FieldError errors={[fieldState.error]} />
								) : null}
							</Field>
						)}
					/>
				) : null}

				{vatLookupEnabled ? (
					<Controller
						control={form.control}
						name="ownVatNumber"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>Your VAT number</FieldLabel>
								<FieldDescription>
									Enter your own VAT number to ignore this from invoices
								</FieldDescription>

								<Input aria-invalid={fieldState.invalid} {...field} />

								{fieldState.invalid ? (
									<FieldError errors={[fieldState.error]} />
								) : null}
							</Field>
						)}
					/>
				) : null}
			</FieldGroup>
		</form>
	)
}
