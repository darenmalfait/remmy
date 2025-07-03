import { Button, H2 } from '@nerdfish/ui'
import { cx } from '@nerdfish/utils'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileUpload } from '../file/file-upload-provider'

function Layout({
	className,
	children,
	title,
	...props
}: React.ComponentProps<'div'> & {
	title?: string
}) {
	const navigate = useNavigate()
	const { selectedFile } = useFileUpload()

	React.useEffect(() => {
		//if current path is not root
		if (selectedFile && window.location.pathname !== '/') {
			void navigate('/')
		}
	}, [selectedFile, navigate])

	return (
		<div className={cx('flex flex-col space-y-4 p-8', className)} {...props}>
			{title ? (
				<div className="flex items-center justify-between">
					<H2 variant="primary">{title}</H2>

					<Button
						variant="ghost"
						icon
						className="-mr-md"
						aria-label="Go Back"
						onClick={() => navigate('/')}
					>
						<XIcon />
					</Button>
				</div>
			) : null}

			<div>{children}</div>
		</div>
	)
}

export { Layout }
