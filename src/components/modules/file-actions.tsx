import * as React from 'react'
import {Button, Field, SelectField} from '@daren/ui-components'

import {useDestinations} from '../../context/destinations-provider'
import {useSettings} from '../../context/settings-provider'
import {moveFile} from '../../lib/utils/file'
import {useSubmit} from '../../lib/utils/form'
import {addTrailingSlash, rename, transformName} from '../../lib/utils/string'
import {NamePreview} from '../name-preview'
import {Section} from '../section'

interface FileActionsProps {
  file: string
  date?: Date
  description?: string
  detail?: string
  onMove?: (file: string, newLocation: string) => void
}

function FileActions({
  file,
  date,
  description,
  detail,
  onMove,
}: FileActionsProps) {
  const {destinations} = useDestinations()
  const {settings} = useSettings()

  const extension = file.split('.').slice(-1).join('.')
  const oldFilename = file
    .split('/')
    .slice(-1)
    .join('')
    .replace(`.${extension}`, '')
    .replace(transformName(date?.toISOString().split('T')[0] ?? ''), '')

  const [values, setValues] = React.useReducer(
    function reducer(state: FileActionsProps, newState: FileActionsProps) {
      return {...state, ...newState}
    },
    {
      file,
      date: date ?? new Date(),
      description: description ?? transformName(oldFilename),
      detail,
    },
  )
  const [destination, setDestination] = React.useState<string>(
    destinations.find(d => d.isDefault)?.id ?? destinations[0].id,
  )
  const {result, getFormValues} = useSubmit<{
    status: 'success' | 'error'
    errors?: {
      [key in keyof FileActionsProps]?: string
    }
  }>()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formValues = getFormValues(event.currentTarget)

    const dest = destinations.find(d => d.id === formValues.destination)?.path

    if (!destination) {
      return
    }

    const newLocation = `${addTrailingSlash(dest ?? '')}${rename({
      extension,
      date: new Date(formValues.date),
      description: formValues.description,
      detail: formValues.detail,
      separator: settings.nameDetailSeparator,
      sectionSeparator: settings.nameSectionSeparator,
    })}`

    const ok = moveFile(file, newLocation)

    if (!ok) {
      console.error('Could not move file')
      return
    }

    onMove?.(file, newLocation)
  }

  async function onFormChange(event: React.FormEvent<HTMLFormElement>) {
    const formValues = getFormValues(event.currentTarget)

    setValues({...formValues, date: new Date(formValues.date)})
  }

  return (
    <Section>
      <form noValidate onSubmit={handleSubmit} onChange={onFormChange}>
        <fieldset className="space-y-4">
          <Field
            name="date"
            error={result?.errors?.date}
            defaultValue={values.date?.toISOString().split('T')[0]}
            type="date"
            label="Date"
          />
          <Field
            name="description"
            defaultValue={values.description}
            type="text"
            label="Description"
          />
          <Field
            name="detail"
            defaultValue={detail}
            type="text"
            label="Detail"
          />
          <SelectField
            name="destination"
            label="Destination"
            defaultValue={destination}
            onChange={id => setDestination(id ?? '')}
            items={destinations.map(d => ({
              label: `${d.name}`,
              value: d.id,
            }))}
          />

          <NamePreview
            extension={extension}
            description={values.description}
            detail={values.detail}
            date={values.date}
          />

          <Button>Save</Button>
        </fieldset>
      </form>
    </Section>
  )
}

export {FileActions}
