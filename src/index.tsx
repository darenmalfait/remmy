import * as React from 'react'
import { createRoot } from 'react-dom/client'

import '@nerdfish/theme/dist/nerdfishui.css'
import './styles/main.css'
import './styles/fonts.css'

import { App } from './app'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('remmy')!)

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
