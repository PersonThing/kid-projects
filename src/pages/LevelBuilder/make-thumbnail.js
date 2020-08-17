export default function makeThumbnail(srcCanvas, width, height) {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height

	const context = canvas.getContext('2d')
	context.drawImage(srcCanvas, 0, 0, width, height)

	return canvas.toDataURL('image/png')
}
