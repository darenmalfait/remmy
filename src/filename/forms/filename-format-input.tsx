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
import {
	CalendarIcon,
	CheckIcon,
	ChevronsUpDownIcon,
	PlusIcon,
	TrashIcon,
} from 'lucide-react'
import { AnimatePresence, Reorder } from 'motion/react'
import * as React from 'react'
import * as uuid from 'uuid'
import { useSettings } from '../../settings/settings-provider'
import { defaultFilenameSettings } from '../settings'
import { type FilenameConfiguration } from '../types'

interface OptionSelectorProps
	extends Omit<React.ComponentProps<'input'>, 'onChange'> {
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

function OptionSelector({
	value: valueProp,
	className,
	placeholder = 'Search...',
	items = [],
	ref,
	defaultValue = '',
	icon: Icon = ChevronsUpDownIcon,
	inputSize,
	onChange,
	onRemove,
	...props
}: OptionSelectorProps) {
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
					role="combobox"
					aria-haspopup="listbox"
					aria-controls="listbox"
					aria-expanded={open}
					size="sm"
					className={cx('w-auto', className)}
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
			<PopoverContent className="bg-popover w-full min-w-[200px] !p-sm">
				<Command>
					<CommandList>
						<CommandGroup className="!p-0">
							{items.map((item) => (
								<CommandItem
									key={item.value}
									onSelect={() => handleChange(item.value)}
									className="rounded-[calc(theme(borderRadius.base)-theme(padding.sm))]"
								>
									<CheckIcon
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
									className="text-foreground-danger"
								>
									<TrashIcon className="mr-2 h-4 w-4" />
									Remove
								</CommandItem>
							) : null}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

OptionSelector.displayName = 'OptionSelector'

function DateFormatPicker(props: React.ComponentProps<typeof OptionSelector>) {
	return (
		<OptionSelector
			{...props}
			name="dateFormat"
			icon={CalendarIcon}
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
				{
					label: `YYYY`,
					value: 'yyyy',
				},
				{
					label: `YYYY-MM`,
					value: 'yyyy-mm',
				},
				{
					label: `YYYY_MM`,
					value: 'yyyy_mm',
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

function AddNewSection({
	onSelect,
}: {
	onSelect: (value: FilenameConfiguration['type']) => void
}) {
	const [open, setOpen] = React.useState<boolean>(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button type="button" icon size="sm" variant="secondary">
					<PlusIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="bg-popover w-full min-w-[200px] !p-sm">
				<Command>
					<CommandList>
						<CommandGroup className="!p-0">
							{Object.keys(ComponentMap).map((key) => (
								<CommandItem
									key={key}
									onSelect={onSelect as any}
									className="rounded-[calc(theme(borderRadius.base)-theme(padding.sm))]"
								>
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

export interface FilenameFormatInputProps {
	value: FilenameConfiguration[]
	onChange: (format: FilenameConfiguration[]) => void
}
export function FilenameFormatInput({
	onChange,
	value = [],
}: FilenameFormatInputProps) {
	return (
		<div className={inputVariants()}>
			<div className="w-full overflow-x-auto">
				<div className="flex flex-nowrap gap-x-sm pr-sm">
					<Reorder.Group
						as="div"
						className="flex flex-row items-center space-x-sm"
						axis="x"
						values={value}
						onReorder={onChange}
					>
						<AnimatePresence initial={false}>
							{value.map((item, index) => {
								const Component = ComponentMap[item.type]

								return (
									<Reorder.Item as="div" key={item.id} value={item}>
										<Component
											name={item.type}
											defaultValue={item.value}
											onRemove={() => {
												const newFormat = [...value]
												newFormat.splice(index, 1)
												onChange(newFormat)
											}}
											onChange={(newValue) => {
												const newFormat = [...value]
												if (newFormat[index]) {
													newFormat[index].value = newValue
													onChange(newFormat)
												}
											}}
										/>
									</Reorder.Item>
								)
							})}
						</AnimatePresence>
					</Reorder.Group>
					<AddNewSection
						onSelect={(newValue) => {
							onChange([
								...value,
								{
									type: newValue,
									value:
										defaultFilenameSettings[
											newValue as keyof typeof defaultFilenameSettings
										],
									id: uuid.v4(),
								},
							])
						}}
					/>
				</div>
			</div>
		</div>
	)
}
