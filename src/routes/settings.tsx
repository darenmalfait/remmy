import * as React from 'react'
import {Alert, Checkbox, Input, Tabs} from '@nerdfish/ui'
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
        <Tabs.List>
          <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
          <Tabs.Trigger value="files">Files</Tabs.Trigger>
          <Tabs.Trigger value="about">About</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="appearance">
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
        </Tabs.Content>
        <Tabs.Content value="files">
          <Section>
            <h2>Format</h2>
            <FilenameFormat />
            <h2>Document analysis</h2>
            <Checkbox
              name="ocrEnabled"
              label="Enable file analysis"
              checked={settings.ocrEnabled}
              onChange={event =>
                updateSetting('ocrEnabled', event.target.checked)
              }
            />
            {settings.ocrEnabled ? (
              <>
                <Checkbox
                  name="vatLookupEnabled"
                  label="Lookup VAT numbers"
                  checked={settings.vatLookupEnabled}
                  onChange={event =>
                    updateSetting('vatLookupEnabled', event.target.checked)
                  }
                />

                {settings.vatLookupEnabled ? (
                  <Input
                    name="ownVatNumber"
                    label="Your VAT Number"
                    value={settings.ownVatNumber}
                    onChange={event =>
                      updateSetting('ownVatNumber', event.target.value)
                    }
                  />
                ) : null}

                <Alert
                  variant="info"
                  description="Automatically look up a VAT number to identify the company it belongs to. Entering your own VAT number on an invoice helps ensure Remmy takes the correct one."
                />
              </>
            ) : null}
          </Section>
        </Tabs.Content>
        <Tabs.Content value="about">
          <About />
        </Tabs.Content>
      </Tabs>
    </Layout>
  )
}

export {SettingsRoute}
