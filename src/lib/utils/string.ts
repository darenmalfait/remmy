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

export {transformName, addTrailingSlash, padZero, mapMonthToNumber}
