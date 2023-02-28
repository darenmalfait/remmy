const {notarize} = require('electron-notarize')

const packageJson = require('../package.json')
const appBundleId = packageJson.build.appId

const notarizeApp = async context => {
  const {electronPlatformName, appOutDir} = context
  const appName = context.packager.appInfo.productFilename
  const isMacOS = electronPlatformName === 'darwin'
  const shouldNotarize = process.env.NOTARIZE === 'true'

  if (!shouldNotarize || !isMacOS) {
    console.info('notarize: skipping notarization')
    return null
  }

  console.info('notarize: starting notarization')

  return notarize({
    appBundleId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID_USERNAME,
    appleIdPassword: process.env.APPLEID_PASSWORD,
  })
}

exports.default = notarizeApp
