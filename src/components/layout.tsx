import { Button } from '@nerdfish/ui'
import { cx } from '@nerdfish/utils'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileUpload } from '../file-rename/file-upload-provider'

function Layout({
	className,
	children,
	title,
	...props
}: React.ComponentProps<'div'> & {
	title?: string
}) {
	const navigate = useNavigate()
	const { addingFile } = useFileUpload()

	React.useEffect(() => {
		//if current path is not root
		if (addingFile && window.location.pathname !== '/') {
			void navigate('/')
		}
	}, [addingFile, navigate])

	return (
		<div className={cx('flex flex-col space-y-4 p-8', className)} {...props}>
			{title ? (
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">{title}</h3>

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
