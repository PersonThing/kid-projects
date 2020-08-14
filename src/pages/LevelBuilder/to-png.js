const pngScale = 2
export default function toPNG(data, width, height) {
	const canvas = document.createElement('canvas')
	canvas.width = width * pngScale
	canvas.height = height * pngScale
	const ctx = canvas.getContext('2d')
	for (let y = 0; y < data.length; y++) {
		for (let x = 0; x < data.length; x++) {
			const color = data[y][x]
			if (color == null || color == 'transparent') continue

			ctx.beginPath()
			ctx.rect(x * pngScale, y * pngScale, pngScale, pngScale)
			ctx.fillStyle = color
			ctx.fill()
		}
	}

	return canvas.toDataURL('image/png')
}
