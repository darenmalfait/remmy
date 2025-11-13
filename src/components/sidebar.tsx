import path from 'path'
import { Button } from '@nerdfish/react/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@nerdfish/react/tooltip'
import { ipcRenderer } from 'electron'
import { Cog, Folder, LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFileUpload } from '../file/file-upload-provider'

const logo = path.join(__dirname, 'assets/images', 'logo.png')

function Sidebar() {
	const navigate = useNavigate()
	const { clearSelectedFile } = useFileUpload()

	return (
		<div className="bg-background-inverted/10 fixed top-0 left-16 z-50 -ml-16 flex h-full w-16 flex-col overflow-y-auto">
			<div className="gap-friends py-friends flex flex-1 flex-col items-center">
				<img
					src={logo}
					alt="logo"
					className="my-best-friends mx-auto w-10 cursor-pointer"
					onClick={() => navigate('/')}
				/>
			</div>

			<TooltipProvider>
				<div className="gap-best-friends px-best-friends py-friends flex flex-col items-center justify-center">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="ghost"
									onClick={() => {
										clearSelectedFile()
										return navigate('/destinations')
									}}
									size="sm"
									icon
									aria-label="Destination"
								>
									<Folder />
								</Button>
							}
						/>
						<TooltipContent side="right">
							<p>Destinations</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="ghost"
									onClick={() => {
										clearSelectedFile()
										return navigate('/settings')
									}}
									size="sm"
									icon
									aria-label="Settings"
								>
									<Cog />
								</Button>
							}
						/>
						<TooltipContent side="right">
							<p>Settings</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="ghost"
									icon
									size="sm"
									onClick={() => ipcRenderer.send('app-quit')}
									aria-label="Quit App"
								>
									<LogOutIcon />
								</Button>
							}
						/>
						<TooltipContent side="right">
							<p>Quit Remmy</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</TooltipProvider>
		</div>
	)
}

export { Sidebar }
