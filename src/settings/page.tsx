import { H2, Tabs, TabsContent, TabsList, TabsTrigger } from '@nerdfish/ui'
import { ipcRenderer } from 'electron'
import * as React from 'react'
import { Layout } from '../components/layout'
import { About } from '../components/modules/about'
import { FilenameFormat } from '../components/modules/filename-format'
import { Section } from '../components/section'
import { setAppearance } from '../lib/utils/appearance'
import { Appearance } from '../types'
import { AppearanceForm } from './forms/appearance-form'
import { FileAnalysisForm } from './forms/file-analysis-form'
import { useSettings } from './settings-provider'

function SettingsPage() {
	const { settings, updateSetting } = useSettings()

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
				<TabsContent value="appearance" className="bg-transparent">
					<Section>
						<H2 variant="primary">Appearance</H2>
						<AppearanceForm
							onUpdate={(values) => {
								updateSetting('appearance', values.appearance)
							}}
						/>
					</Section>
				</TabsContent>
				<TabsContent value="files" className="bg-transparent">
					<div className="space-y-xl">
						<Section>
							<H2 variant="primary">Filename format</H2>
							<FilenameFormat />
						</Section>
						<Section>
							<H2 variant="primary">Document analysis</H2>
							<FileAnalysisForm
								initialValues={{
									ocrEnabled: settings.ocrEnabled,
									vatLookupEnabled: settings.vatLookupEnabled,
									ownVatNumber: settings.ownVatNumber,
								}}
								onUpdate={(values) => {
									updateSetting('ocrEnabled', values.ocrEnabled)
									updateSetting('vatLookupEnabled', values.vatLookupEnabled)
									updateSetting('ownVatNumber', values.ownVatNumber)
								}}
							/>
						</Section>
					</div>
				</TabsContent>
				<TabsContent value="about" className="bg-transparent">
					<About />
				</TabsContent>
			</Tabs>
		</Layout>
	)
}

export { SettingsPage }
