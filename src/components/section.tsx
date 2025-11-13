import { cx } from '@nerdfish/utils'
import { Slot } from '@radix-ui/react-slot'
import { type ComponentProps, type ElementType } from 'react'
export interface SectionProps extends ComponentProps<'section'> {
	asChild?: boolean
}

export function Section({ className, asChild, ...props }: SectionProps) {
	const Component = asChild ? Slot : 'section'

	return (
		<Component
			className={cx(
				'not-first-of-type:pt-casual rounded-container pb-casual flex flex-1 flex-col',
				className,
			)}
			{...props}
		/>
	)
}

export interface SectionHeaderTitleProps extends ComponentProps<'h1'> {
	as?: ElementType
}

export function SectionHeaderTitle({
	children,
	className,
	...props
}: SectionHeaderTitleProps) {
	if (!children || children === '') return null

	return (
		<h2 className={cx('typography-heading', className)} {...props}>
			{children}
		</h2>
	)
}

export type SectionHeaderSubtitleProps = ComponentProps<'h2'>

export function SectionHeaderSubtitle({
	children,
	className,
	...props
}: SectionHeaderSubtitleProps) {
	if (!children || children === '') return null

	return (
		<div className={cx('typography-title mt-0!', className)} {...props}>
			{children}
		</div>
	)
}

export interface SectionHeaderProps extends ComponentProps<'header'> {
	as?: ElementType
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
		<Element
			className={cx('mb-casual gap-best-friends flex flex-col', className)}
			{...props}
		>
			{children}
		</Element>
	)
}
