import * as React from 'react'
import {Input} from '@nerdfish/ui'

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

      <Input
        name="textSeparator"
        label="Text separator"
        onChange={event => {
          updateSetting('textSeparator', event.target.value)
        }}
        defaultValue={settings.textSeparator}
      />
      <Input
        name="defaultSeparator"
        label="Default separator"
        defaultValue={settings.defaultSeparator}
        onChange={event => {
          updateSetting('defaultSeparator', event.target.value)
        }}
      />
    </Section>
  )
}

export {FilenameFormat}
