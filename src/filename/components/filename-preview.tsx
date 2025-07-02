import { rename, type RenameProps } from '../utils'

export function FilenamePreview(props: RenameProps) {
	return (
		<div className="rounded-base border border-muted bg-background-muted p-md">
			<p className="m-0">Your file will look like this:</p>
			<code className="text-foreground">{rename(props)}</code>
		</div>
	)
}
