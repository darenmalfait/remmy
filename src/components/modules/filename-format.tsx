import * as React from 'react'
import {Field, Input, Label} from '@nerdfish/ui'

import {useSettings} from '../../context/settings-provider'
import {NamePreview} from '../name-preview'
import {Section} from '../section'
import {FilenameConfiguration} from './filename-configuration'

function FilenameFormat() {
  const {settings, updateSetting} = useSettings()

  return (
    <Section>
      <FilenameConfiguration />

      <NamePreview
        date={new Date()}
        description="example document"
        extension="pdf"
        detail="example detail"
      />

      <Field>
        <Label>
          Text separator
          <Input
            name="textSeparator"
            onChange={event => {
              updateSetting('textSeparator', event.target.value)
            }}
            defaultValue={settings.textSeparator}
          />
        </Label>
      </Field>

      <Field>
        <Label>
          Default separator
          <Input
            name="defaultSeparator"
            defaultValue={settings.defaultSeparator}
            onChange={event => {
              updateSetting('defaultSeparator', event.target.value)
            }}
          />
        </Label>
      </Field>
    </Section>
  )
}

export {FilenameFormat}
