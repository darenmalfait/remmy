import assert from 'assert'

import imagemagick from 'imagemagick-stream'
import {isReadableStream} from 'is-stream'
import streamToArray from 'stream-to-array'

function bufferToStream(buffer: Buffer, page: any) {
  assert(
    Buffer.isBuffer(buffer) || isReadableStream(buffer),
    'The pdf must be either a readable stream or a buffer',
  )
  assert(typeof page === 'number', `page should be one number, given ${page}`)
  assert(page % 1 === 0, `page should be an integer, given ${page}`)
  assert(
    page >= 0,
    `the page must be equal to or greater than 0 in the case of ${page}`,
  )

  const imagemagickstream = imagemagick()
    .set('density', 200)
    .set('strip')
    .quality(90)
    .set('background', 'white')
    .set('flatten')

  const onError = imagemagickstream.onerror

  imagemagickstream.onerror = (err: {toString: () => any}) => {
    if (Buffer.isBuffer(err)) {
      console.error(`Ignore the error in ImageMagick.:\n${err.toString()}`)
      return
    }
    console.error(`Error:\n${err} from ImageMagick`)
    onError.apply(imagemagickstream, err)
  }

  if (typeof page !== 'undefined') {
    imagemagickstream.input = `pdf:-[${page}]`
  }

  imagemagickstream.output = 'png:-'

  if (Buffer.isBuffer(buffer)) {
    imagemagickstream.end(buffer)
  }

  return imagemagickstream
}

function fileToImage(file: Buffer, page: number) {
  return new Promise<string | NodeJS.ArrayBufferView>(async resolve => {
    const timeout = setTimeout(() => {
      console.error('fileToImage timeout')
      resolve('')
    }, 3000)

    const result = await streamToArray(bufferToStream(file, page)).then(
      (parts: Array<Buffer | string>) => {
        const buffers = parts.map(part => {
          return Buffer.isBuffer(part) ? part : Buffer.from(part)
        })

        clearTimeout(timeout)

        return Buffer.concat(buffers)
      },
    )

    return resolve(result)
  })
}

export {bufferToStream, fileToImage}
