import { H1, type H2 } from '@nerdfish/ui'
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
	className,
	...props
}: SectionHeaderTitleProps) {
	if (!children || children === '') return null

	return (
		<H1
			as="h2"
			variant="primary"
			className={cx('mb-md max-w-7xl font-title leading-[1.1]', className)}
			{...props}
		>
			{children}
		</H1>
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
		<div
			className={cx(
				'max-w-7xl text-xl font-semibold text-foreground-muted lg:text-2xl',
				className,
			)}
			{...props}
		>
			{children}
		</div>
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
		<Element className={cx('mb-lg', className)} {...props}>
			{children}
		</Element>
	)
}
