import { zodResolver } from '@hookform/resolvers/zod'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@nerdfish/react/field'
import { RadioGroup, RadioGroupItem } from '@nerdfish/react/radio-group'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSettings } from '../settings-provider'
import { Appearance } from '../types'

const appearanceFormSchema = z.object({
	appearance: z.nativeEnum(Appearance),
})

type AppearanceFormSchema = z.infer<typeof appearanceFormSchema>

interface AppearanceFormProps {
	onSubmit?: (values: AppearanceFormSchema) => void
}

export function AppearanceForm({ onSubmit }: AppearanceFormProps) {
	const { updateSetting, settings } = useSettings()

	const form = useForm<AppearanceFormSchema>({
		resolver: zodResolver(appearanceFormSchema),
		defaultValues: {
			appearance: settings.appearance,
		},
	})

	const handleSubmit = useCallback(
		(values: AppearanceFormSchema) => {
			updateSetting('appearance', values.appearance)
			onSubmit?.(values)
		},
		[onSubmit, updateSetting],
	)

	return (
		<form
			noValidate
			onChange={form.handleSubmit(handleSubmit)}
			onSubmit={form.handleSubmit(handleSubmit)}
		>
			<FieldGroup>
				<Controller
					control={form.control}
					name="appearance"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel>Theme</FieldLabel>
							<RadioGroup
								aria-invalid={fieldState.invalid}
								onValueChange={field.onChange}
								value={field.value}
								defaultValue={field.value}
							>
								<div className="gap-friends flex items-center">
									<RadioGroupItem value={Appearance.SYSTEM} id="system" />
									<FieldLabel htmlFor="system">Default</FieldLabel>
								</div>
								<div className="gap-friends flex items-center">
									<RadioGroupItem value={Appearance.LIGHT} id="light" />
									<FieldLabel htmlFor="light">Light</FieldLabel>
								</div>
								<div className="gap-friends flex items-center">
									<RadioGroupItem value={Appearance.DARK} id="dark" />
									<FieldLabel htmlFor="dark">Dark</FieldLabel>
								</div>
							</RadioGroup>

							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
			</FieldGroup>
		</form>
	)
}
