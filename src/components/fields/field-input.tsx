import React from 'react'
import { Field } from 'react-final-form'

export interface IProps {
	name: string
	type?: string
	label: string
	placeholder?: string
	helpText?: React.ReactNode | string
	required?: boolean
}

export const FieldInput: React.FC<IProps> = ({
	label,
	name,
	placeholder = '',
	helpText,
	type = 'text',
	required = false,
}) => {
	return (
		<Field name={name}>
			{({ input, meta: { touched, error } }) => (
				<div className="mt-2">
					<label
						className="text-grey-dark mb-2 block text-sm font-semibold tracking-wide"
						htmlFor={input.name}
					>
						{label}
					</label>

					<input
						type={type}
						className="border-red text-secondary mb-2 block w-full appearance-none rounded border bg-muted px-4 py-1.5 focus:outline-none"
						id={input.name}
						placeholder={placeholder}
						required={required}
						{...input}
					/>

					{helpText ? (
						<div className="mt-3 text-xs text-muted">{helpText}</div>
					) : null}

					{touched && error ? (
						<div className="mt-2 text-xs italic text-red-500">{error}</div>
					) : null}
				</div>
			)}
		</Field>
	)
}
