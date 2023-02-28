import React from 'react'
import {CogIcon, FolderIcon} from '@heroicons/react/24/solid'
import {ipcRenderer} from 'electron'
import {useNavigate} from 'react-router-dom'

import {Logo} from '../components/logo'
import {useFileUpload} from '../context/file-upload-provider'
import {IconQuit} from '../icons/Quit'

function Sidebar() {
  const navigate = useNavigate()
  const {clearAddingFile} = useFileUpload()

  const goToHome = React.useCallback(() => {
    navigate('/')
  }, [navigate])

  const quitApp = React.useCallback(() => {
    ipcRenderer.send('app-quit')
  }, [])

  const footerButtonClasses =
    'flex justify-evenly items-center bg-transparent border-0 w-full text-sm text-gray-900 dark:text-gray-100 my-1 py-2 cursor-pointer hover:text-gray-500 focus:outline-none'

  return (
    <div className="fixed top-0 left-14 -ml-14 flex h-full w-14 flex-col overflow-y-auto bg-black/5 dark:bg-white/5	">
      <div className="flex flex-1 flex-col items-center py-4">
        <Logo className="my-3 mx-auto w-7 cursor-pointer" onClick={goToHome} />
      </div>

      <div className="py-4 px-3">
        <button
          className={footerButtonClasses}
          onClick={() => {
            clearAddingFile()
            navigate('/destinations')
          }}
          aria-label="Destination"
        >
          <FolderIcon className="h-4 w-4" />
        </button>
        <button
          className={footerButtonClasses}
          onClick={() => {
            clearAddingFile()
            navigate('/settings')
          }}
          aria-label="Settings"
        >
          <CogIcon className="h-4 w-4" />
        </button>
        <button
          className={footerButtonClasses}
          onClick={quitApp}
          aria-label="Quit App"
        >
          <IconQuit className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export {Sidebar}
