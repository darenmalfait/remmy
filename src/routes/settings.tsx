import * as React from 'react'
import {
  Alert,
  CheckboxField,
  Field,
  RadioGroup,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@daren/ui-components'
import {ipcRenderer} from 'electron'

import {Layout} from '../components/layout'
import {About} from '../components/modules/about'
import {FilenameFormat} from '../components/modules/filename-format'
import {Section} from '../components/section'
import {useSettings} from '../context/settings-provider'
import {setAppearance} from '../lib/utils/appearance'
import {Appearance} from '../types'

function SettingsRoute() {
  const {settings, updateSetting} = useSettings()

  ipcRenderer.on('update-native-theme', (_, updatedAppearance: Appearance) => {
    if (settings.appearance === Appearance.SYSTEM) {
      setAppearance(updatedAppearance)
    }
  })

  return (
    <Layout title="Settings">
      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="appearance">
          <Section>
            <h4 className="font-semibold">Theme</h4>
            <RadioGroup
              name="appearance"
              label="Appearance"
              value={settings.appearance}
              onChange={event => {
                updateSetting('appearance', event)
              }}
            >
              <RadioGroup.Option value={Appearance.SYSTEM} label="System" />
              <RadioGroup.Option value={Appearance.LIGHT} label="Light" />
              <RadioGroup.Option value={Appearance.DARK} label="Dark" />
            </RadioGroup>
          </Section>
        </TabsContent>
        <TabsContent value="files">
          <Section>
            <h2>Format</h2>
            <FilenameFormat />
            <h2>Document analysis</h2>
            <CheckboxField
              name="ocrEnabled"
              label="Enable file analysis"
              checked={settings.ocrEnabled}
              onChange={event =>
                updateSetting('ocrEnabled', event.target.checked)
              }
            />
            {settings.ocrEnabled ? (
              <>
                <CheckboxField
                  name="vatLookupEnabled"
                  label="Lookup VAT numbers"
                  checked={settings.vatLookupEnabled}
                  onChange={event =>
                    updateSetting('vatLookupEnabled', event.target.checked)
                  }
                />

                {settings.vatLookupEnabled ? (
                  <Field
                    name="ownVatNumber"
                    label="Your VAT Number"
                    value={settings.ownVatNumber}
                    onChange={event =>
                      updateSetting('ownVatNumber', event.target.value)
                    }
                  />
                ) : null}

                <Alert
                  type="info"
                  description="VAT number lookup is used to extract the company name from the VAT number. This only works for EU VAT numbers. There might be 2 VAT numbers on an invoice, filling in yours helps not taking the wrong VAT number."
                />
              </>
            ) : null}
          </Section>
        </TabsContent>
        <TabsContent value="about">
          <About />
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

export {SettingsRoute}
