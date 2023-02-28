import * as React from 'react'
import {emojify} from 'react-emojione'

import {Constants} from '../lib/utils/constants'

export const Oops = () => {
  const emoji = React.useMemo(
    () =>
      Constants.ERROR_EMOJIS[
        Math.floor(Math.random() * Constants.ERROR_EMOJIS.length)
      ],
    [],
  )

  return (
    <div className="dark:bg-gray-dark flex flex-1 flex-col items-center justify-center bg-white p-4 text-black dark:text-white">
      <h1 className="mb-5 text-5xl">{emojify(emoji, {output: 'unicode'})}</h1>

      <h2 className="text-semibold mb-2 text-xl font-semibold">
        Something went wrong.
      </h2>
    </div>
  )
}
