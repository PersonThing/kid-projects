const Colors = {
	Green: 'rgb(8,95,8)',
	Grey: '#666',
	White: '#fff',
}

function floater(x, y, size, interactive = true, color) {
	return {
		x: x * size,
		y: y * size,
		width: size,
		height: size,
		color,
		interactive,
	}
}

function filled(x, y, size, interactive = true, color) {
	return {
		x: x * size,
		y: size * y,
		width: size,
		height: size * y,
		color,
		interactive,
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

export default function generateBlocks(size, mapWidthInBlocks) {
	const generatedBlocks = []
	for (let x = 0; x < mapWidthInBlocks; x++) {
		const y = getRandomInt(4)
		// floater random height above filled
		generatedBlocks.push(floater(x, y + getRandomInt(10), size, true, Colors.Grey))

		// filled to random height
		generatedBlocks.push(filled(x, y, size))

		// clouds every 8 x
		if (x % 8 == 0) {
			const cy = x % 3 == 0 ? 13 : 14
			generatedBlocks.push(floater(x, cy, size, false, Colors.White))
			generatedBlocks.push(floater(x + 1, cy, size, false, Colors.White))
			generatedBlocks.push(floater(x + 2, cy, size, false, Colors.White))
			generatedBlocks.push(floater(x + 1, cy + 1, size, false, Colors.White))
			if (x % 3 == 0) generatedBlocks.push(floater(x + 3, cy, size, false, Colors.White))
		}
	}

	return generatedBlocks
}
