import path from 'path'
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@nerdfish/ui'
import { ipcRenderer } from 'electron'
import { Cog, Folder, LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFileUpload } from '../file-rename/file-upload-provider'

const logo = path.join(__dirname, 'assets/images', 'logo.png')

function Sidebar() {
	const navigate = useNavigate()
	const { clearAddingFile } = useFileUpload()

	return (
		<div className="fixed left-16 top-0 z-50 -ml-16 flex h-full w-16 flex-col overflow-y-auto bg-inverted/10">
			<div className="flex flex-1 flex-col items-center gap-md py-4">
				<img
					src={logo}
					alt="logo"
					className="mx-auto my-3 w-10 cursor-pointer"
					onClick={() => navigate('/')}
				/>
			</div>

			<div className="flex flex-col gap-sm px-3 py-4">
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							onClick={() => {
								clearAddingFile()
								return navigate('/destinations')
							}}
							size="sm"
							icon
							aria-label="Destination"
						>
							<Folder />
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
							size="sm"
							icon
							aria-label="Settings"
						>
							<Cog />
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
							icon
							size="sm"
							onClick={() => ipcRenderer.send('app-quit')}
							aria-label="Quit App"
						>
							<LogOutIcon />
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
