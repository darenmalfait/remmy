import * as React from 'react'

import {useSettings} from '../context/settings-provider'
import {rename} from '../lib/utils/string'

function NamePreview({
  extension,
  description,
  detail,
  date,
}: {
  extension: string
  description?: string
  detail?: string
  date?: Date
}) {
  const {settings} = useSettings()

  return (
    <div className="rounded-md bg-black/5 p-4 dark:bg-white/5">
      <p>Your file will look like this:</p>
      <code>
        {rename({
          extension,
          date,
          description,
          detail,
          dateFormat: settings.nameDateFormat,
          separator: settings.nameDetailSeparator,
          sectionSeparator: settings.nameSectionSeparator,
        })}
      </code>
    </div>
  )
}

export {NamePreview}