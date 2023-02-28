import * as React from 'react'
import {Section as DarenSection} from '@nerdfish/ui'
import {ExtractProps, cx} from '@nerdfish/utils'

function Section({className, ...props}: ExtractProps<typeof DarenSection>) {
  return <DarenSection {...props} className={cx('space-y-6', className)} />
}

export {Section}
