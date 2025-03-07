import path from 'path'
import { ipcRenderer } from 'electron'
import { Cog, Folder, LogOut } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useFileUpload } from '../context/file-upload-provider'

const logo = path.join(__dirname, 'assets/images', 'logo.png')

function Sidebar() {
	const navigate = useNavigate()
	const { clearAddingFile } = useFileUpload()

	const goToHome = React.useCallback(() => {
		return navigate('/')
	}, [navigate])

	const quitApp = React.useCallback(() => {
		ipcRenderer.send('app-quit')
	}, [])

	const footerButtonClasses =
		'flex justify-evenly items-center bg-transparent border-0 w-full text-sm text-foreground my-1 py-2 cursor-pointer hover:text-gray-500 focus:outline-none'

	return (
		<div className="fixed left-14 top-0 -ml-14 flex h-full w-14 flex-col overflow-y-auto bg-background-muted">
			<div className="flex flex-1 flex-col items-center py-4">
				<img
					src={logo}
					alt="logo"
					className="mx-auto my-3 w-10 cursor-pointer"
					onClick={goToHome}
				/>
			</div>

			<div className="px-3 py-4">
				<button
					className={footerButtonClasses}
					onClick={() => {
						clearAddingFile()
						return navigate('/destinations')
					}}
					aria-label="Destination"
				>
					<Folder className="h-4 w-4" />
				</button>
				<button
					className={footerButtonClasses}
					onClick={() => {
						clearAddingFile()
						return navigate('/settings')
					}}
					aria-label="Settings"
				>
					<Cog className="h-4 w-4" />
				</button>
				<button
					className={footerButtonClasses}
					onClick={quitApp}
					aria-label="Quit App"
				>
					<LogOut className="h-3.5 w-3.5" />
				</button>
			</div>
		</div>
	)
}

export { Sidebar }
