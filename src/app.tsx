import { Toaster } from '@nerdfish/ui'
import { cx } from '@nerdfish/utils'
import * as React from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Sidebar } from './components/sidebar'
import { AppProviders } from './context/app-provider'
import { IndexRoute } from './routes'
import { DestinationsRoute } from './routes/destinations'
import { SettingsRoute } from './routes/settings'

export const App = () => {
	return (
		<AppProviders>
			<Router>
				<div className={cx('flex h-full flex-col bg-background pl-14')}>
					<Sidebar />

					<div className="relative h-screen overflow-y-auto text-foreground">
						<Routes>
							<Route path="/" element={<IndexRoute />} />
							<Route path="/settings" element={<SettingsRoute />} />
							<Route path="/destinations" element={<DestinationsRoute />} />
						</Routes>
						<Toaster />
					</div>
				</div>
			</Router>
		</AppProviders>
	)
}
