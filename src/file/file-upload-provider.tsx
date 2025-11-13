import { toast } from '@nerdfish/react/toast'
import { ipcRenderer } from 'electron'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'
interface FileUploadContextProps {
	selectedFile?: string
	onFileRenamed: () => void
	clearSelectedFile: () => void
}

const FileUploadContext = createContext<FileUploadContextProps | null>(null)
FileUploadContext.displayName = 'FileUploadContext'

interface FileUploadProviderProps {
	children: ReactNode
}

// import { FileUploadProvider } from "path-to-context/FileUploadContext"
// use <FileUploadProvider> as a wrapper around the part you need the context for
function FileUploadProvider({ children }: FileUploadProviderProps) {
	const [selectedFile, setSelectedFile] = useState<string | undefined>()

	useEffect(() => {
		ipcRenderer.on('file-drop', (_, files) => {
			const file = files[0]
			if (!file) return

			setSelectedFile(file)
		})

		return () => {
			ipcRenderer.removeAllListeners('file-drop')
		}
	}, [selectedFile])

	const onFileRenamed = useCallback(() => {
		setSelectedFile(undefined)
		toast.success('File has been successfully moved')
	}, [])

	const clearSelectedFile = useCallback(() => {
		setSelectedFile(undefined)
	}, [])

	return (
		<FileUploadContext
			value={useMemo(
				() => ({ selectedFile, onFileRenamed, clearSelectedFile }),
				[selectedFile, onFileRenamed, clearSelectedFile],
			)}
		>
			{children}
		</FileUploadContext>
	)
}

// import { useFileUpload } fron "path-to-context/FileUploadContext"
// within functional component
// const { sessionToken, ...FileUploadContext } = useFileUpload()
function useFileUpload(): FileUploadContextProps {
	const context = useContext(FileUploadContext)

	if (!context) {
		throw new Error('You should use useFileUpload within an FileUploadContext')
	}

	return context
}

export { FileUploadProvider, useFileUpload }
