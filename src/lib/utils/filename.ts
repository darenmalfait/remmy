import {defaultFilenameSettings} from '../../components/modules/filename-configuration'
import {FilenameConfiguration} from '../../types'
import {padZero, transformName} from './string'

function formatDate(date?: Date, format?: string) {
  if (!date || !format) return ''
  let dateStr = ''
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const year = date.getFullYear()

  switch (format.toLowerCase()) {
    case 'yyyy-mm-dd': {
      dateStr = `${year}-${month}-${day}`
      break
    }
    case 'yyyy_mm_dd': {
      dateStr = `${year}_${month}_${day}`
      break
    }
    case 'dd-mm-yyyy': {
      dateStr = `${day}-${month}-${year}`
      break
    }
    case 'dd_mm_yyyy': {
      dateStr = `${day}_${month}_${year}`
      break
    }
    default: {
      dateStr = `${year}-${month}-${day}`
      break
    }
  }

  return dateStr
}

function rename({
  extension = 'pdf',
  date,
  description,
  detail,
  filenameConfiguration = [],
  textSeparator = defaultFilenameSettings.textSeparator,
}: {
  extension?: string
  date?: Date
  description?: string
  detail?: string
  filenameConfiguration?: FilenameConfiguration[]
  textSeparator?: string
}) {
  let fileName = ''

  filenameConfiguration.forEach(config => {
    const {value, type} = config

    if (type === 'date') {
      if (!date) return
      fileName = `${fileName}${formatDate(date, value)}`
    } else if (type === 'description') {
      if (!description) return
      fileName = `${fileName}${transformName(
        description,
        textSeparator,
      ).toLowerCase()}`
    } else if (type === 'detail') {
      if (!detail) return
      fileName = `${fileName}${transformName(
        detail,
        textSeparator,
      ).toLowerCase()}`
    } else {
      fileName = `${fileName}${value}`
    }
  })

  const lastSeparator = filenameConfiguration
    .filter(c => c.type === 'separator')
    .pop()

  if (lastSeparator && fileName.endsWith(lastSeparator.value)) {
    fileName = fileName.slice(0, -1)
  }

  return extension ? `${fileName}.${extension}` : fileName
}

export {rename}
