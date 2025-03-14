import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	clientPrefix: 'CLIENT_',
	server: {
		// server/build
		NOTARIZE: z.string().optional(),
		APPLEID_USERNAME: z.string().optional(),
		APPLEID_PASSWORD: z.string().optional(),
	},
	client: {
		CLIENT_DEBUG: z.string().optional(),
		CLIENT_HOME: z.string().optional(),
		CLIENT_APPDATA: z.string().optional(),
	},
	runtimeEnv: {
		// server/build
		NOTARIZE: process.env.NOTARIZE,
		APPLEID_USERNAME: process.env.APPLEID_USERNAME,
		APPLEID_PASSWORD: process.env.APPLEID_PASSWORD,

		// client
		DEBUG: process.env.CLIENT_DEBUG,
		HOME: process.env.CLIENT_HOME,
		APPDATA: process.env.CLIENT_APPDATA,
	},
})
