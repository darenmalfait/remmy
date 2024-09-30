import * as React from 'react'
import {
  Alert,
  Checkbox,
  Field,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@nerdfish/ui'
import {ipcRenderer} from 'electron'

import {Layout} from '../components/layout'
import {About} from '../components/modules/about'
import {FilenameFormat} from '../components/modules/filename-format'
import {RadioGroup} from '../components/radio-group'
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
        <TabsContent
          value="appearance"
          className="shadow-outline bg-transparent"
        >
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
        <TabsContent value="files" className="shadow-outline bg-transparent">
          <Section>
            <h2>Format</h2>
            <FilenameFormat />
            <h2>Document analysis</h2>
            <Field className="flex items-center">
              <Checkbox
                id="ocrEnabled"
                name="ocrEnabled"
                checked={settings.ocrEnabled}
                onChange={event =>
                  updateSetting('ocrEnabled', event.target.checked)
                }
              />
              <Label className="flex items-center pl-2" htmlFor="ocrEnabled">
                Enable file analysis
              </Label>
            </Field>
            {settings.ocrEnabled ? (
              <>
                <Field className="flex items-center">
                  <Checkbox
                    id="vatLookupEnabled"
                    name="vatLookupEnabled"
                    checked={settings.vatLookupEnabled}
                    onChange={event =>
                      updateSetting('vatLookupEnabled', event.target.checked)
                    }
                  />
                  <Label
                    className="flex items-center pl-2"
                    htmlFor="vatLookupEnabled"
                  >
                    Lookup VAT numbers
                  </Label>
                </Field>

                {settings.vatLookupEnabled ? (
                  <Field>
                    <Label>
                      Your VAT Number
                      <Input
                        name="ownVatNumber"
                        value={settings.ownVatNumber}
                        onChange={event =>
                          updateSetting('ownVatNumber', event.target.value)
                        }
                      />
                    </Label>
                  </Field>
                ) : null}

                <Alert
                  variant="info"
                  description="Automatically look up a VAT number to identify the company it belongs to. Entering your own VAT number on an invoice helps ensure Remmy takes the correct one."
                />
              </>
            ) : null}
          </Section>
        </TabsContent>
        <TabsContent value="about" className="shadow-outline bg-transparent">
          <About />
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

export {SettingsRoute}
