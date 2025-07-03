import { rename, type RenameProps } from '../utils'

export function FilenamePreview(props: RenameProps) {
	return (
		<div className="rounded-base bg-background-info-muted/50 p-md text-foreground">
			<p className="m-0">Your file will look like this:</p>
			<code className="text-foreground">{rename(props)}</code>
		</div>
	)
}
