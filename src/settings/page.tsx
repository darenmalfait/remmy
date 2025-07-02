import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@nerdfish/ui'
import { ipcRenderer, shell } from 'electron'
import * as React from 'react'
import { Layout } from '../components/layout'
import {
	Section,
	SectionHeader,
	SectionHeaderTitle,
	SectionHeaderSubtitle,
} from '../components/section'
import { FilenameFormats } from '../filename/components/filename-formats'
import { AppearanceForm } from './forms/appearance-form'
import { FileAnalysisForm } from './forms/file-analysis-form'
import { useSettings } from './settings-provider'
import { Appearance } from './types'
import { setAppearance } from './utils'

function About() {
	const navigateTo = React.useCallback(async (src: string) => {
		await shell.openExternal(src)
	}, [])

	return (
		<Section>
			<SectionHeader>
				<SectionHeaderTitle>About Remmy</SectionHeaderTitle>
				<SectionHeaderSubtitle>
					Remmy is a simple file manager that allows you to move files from one
					location to another, renaming them in the process.
				</SectionHeaderSubtitle>
			</SectionHeader>

			<ul>
				<li>
					Created by
					<Button
						variant="link"
						onClick={() => navigateTo('https://nerdfish.be')}
					>
						Nerdfish
					</Button>
				</li>
				<li>
					Follow me on{' '}
					<Button
						variant="link"
						onClick={() => navigateTo('https://twitter.com/darenmalfait')}
					>
						Twitter
					</Button>
				</li>
			</ul>
		</Section>
	)
}

export function SettingsPage() {
	const { settings } = useSettings()

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
						<SectionHeader>
							<SectionHeaderTitle>Appearance</SectionHeaderTitle>
							<SectionHeaderSubtitle>
								Change the way the app looks
							</SectionHeaderSubtitle>
						</SectionHeader>

						<AppearanceForm />
					</Section>
				</TabsContent>
				<TabsContent value="files" className="bg-transparent">
					<div className="space-y-xl">
						<Section>
							<SectionHeader>
								<SectionHeaderTitle>Filename format</SectionHeaderTitle>
								<SectionHeaderSubtitle>
									Customize how your files are named when they are moved.
								</SectionHeaderSubtitle>
							</SectionHeader>

							<FilenameFormats />
						</Section>
						<Section>
							<SectionHeader>
								<SectionHeaderTitle>Document analysis</SectionHeaderTitle>
								<SectionHeaderSubtitle>
									Configure how Remmy analyzes your documents for better
									organization.
								</SectionHeaderSubtitle>
							</SectionHeader>

							<FileAnalysisForm />
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
