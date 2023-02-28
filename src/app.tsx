import * as React from 'react'
import {ToastViewport} from '@nerdfish/ui'
import {Route, HashRouter as Router, Routes} from 'react-router-dom'

import {Sidebar} from './components/sidebar'
import {AppProviders} from './context/app-provider'
import {IndexRoute} from './routes'
import {DestinationsRoute} from './routes/destinations'
import {SettingsRoute} from './routes/settings'

export const App = () => {
  return (
    <AppProviders>
      <Router>
        <div className="flex h-full flex-col pl-14 bg-primary">
          <Sidebar />

          <div className="relative h-screen overflow-y-auto text-black dark:text-white">
            <Routes>
              <Route path="/" element={<IndexRoute />} />
              <Route path="/settings" element={<SettingsRoute />} />
              <Route path="/destinations" element={<DestinationsRoute />} />
            </Routes>
            <ToastViewport />
          </div>
        </div>
      </Router>
    </AppProviders>
  )
}
