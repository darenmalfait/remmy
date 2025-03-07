import * as React from 'react'

interface IFieldCheckbox {
	name: string
	label: string
	checked: boolean
	onChange: any
	placeholder?: string
}

export const FieldCheckbox = (props: IFieldCheckbox) => {
	return (
		<div className="mb-3 mt-1 flex items-start">
			<div className="flex h-5 items-center">
				<input
					type="checkbox"
					id={props.name}
					className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
					checked={props.checked}
					onChange={props.onChange}
				/>
			</div>

			<div className="ml-3 text-sm">
				<label htmlFor={props.name} className="font-medium text-foreground">
					{props.label}
				</label>
				{props.placeholder ? (
					<p className="text-foreground-muted">{props.placeholder}</p>
				) : null}
			</div>
		</div>
	)
}
