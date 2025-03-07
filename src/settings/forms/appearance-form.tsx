import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Label,
	RadioGroup,
	RadioGroupField,
	RadioGroupItem,
} from '@nerdfish/ui'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Appearance } from '../../types'

const appearanceFormSchema = z.object({
	appearance: z.nativeEnum(Appearance),
})

type AppearanceFormSchema = z.infer<typeof appearanceFormSchema>

interface AppearanceFormProps {
	initialValues?: AppearanceFormSchema
	onUpdate?: (values: AppearanceFormSchema) => void
}

export function AppearanceForm({
	initialValues,
	onUpdate,
}: AppearanceFormProps) {
	const form = useForm<AppearanceFormSchema>({
		resolver: zodResolver(appearanceFormSchema),
		defaultValues: initialValues ?? {
			appearance: Appearance.SYSTEM,
		},
	})

	const onSubmit = React.useCallback(
		(values: AppearanceFormSchema) => {
			onUpdate?.(values)
		},
		[onUpdate],
	)

	return (
		<Form {...form}>
			<form
				noValidate
				onChange={form.handleSubmit(onSubmit)}
				onSubmit={form.handleSubmit(onSubmit)}
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
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
