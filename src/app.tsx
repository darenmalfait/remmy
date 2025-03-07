import { Toaster } from '@nerdfish/ui'
import { cx } from '@nerdfish/utils'
import * as React from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { AppProviders } from './app-provider'
import { Sidebar } from './components/sidebar'
import { DestinationsPage } from './destinations/page'
import { HomePage } from './page'
import { SettingsPage } from './settings/page'

export const App = () => {
	return (
		<AppProviders>
			<Router>
				<div className={cx('flex h-full flex-col bg-background pl-14')}>
					<Sidebar />

					<div className="relative h-screen overflow-y-auto text-foreground">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/settings" element={<SettingsPage />} />
							<Route path="/destinations" element={<DestinationsPage />} />
						</Routes>
						<Toaster />
					</div>
				</div>
			</Router>
		</AppProviders>
	)
}
