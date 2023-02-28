import * as React from 'react'
import {Field, SelectField} from '@daren/ui-components'

import {useSettings} from '../../context/settings-provider'
import {NamePreview} from '../name-preview'
import {Section} from '../section'

function FilenameFormat() {
  const {settings, updateSetting} = useSettings()

  return (
    <Section>
      <Field
        name="detailSeparator"
        label="Detail separator"
        onChange={event => {
          updateSetting('nameDetailSeparator', event.target.value)
        }}
        defaultValue={settings.nameDetailSeparator}
      />
      <Field
        name="sectionSeparator"
        label="Section separator"
        defaultValue={settings.nameSectionSeparator}
        onChange={event => {
          updateSetting('nameSectionSeparator', event.target.value)
        }}
      />
      <SelectField
        name="dateFormat"
        label="Date format"
        defaultValue={settings.nameDateFormat}
        onChange={value => {
          updateSetting('nameDateFormat', value)
        }}
        items={[
          {
            label: `YYYY${settings.nameDetailSeparator}MM${settings.nameDetailSeparator}DD`,
            value: 'YYYY-MM-DD',
          },
          {
            label: `DD${settings.nameDetailSeparator}MM${settings.nameDetailSeparator}YYYY`,
            value: 'DD-MM-YYYY',
          },
        ]}
      />

      <NamePreview
        date={new Date()}
        description="example document"
        extension="pdf"
      />
    </Section>
  )
}

export {FilenameFormat}
