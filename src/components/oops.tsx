import { useMemo } from 'react'
import { emojify } from 'react-emojione'

import { Constants } from '../lib/utils/constants'

export function Oops() {
	const emoji = useMemo(
		() =>
			Constants.ERROR_EMOJIS[
				Math.floor(Math.random() * Constants.ERROR_EMOJIS.length)
			],
		[],
	)

	return (
		<div className="bg-background-muted flex flex-1 flex-col items-center justify-center">
			<h1 className="mb-casual typography-heading">
				{emojify(emoji, { output: 'unicode' })}
			</h1>

			<h2 className="mb-best-friends typography-heading-sm">
				Something went wrong.
			</h2>
		</div>
	)
}
