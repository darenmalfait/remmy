import { Button } from '@nerdfish/react/button'
import { cx } from '@nerdfish/utils'
import { XIcon } from 'lucide-react'
import { useEffect, type ComponentProps } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileUpload } from '../file/file-upload-provider'

export function Layout({
	className,
	children,
	title,
	isRoot = false,
	...props
}: ComponentProps<'div'> & {
	title?: string
	isRoot?: boolean
}) {
	const navigate = useNavigate()
	const { selectedFile } = useFileUpload()

	useEffect(() => {
		//if current path is not root
		if (selectedFile && window.location.pathname !== '/') {
			void navigate('/')
		}
	}, [selectedFile, navigate])

	const shouldShowBackButton = !isRoot

	return (
		<div
			className={cx(
				'space-y-friends p-casual flex min-h-screen flex-col',
				className,
			)}
			{...props}
		>
			{title ? (
				<div className="mb-casual flex items-center justify-between">
					<h2 className="typography-title">{title}</h2>

					{shouldShowBackButton ? (
						<Button
							variant="ghost"
							icon
							className="-mr-friends"
							aria-label="Go Back"
							onClick={() => navigate('/')}
						>
							<XIcon />
						</Button>
					) : null}
				</div>
			) : null}

			<div className="flex flex-1 flex-col">{children}</div>
		</div>
	)
}
