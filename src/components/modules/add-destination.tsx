import * as React from 'react'
import {Button, Field, Spinner} from '@daren/ui-components'
import * as remote from '@electron/remote'
import {FolderIcon} from '@heroicons/react/24/solid'

import {
  Destination,
  DestinationActionResult,
  useDestinations,
} from '../../context/destinations-provider'
import {Section} from '../section'

function AddDestination({
  onSave,
}: {
  onSave?: (destination: Pick<Destination, 'name' | 'path'>) => void
}) {
  const [selectingFolder, setSelectingFolder] = React.useState<boolean>(false)
  const [path, setPath] = React.useState<string>('')
  const [name, setName] = React.useState<string>('')

  const {addDestination} = useDestinations()

  const [error, setError] = React.useState<DestinationActionResult['error']>()

  function handleSave() {
    const result = addDestination({name, path})

    if (result.status === 'success') {
      onSave?.({
        name,
        path,
      })

      setPath('')
      setName('')
    } else if (result.status === 'error') {
      setError(result.error)
    }
  }

  async function onFolderSelect() {
    setSelectingFolder(true)
    remote.app.focus()

    await remote.dialog
      .showOpenDialog({
        filters: [],
        properties: ['openDirectory'],
      })
      .then(result => {
        if (result.canceled) return

        if (result.filePaths.length > 0) {
          setPath(result.filePaths[0])
        }
      })
      .catch((err: any) => {
        console.error(err)
      })

    setSelectingFolder(false)
    remote.app.focus()
  }

  return (
    <Section>
      <p>
        Enter the path to the destination.
        <br />
        For example,{' '}
        <code className="text-primary">/Users/daren/Downloads</code>
      </p>
      <div className="space-y-4">
        <Field
          inputSize="sm"
          label="Alias"
          value={name}
          error={error?.name}
          onChange={e => setName(e.target.value)}
          name="new-destination-name"
        />
        <div className="flex items-end space-x-2">
          <Field
            icon={FolderIcon}
            inputSize="sm"
            label="Path"
            error={error?.path}
            value={path}
            onChange={e => setPath(e.target.value)}
            name="new-destination-path"
          >
            <Button size="sm" onClick={onFolderSelect}>
              {selectingFolder ? <Spinner size="sm" /> : 'Browse'}
            </Button>
          </Field>
        </div>
        <Button size="sm" onClick={handleSave}>
          Save destination
        </Button>
      </div>
    </Section>
  )
}

export {AddDestination}
