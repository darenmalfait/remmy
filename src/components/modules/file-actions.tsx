import * as React from 'react'
import {
  Button,
  DateTimePicker,
  ErrorDescription,
  Field,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
} from '@nerdfish/ui'

import {useDestinations} from '../../context/destinations-provider'
import {useSettings} from '../../context/settings-provider'
import {moveFile} from '../../lib/utils/file'
import {rename} from '../../lib/utils/filename'
import {useSubmit} from '../../lib/utils/form'
import {addTrailingSlash, transformName} from '../../lib/utils/string'
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
      filenameConfiguration: settings.filenameConfiguration,
      textSeparator: settings.textSeparator,
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
          <Field>
            <Label>
              Date
              <DateTimePicker
                defaultValue={values.date}
                onChange={value => setValues({...values, date: value})}
              />
              {result?.errors?.date ? (
                <ErrorDescription>{result.errors.date}</ErrorDescription>
              ) : null}
            </Label>
            <input
              type="hidden"
              name="date"
              value={values.date?.toISOString()}
            />
          </Field>

          <Field>
            <Label>
              Description
              <Input
                name="description"
                defaultValue={values.description}
                type="text"
                label="Description"
              />
            </Label>
          </Field>

          <Field>
            <Label>
              Detail
              <Input
                name="detail"
                defaultValue={values.detail}
                type="text"
                label="Detail"
              />
            </Label>
          </Field>

          <Field>
            <Label>
              Destination
              <Select
                name="destination"
                defaultValue={destination}
                onValueChange={value => setDestination(value)}
              >
                <SelectContent>
                  {destinations.map(d => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>
          </Field>

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
