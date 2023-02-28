import * as React from 'react'
import {Section as DarenSection, ExtractProps, cx} from '@daren/ui-components'

function Section({className, ...props}: ExtractProps<typeof DarenSection>) {
  return <DarenSection {...props} className={cx('space-y-6', className)} />
}

export {Section}
