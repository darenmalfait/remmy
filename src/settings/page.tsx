import {
	Button,
	H2,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@nerdfish/ui'
import { ipcRenderer, shell } from 'electron'
import * as React from 'react'
import { Layout } from '../components/layout'
import { FilenameFormat } from '../components/modules/filename-format'
import { Section } from '../components/section'
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
			<H2>About Remmy</H2>
			<p>
				Remmy is a simple file manager that allows you to move files from one
				location to another, renaming them in the process.
			</p>
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
						<H2 variant="primary">Appearance</H2>
						<AppearanceForm />
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
