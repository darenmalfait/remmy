import * as React from 'react'
import {Toast} from '@nerdfish/ui'
import {ipcRenderer} from 'electron'

interface FileUploadContextProps {
  addingFile?: string
  onFileRenamed: () => void
  clearAddingFile: () => void
}

const FileUploadContext = React.createContext<FileUploadContextProps | null>(
  null,
)
FileUploadContext.displayName = 'FileUploadContext'

interface FileUploadProviderProps {
  children: React.ReactNode
}

// import { FileUploadProvider } from "path-to-context/FileUploadContext"
// use <FileUploadProvider> as a wrapper around the part you need the context for
function FileUploadProvider({children}: FileUploadProviderProps) {
  const [addingFile, setAddingFile] = React.useState<string | undefined>()
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    ipcRenderer.on('file-drop', (_, files) => {
      const file = files[0]
      if (!file) return

      setAddingFile(file)
    })

    return () => {
      ipcRenderer.removeAllListeners('file-drop')
    }
  }, [addingFile])

  const onFileRenamed = React.useCallback(() => {
    setAddingFile(undefined)
    setSaved(true)
  }, [])

  const clearAddingFile = React.useCallback(() => {
    setAddingFile(undefined)
  }, [])

  return (
    <FileUploadContext.Provider
      value={{addingFile, onFileRenamed, clearAddingFile}}
    >
      {children}
      <Toast
        variant={'success' as any}
        open={saved}
        onOpenChange={open => setSaved(open)}
        duration={3000}
      >
        File has been successfully moved
      </Toast>
    </FileUploadContext.Provider>
  )
}

// import { useFileUpload } fron "path-to-context/FileUploadContext"
// within functional component
// const { sessionToken, ...FileUploadContext } = useFileUpload()
function useFileUpload(): FileUploadContextProps {
  const context = React.useContext(FileUploadContext)

  if (!context) {
    throw new Error('You should use useFileUpload within an FileUploadContext')
  }

  return context
}

export {FileUploadProvider, useFileUpload}
