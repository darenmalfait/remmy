import * as React from 'react'
import {cx} from '@daren/ui-components'
import {ArrowLeftIcon} from '@heroicons/react/24/solid'
import {useNavigate} from 'react-router-dom'

import {useFileUpload} from '../context/file-upload-provider'

function Layout({
  className,
  children,
  title,
  ...props
}: JSX.IntrinsicElements['div'] & {
  title?: string
}) {
  const navigate = useNavigate()
  const {addingFile} = useFileUpload()

  React.useEffect(() => {
    //if current path is not root
    if (addingFile && window.location.pathname !== '/') {
      navigate('/')
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
            <ArrowLeftIcon className="h-5 w-5 hover:text-gray-400" />
          </button>

          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      ) : null}

      <div>{children}</div>
    </div>
  )
}

export {Layout}
