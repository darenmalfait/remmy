import nerdfishConfig from '@nerdfish/tailwind-config'
import aspectRatio from '@tailwindcss/aspect-ratio'
import typography from '@tailwindcss/typography'
import defaultTheme from 'tailwindcss/defaultTheme'
import { type Config } from 'tailwindcss/types/config'
import animate from 'tailwindcss-animate'

const config: Config = {
	plugins: [
		nerdfishConfig,
		aspectRatio,
		animate,
		typography,
		require('tailwindcss-motion'),
	],
	theme: {
		extend: {
			fontFamily: {
				fallback: [...defaultTheme.fontFamily.sans],
				sans: ['Geist Sans', ...defaultTheme.fontFamily.sans],
				title: ['Geist Sans', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				twitter: '#1DA1F2',
				github: '#24292e',
				gray: {
					100: 'var(--color-gray-100)',
					200: 'var(--color-gray-200)',
					300: 'var(--color-gray-300)',
					400: 'var(--color-gray-400)',
					500: 'var(--color-gray-500)',
					600: 'var(--color-gray-600)',
					700: 'var(--color-gray-700)',
					800: 'var(--color-gray-800)',
					900: 'var(--color-gray-900)',
				},
				blog: {
					unknown: 'var(--color-blog-unknown)',
					technical: 'var(--color-blog-technical)',
					project: 'var(--color-blog-project)',
					wiki: 'var(--color-blog-wiki)',
					coaching: 'var(--color-blog-coaching)',
					blog: 'var(--color-blog-blog)',
				},
			},
		},
	},
	darkMode: 'class', // or 'media' or 'class'
	content: [
		'./node_modules/@nerdfish/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,jsx,ts,tsx}',
	],
}

export default config
