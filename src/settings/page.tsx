import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@nerdfish/ui'
import { ipcRenderer, shell } from 'electron'
import * as React from 'react'
import { Layout } from '../components/layout'
import { Section } from '../components/section'
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
			<Card>
				<CardHeader>
					<CardTitle>About Remmy</CardTitle>
					<CardDescription>
						Remmy is a simple file manager that allows you to move files from
						one location to another, renaming them in the process.
					</CardDescription>
				</CardHeader>
				<CardContent>
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
				</CardContent>
			</Card>
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
				<TabsList className="mb-lg">
					<TabsTrigger value="appearance">Appearance</TabsTrigger>
					<TabsTrigger value="files">Files</TabsTrigger>
					<TabsTrigger value="about">About</TabsTrigger>
				</TabsList>
				<TabsContent value="appearance" className="bg-transparent">
					<Section>
						<Card>
							<CardHeader>
								<CardTitle>Appearance</CardTitle>
								<CardDescription>Change the way the app looks</CardDescription>
							</CardHeader>
							<CardContent>
								<AppearanceForm />
							</CardContent>
						</Card>
					</Section>
				</TabsContent>
				<TabsContent value="files" className="bg-transparent">
					<div className="space-y-xl">
						<Section>
							<Card>
								<CardHeader>
									<CardTitle>Filename format</CardTitle>
									<CardDescription>
										Customize how your files are named when they are moved.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FilenameFormats />
								</CardContent>
							</Card>
						</Section>
						<Section>
							<Card>
								<CardHeader>
									<CardTitle>Document analysis</CardTitle>
									<CardDescription>
										Configure how Remmy analyzes your documents for better
										organization.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FileAnalysisForm />
								</CardContent>
							</Card>
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
