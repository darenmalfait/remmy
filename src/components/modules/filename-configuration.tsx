'use client'

import {
	Button,
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	inputVariants,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@nerdfish/ui'
import { cx } from '@nerdfish/utils'
import { AnimatePresence, Reorder } from 'framer-motion'
import { Calendar, Check, ChevronsUpDown, Plus, Trash } from 'lucide-react'
import * as React from 'react'
import * as uuid from 'uuid'
import { useSettings } from '../../settings/settings-provider'

const OptionSelector = React.forwardRef<
	HTMLInputElement,
	Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'> & {
		value?: string
		className?: string
		placeholder?: string
		items?: { label: string; value: string }[]
		defaultValue?: string
		icon?: React.ComponentType<{ className?: string }>
		inputSize?: 'sm' | 'md' | 'lg'
		onRemove?: () => void
		onChange?: (value: string) => void
	}
>(function OptionSelector(
	{
		value: valueProp,
		className,
		placeholder = 'Search...',
		items = [],
		defaultValue = '',
		icon: Icon = ChevronsUpDown,
		inputSize,
		onChange,
		onRemove,
		...props
	},
	ref,
) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState(valueProp ?? defaultValue)

	const handleChange = React.useCallback(
		(v: string) => {
			setValue(v === value ? '' : v)
			onChange?.(v)
			setOpen(false)
		},
		[onChange, value],
	)
	const handleRemove = React.useCallback(() => {
		onRemove?.()
	}, [onRemove])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					role="combobox"
					aria-haspopup="listbox"
					aria-controls="listbox"
					aria-expanded={open}
					className={cx(
						className,
						inputVariants({ inputSize }),
						'w-auto bg-inverted/5 px-3 py-1 !ring-0 !ring-offset-0',
						className,
					)}
				>
					<div className="flex w-full flex-nowrap items-center justify-between space-x-2 whitespace-nowrap">
						<input ref={ref} type="hidden" value={value} {...props} />

						{value
							? items.find((item) => item.value === value)?.label
							: placeholder}
						<Icon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full min-w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandGroup className="!p-0">
							{items.map((item) => (
								<CommandItem
									key={item.value}
									onSelect={() => handleChange(item.value)}
								>
									<Check
										className={cx(
											'mr-2 h-4 w-4',
											value === item.value ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{item.label}
								</CommandItem>
							))}
							{onRemove ? (
								<CommandItem
									onSelect={handleRemove}
									className="text-danger-foreground"
								>
									<Trash className="mr-2 h-4 w-4" />
									Remove
								</CommandItem>
							) : null}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
})
OptionSelector.displayName = 'OptionSelector'

function DateFormatPicker(props: React.ComponentProps<typeof OptionSelector>) {
	return (
		<OptionSelector
			{...props}
			name="dateFormat"
			icon={Calendar}
			defaultValue="yyyy_mm_dd"
			items={[
				{
					label: `YYYY-MM-DD`,
					value: 'yyyy-mm-dd',
				},
				{
					label: `DD-MM-YYYY`,
					value: 'dd-mm-yyyy',
				},
				{
					label: `YYYY_MM_DD`,
					value: 'yyyy_mm_dd',
				},
				{
					label: `DD_MM_YYYY`,
					value: 'dd_mm_yyyy',
				},
			]}
		/>
	)
}

function SeparatorPicker(props: React.ComponentProps<typeof OptionSelector>) {
	const { settings } = useSettings()
	return (
		<OptionSelector
			{...props}
			name="separator"
			defaultValue={settings.defaultSeparator}
			items={[
				{
					label: `-`,
					value: '-',
				},
				{
					label: `_`,
					value: '_',
				},
			]}
		/>
	)
}

function DescriptionPicker(props: React.ComponentProps<typeof OptionSelector>) {
	return (
		<OptionSelector
			{...props}
			name="description"
			defaultValue="lowercase"
			items={[
				{
					label: `description`,
					value: 'lowercase',
				},
			]}
		/>
	)
}

function DetailPicker(props: React.ComponentProps<typeof OptionSelector>) {
	return (
		<OptionSelector
			{...props}
			name="detail"
			defaultValue="lowercase"
			items={[
				{
					label: `detail`,
					value: 'lowercase',
				},
			]}
		/>
	)
}

const ComponentMap = {
	date: DateFormatPicker,
	separator: SeparatorPicker,
	description: DescriptionPicker,
	detail: DetailPicker,
}

const defaultFilenameSettings = {
	date: 'yyyy_mm_dd',
	separator: '-',
	description: 'lowercase',
	detail: 'lowercase',
	textSeparator: '_',
}

function AddNewSection({ onSelect }: { onSelect: (value: string) => void }) {
	const [open, setOpen] = React.useState<boolean>(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button type="button" variant="ghost" size="icon">
					<Plus className="size-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full min-w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandGroup className="!p-0">
							{Object.keys(ComponentMap).map((key) => (
								<CommandItem key={key} onSelect={onSelect}>
									{key}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

function FilenameConfiguration() {
	const { settings, updateSetting } = useSettings()
	const { filenameConfiguration } = settings

	return (
		<div
			className={cx(
				inputVariants(),
				'flex w-full flex-row space-x-2 overflow-x-scroll pr-2',
			)}
		>
			<Reorder.Group
				as="div"
				className="flex flex-row space-x-2"
				axis="x"
				values={filenameConfiguration}
				onReorder={(newOrder) => {
					updateSetting('filenameConfiguration', newOrder)
				}}
			>
				<AnimatePresence initial={false}>
					{filenameConfiguration.map((item, index) => {
						const Component = ComponentMap[item.type]

						return (
							<Reorder.Item as="div" key={item.id} value={item}>
								<Component
									name={item.type}
									defaultValue={item.value}
									onRemove={() => {
										const newFormat = [...filenameConfiguration]
										newFormat.splice(index, 1)
										updateSetting('filenameConfiguration', newFormat)
									}}
									onChange={(value) => {
										const newFormat = [...filenameConfiguration]
										newFormat[index].value = value
										updateSetting('filenameConfiguration', newFormat)
									}}
								/>
							</Reorder.Item>
						)
					})}
				</AnimatePresence>
			</Reorder.Group>
			<AddNewSection
				onSelect={(value) => {
					updateSetting('filenameConfiguration', [
						...filenameConfiguration,
						{
							type: value,
							value: defaultFilenameSettings[value],
							id: uuid.v4(),
						},
					])
				}}
			/>
		</div>
	)
}

export { FilenameConfiguration, defaultFilenameSettings }
