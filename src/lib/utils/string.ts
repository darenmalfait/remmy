import slugify from 'slugify'

function transformName(str: string, separator = '-') {
  return slugify(str, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: separator,
    strict: true,
    trim: true,
  })
}

function padZero(str: string | number, length = 2) {
  return str.toString().padStart(length, '0')
}

const SEPARATOR = '-'
const SECTION_SEPARATOR = '_'

function rename({
  extension = 'pdf',
  date,
  description,
  detail,
  separator = SEPARATOR,
  sectionSeparator = SECTION_SEPARATOR,
  dateFormat = 'YYYY-MM-DD',
}: {
  dateFormat?: string
  extension?: string
  date?: Date
  description?: string
  detail?: string
  separator?: string
  sectionSeparator?: string
}) {
  let fileName = ''

  if (date) {
    let dateStr = ''
    const month = padZero(date.getMonth() + 1)
    const day = padZero(date.getDate())
    const year = date.getFullYear()

    switch (dateFormat) {
      case 'YYYY-MM-DD': {
        dateStr = `${year}${separator}${month}${separator}${day}`
        break
      }
      case 'DD-MM-YYYY': {
        dateStr = `${day}${separator}${month}${separator}${year}`
        break
      }
      default: {
        dateStr = `${year}${separator}${month}${separator}${day}`
        break
      }
    }

    fileName = `${fileName}${dateStr}`
  }

  if (description) {
    fileName = `${fileName}${sectionSeparator}${transformName(
      description,
      separator,
    ).toLowerCase()}`
  }

  if (detail) {
    fileName = `${fileName}${sectionSeparator}${transformName(
      detail,
      separator,
    ).toLowerCase()}`
  }

  return extension ? `${fileName}.${extension}` : fileName
}

function addTrailingSlash(str: string) {
  return str.endsWith('/') ? str : `${str}/`
}

function mapMonthToNumber(month: string) {
  switch (month) {
    case 'Jan':
      return '01'
    case 'Feb':
      return '02'
    case 'Mar':
      return '03'
    case 'Apr':
      return '04'
    case 'May':
      return '05'
    case 'Jun':
      return '06'
    case 'Jul':
      return '07'
    case 'Aug':
      return '08'
    case 'Sep':
      return '09'
    case 'Oct':
      return '10'
    case 'Nov':
      return '11'
    case 'Dec':
      return '12'
    default:
      return '01'
  }
}

export {transformName, addTrailingSlash, rename, mapMonthToNumber}
