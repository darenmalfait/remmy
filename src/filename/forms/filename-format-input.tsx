'use client'

import { Button } from '@nerdfish/react/button'
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@nerdfish/react/command'
import { inputVariants } from '@nerdfish/react/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@nerdfish/react/popover'
import { cx } from '@nerdfish/utils'
import {
	CalendarIcon,
	CheckIcon,
	ChevronsUpDownIcon,
	PlusIcon,
	TrashIcon,
} from 'lucide-react'
import { AnimatePresence, Reorder } from 'motion/react'
import {
	useCallback,
	useState,
	type ComponentProps,
	type ComponentType,
} from 'react'
import * as uuid from 'uuid'
import { useSettings } from '../../settings/settings-provider'
import { defaultFilenameSettings } from '../settings'
import { type FilenameConfiguration } from '../types'

interface OptionSelectorProps
	extends Omit<ComponentProps<'input'>, 'onChange'> {
	value?: string
	className?: string
	placeholder?: string
	items?: { label: string; value: string }[]
	defaultValue?: string
	icon?: ComponentType<{ className?: string }>
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
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(valueProp ?? defaultValue)

	const handleChange = useCallback(
		(v: string) => {
			setValue(v === value ? '' : v)
			onChange?.(v)
			setOpen(false)
		},
		[onChange, value],
	)
	const handleRemove = useCallback(() => {
		onRemove?.()
	}, [onRemove])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
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
				}
			/>
			<PopoverContent className="w-full min-w-50">
				<Command>
					<CommandList>
						<CommandGroup className="p-0!s">
							{items.map((item) => (
								<CommandItem
									key={item.value}
									onSelect={() => handleChange(item.value)}
									className="rounded-[calc(var(--radius-base)-theme(padding.popover))]"
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
									className="text-destructive"
								>
									<TrashIcon className="mr-best-friends size-4" />
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

function DateFormatPicker(props: ComponentProps<typeof OptionSelector>) {
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

function SeparatorPicker(props: ComponentProps<typeof OptionSelector>) {
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

function DescriptionPicker(props: ComponentProps<typeof OptionSelector>) {
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

function DetailPicker(props: ComponentProps<typeof OptionSelector>) {
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
	const [open, setOpen] = useState<boolean>(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button type="button" icon size="sm" variant="secondary">
						<PlusIcon />
					</Button>
				}
			/>
			<PopoverContent className="w-full min-w-50">
				<Command>
					<CommandList>
						<CommandGroup className="p-0!">
							{Object.keys(ComponentMap).map((key) => (
								<CommandItem
									key={key}
									onSelect={onSelect as any}
									className="rounded-[calc(var(--radius-base)-theme(padding.popover))]"
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
				<div className="gap-x-best-friends pr-best-friends flex flex-nowrap">
					<Reorder.Group
						as="div"
						className="space-x-best-friends flex flex-row items-center"
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
