import * as React from 'react'

import { type RadioGroupItem } from '../../types'

export const FieldRadioGroup = ({
	label,
	placeholder,
	name,
	options,
	onChange,
	value,
}: {
	name: string
	label: string
	placeholder?: string
	options: RadioGroupItem[]
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	value: string
}) => {
	return (
		<fieldset id={name} className="mb-1">
			<div>
				<legend className="mb-1 text-base font-medium text-foreground">
					{label}
				</legend>
				{placeholder ? (
					<p className="text-sm text-foreground-muted">{placeholder}</p>
				) : null}
			</div>

			<div
				className="flex items-center space-x-4 py-2"
				role="group"
				aria-labelledby={name}
			>
				{options.map((item) => {
					return (
						<div
							className="mt-1 flex items-center"
							key={`radio_item_${item.value.toLowerCase()}`}
						>
							<input
								type="radio"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
								id={`${name}_${item.value.toLowerCase()}`}
								name={name}
								value={item.value}
								onChange={onChange}
								checked={item.value === value}
							/>
							<label
								htmlFor={`${name}_${item.value.toLowerCase()}`}
								className="ml-3 block text-sm font-medium text-foreground"
							>
								{item.label}
							</label>
						</div>
					)
				})}
			</div>
		</fieldset>
	)
}
