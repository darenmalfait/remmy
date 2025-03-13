import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Label,
	RadioGroup,
	RadioGroupField,
	RadioGroupItem,
} from '@nerdfish/ui'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSettings } from '../settings-provider'
import { Appearance } from '../types'

const appearanceFormSchema = z.object({
	appearance: z.nativeEnum(Appearance),
})

type AppearanceFormSchema = z.infer<typeof appearanceFormSchema>

interface AppearanceFormProps {
	initialValues?: AppearanceFormSchema
	onSubmit?: (values: AppearanceFormSchema) => void
}

export function AppearanceForm({
	initialValues,
	onSubmit,
}: AppearanceFormProps) {
	const { updateSetting } = useSettings()

	const form = useForm<AppearanceFormSchema>({
		resolver: zodResolver(appearanceFormSchema),
		defaultValues: initialValues ?? {
			appearance: Appearance.SYSTEM,
		},
	})

	const handleSubmit = React.useCallback(
		(values: AppearanceFormSchema) => {
			updateSetting('appearance', values.appearance)
			onSubmit?.(values)
		},
		[onSubmit, updateSetting],
	)

	return (
		<Form {...form}>
			<form
				noValidate
				onChange={form.handleSubmit(handleSubmit)}
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FormField
					control={form.control}
					name="appearance"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Appearance</FormLabel>
							<FormControl>
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<RadioGroupField>
										<RadioGroupItem value={Appearance.SYSTEM} id="system" />
										<Label htmlFor="system">System</Label>
									</RadioGroupField>
									<RadioGroupField>
										<RadioGroupItem value={Appearance.LIGHT} id="light" />
										<Label htmlFor="light">Light</Label>
									</RadioGroupField>
									<RadioGroupField>
										<RadioGroupItem value={Appearance.DARK} id="dark" />
										<Label htmlFor="dark">Dark</Label>
									</RadioGroupField>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
