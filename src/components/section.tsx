import { type H1, H3, H4, type H2 } from '@nerdfish/ui'
import { cx } from '@nerdfish/utils'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

export interface SectionProps extends React.ComponentProps<'section'> {
	asChild?: boolean
}

export function Section({ className, asChild, ...props }: SectionProps) {
	const Component = asChild ? Slot : 'section'

	return (
		<Component
			className={cx(
				'not-first-of-type:pt-lg container rounded-container pb-lg',
				className,
			)}
			{...props}
		/>
	)
}

export interface SectionHeaderTitleProps
	extends React.ComponentProps<typeof H1> {
	as?: React.ElementType
}

export function SectionHeaderTitle({
	children,
	...props
}: SectionHeaderTitleProps) {
	if (!children || children === '') return null

	return (
		<H3 as="h2" variant="primary" {...props}>
			{children}
		</H3>
	)
}

export interface SectionHeaderSubtitleProps
	extends React.ComponentProps<typeof H2> {
	as?: React.ElementType
}

export function SectionHeaderSubtitle({
	children,
	className,

	...props
}: SectionHeaderSubtitleProps) {
	if (!children || children === '') return null

	return (
		<H4 as="div" className={cx('!mt-0', className)} {...props}>
			{children}
		</H4>
	)
}

export interface SectionHeaderProps extends React.ComponentProps<'header'> {
	as?: React.ElementType
}

export function SectionHeader({
	children,
	className,
	as,
	...props
}: SectionHeaderProps) {
	const Element = as ?? 'header'

	if (!children) return null

	return (
		<Element className={cx('mb-lg flex flex-col gap-sm', className)} {...props}>
			{children}
		</Element>
	)
}
