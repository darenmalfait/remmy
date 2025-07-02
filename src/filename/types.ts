import { z } from 'zod'

export const filenameConfigurationSchema = z.object({
	id: z.string(),
	type: z.enum(['date', 'detail', 'description', 'separator']),
	value: z.string(),
	options: z.array(z.string()).optional(),
})

export const filenameFormatSchema = z.object({
	id: z.string(),
	name: z.string(),
	filenameConfiguration: z.array(filenameConfigurationSchema),
	inTextSeparator: z.string(),
	isDefault: z.boolean().optional(),
})

export type FilenameConfiguration = z.infer<typeof filenameConfigurationSchema>
export type FilenameFormat = z.infer<typeof filenameFormatSchema>
