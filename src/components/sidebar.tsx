import path from 'path'
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@nerdfish/ui'
import { ipcRenderer } from 'electron'
import { Cog, Folder, LogOutIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileUpload } from '../file-rename/file-upload-provider'

const logo = path.join(__dirname, 'assets/images', 'logo.png')

function Sidebar() {
	const navigate = useNavigate()
	const { clearAddingFile } = useFileUpload()

	return (
		<div className="fixed left-14 top-0 z-50 -ml-14 flex h-full w-14 flex-col overflow-y-auto bg-foreground-muted/5">
			<div className="flex flex-1 flex-col items-center py-4">
				<img
					src={logo}
					alt="logo"
					className="mx-auto my-3 w-10 cursor-pointer"
					onClick={() => navigate('/')}
				/>
			</div>

			<div className="px-3 py-4">
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							onClick={() => {
								clearAddingFile()
								return navigate('/destinations')
							}}
							aria-label="Destination"
						>
							<Folder className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Destinations</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							onClick={() => {
								clearAddingFile()
								return navigate('/settings')
							}}
							aria-label="Settings"
						>
							<Cog className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Settings</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							onClick={() => ipcRenderer.send('app-quit')}
							aria-label="Quit App"
						>
							<LogOutIcon className="h-3.5 w-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Quit Remmy</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}

export { Sidebar }
