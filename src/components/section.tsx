import { cx } from '@nerdfish/utils'
import * as React from 'react'

export const Section = React.forwardRef(function Section(
	{ className, ...props }: React.ComponentPropsWithoutRef<'section'>,
	ref: React.Ref<HTMLDivElement>,
) {
	return <section ref={ref} {...props} className={cx('space-y-6', className)} />
})
