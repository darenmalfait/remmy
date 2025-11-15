import { Toaster } from '@nerdfish/react/toast'
import { cx } from '@nerdfish/utils'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { AppProviders } from './app-provider'
import { Sidebar } from './components/sidebar'
import { DestinationsPage } from './destinations/page'
import { HomePage } from './page'
import { SettingsPage } from './settings/page'

export function App() {
	return (
		<AppProviders>
			<Router>
				<div className={cx('bg-background isolate flex h-full flex-col pl-14')}>
					<Sidebar />

					<div className="text-foreground relative h-screen overflow-y-auto">
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
