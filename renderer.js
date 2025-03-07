const { ipcRenderer } = require('electron')
const { webUtils } = require('electron')

document.addEventListener('dragover', (e) => {
	e.preventDefault()
	e.stopPropagation()
})

document.addEventListener('drop', (event) => {
	event.preventDefault()
	event.stopPropagation()

	const pathArr = []
	for (const f of event.dataTransfer.files) {
		const path = webUtils.getPathForFile(f)
		pathArr.push(path) // assemble array for main.js
	}

	ipcRenderer.send('dropped-file', pathArr)
})
