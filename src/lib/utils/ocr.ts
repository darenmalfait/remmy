import fs from 'fs'
import path from 'path'

import {createWorker} from 'tesseract.js'

import {fileToImage} from '../../lib/utils/pdf'

async function imageToText(filePath: string) {
  return new Promise<string>(async resolve => {
    const worker = await createWorker()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')

    const timeout = setTimeout(async () => {
      console.error('ocr timeout')
      await worker.terminate()
      resolve('')
    }, 8000)

    const {
      data: {text},
    } = (await worker
      .recognize(filePath, {pdfTitle: 'temp'}, {pdf: true})
      .catch(e => {
        console.error('ocr error', e)
        clearTimeout(timeout)
        resolve('')
      })
      .finally(async () => {
        clearTimeout(timeout)
        await worker.terminate()
      })) || {data: {text: ''}}

    resolve(text)
  })
}

async function ocr(filePath: string): Promise<string | undefined> {
  const __dirname = path.resolve(path.dirname(''))
  const tmpFile = fs.readFileSync(filePath, null)

  if (!filePath.toLocaleLowerCase().endsWith('.pdf')) return

  if (!fs.existsSync(path.resolve(__dirname, 'temp'))) {
    fs.mkdirSync(path.resolve(__dirname, 'temp'))
  }

  const image = await fileToImage(tmpFile, 0)
  if (!image) return ''

  const tempFilePath = path.resolve(__dirname, 'temp', 'tmp.png')

  if (!tempFilePath) return ''
  fs.writeFileSync(tempFilePath, image, null)

  return imageToText(tempFilePath)
}

function getVATNumbers(text: string) {
  const roughRegex = /[A-Za-z]{2,4}[\s-]?[0-9.-]{7,12}[A-Z0-9]{0,3}/g
  const results =
    text.match(roughRegex)?.map(r => r.replace(/[\s-_.]/g, '')) ?? []

  const specificRegex =
    /((AT)(U\d{8})|(BE)(0\d{9})|(BG)(\d{9,10})|(CY)(\d{8}[LX])|(CZ)(\d{8,10})|(DE)(\d{9})|(DK)(\d{8})|(EE)(\d{9})|(EL|GR)(\d{9})|(ES)([\dA-Z]\d{7}[\dA-Z])|(FI)(\d{8})|(FR)([\dA-Z]{2}\d{9})|(HU)(\d{8})|(IE)(\d{7}[A-Z]{2})|(IT)(\d{11})|(LT)(\d{9}|\d{12})|(LU)(\d{8})|(LV)(\d{11})|(MT)(\d{8})|(NL)(\d{9}(B\d{2}|BO2))|(PL)(\d{10})|(PT)(\d{9})|(RO)(\d{2,10})|(SE)(\d{12})|(SI)(\d{8})|(SK)(\d{10}))/g

  const specificResults = results.filter(v => v.match(specificRegex))

  return specificResults
}

function getVATNumberFromText(text: string, ignore?: string[]) {
  const vatNumbers = getVATNumbers(text)

  if (!vatNumbers.length) {
    return null
  }

  const vatNumber = vatNumbers.filter(v => {
    if (!ignore) {
      return true
    }

    return !ignore.includes(v)
  })[0]

  if (!vatNumber) {
    return null
  }

  const countryCode = vatNumber.match(/^[A-Za-z]{2,4}/g)?.[0]
  const number = vatNumber.replace(countryCode ?? '', '')

  return {
    countryCode,
    number,
  }
}

export {ocr, getVATNumberFromText, getVATNumbers}