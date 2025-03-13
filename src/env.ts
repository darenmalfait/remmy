import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	clientPrefix: 'CLIENT_',
	server: {
		// server/build
		NOTARIZE: z.string().optional(),
		APPLEID_USERNAME: z.string().optional(),
		APPLEID_PASSWORD: z.string().optional(),
		HOME: z.string().optional(),
		APPDATA: z.string().optional(),
	},
	client: {
		CLIENT_DEBUG: z.string().optional(),
	},
	runtimeEnv: {
		// server/build
		NOTARIZE: process.env.NOTARIZE,
		APPLEID_USERNAME: process.env.APPLEID_USERNAME,
		APPLEID_PASSWORD: process.env.APPLEID_PASSWORD,
		HOME: process.env.HOME,
		APPDATA: process.env.APPDATA,

		// client
		CLIENT_DEBUG: process.env.CLIENT_DEBUG,
	},
})
