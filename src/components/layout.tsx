import { cx } from '@nerdfish/utils'
import { ArrowLeft } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { useFileUpload } from '../context/file-upload-provider'

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
					<button
						className="focus:outline-none"
						aria-label="Go Back"
						onClick={() => navigate('/')}
					>
						<ArrowLeft className="h-5 w-5 hover:text-foreground-muted" />
					</button>

					<h3 className="text-lg font-semibold">{title}</h3>
				</div>
			) : null}

			<div>{children}</div>
		</div>
	)
}

export { Layout }
