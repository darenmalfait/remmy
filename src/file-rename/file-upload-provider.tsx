import { toast } from '@nerdfish/ui'
import { ipcRenderer } from 'electron'
import * as React from 'react'

interface FileUploadContextProps {
	selectedFile?: string
	onFileRenamed: () => void
	clearSelectedFile: () => void
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
function FileUploadProvider({ children }: FileUploadProviderProps) {
	const [selectedFile, setSelectedFile] = React.useState<string | undefined>()

	React.useEffect(() => {
		ipcRenderer.on('file-drop', (_, files) => {
			const file = files[0]
			if (!file) return

			setSelectedFile(file)
		})

		return () => {
			ipcRenderer.removeAllListeners('file-drop')
		}
	}, [selectedFile])

	const onFileRenamed = React.useCallback(() => {
		setSelectedFile(undefined)
		toast.success('File has been successfully moved')
	}, [])

	const clearSelectedFile = React.useCallback(() => {
		setSelectedFile(undefined)
	}, [])

	return (
		<FileUploadContext.Provider
			value={{ selectedFile, onFileRenamed, clearSelectedFile }}
		>
			{children}
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

export { FileUploadProvider, useFileUpload }
