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
		<div className="mb-md mt-xs flex items-start">
			<div className="flex h-5 items-center">
				<input
					type="checkbox"
					id={props.name}
					className="h-4 w-4 rounded border-muted text-foreground focus:ring-success"
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
