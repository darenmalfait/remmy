import fs from 'fs'
import path from 'path'

export function moveFile(from: string, to: string) {
	const fromPath = path.resolve(from)
	const toPath = path.resolve(to)

	if (!fs.existsSync(fromPath)) {
		console.error('File source does not exist')
		return false
	}

	const toPathFolder = path.dirname(toPath)
	if (!fs.existsSync(toPathFolder)) {
		console.error('File destination does not exist')
		return false
	}

	fs.rename(fromPath, toPath, (error) => {
		if (error) {
			console.error(error.message)
			return false
		}
	})

	return true
}
