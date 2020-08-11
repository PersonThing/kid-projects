export const BlockColors = {
	Green: 'rgb(8,95,8)',
	Grey: '#666',
	White: '#fff',
}

export function floater(x, y, width, height, color, interactive = true) {
	return {
		x,
		y,
		width,
		height,
		color,
		interactive,
	}
}

export function levelToBlocks(level, blockSize) {
	const b = []
	for (let x = 0; x < level.data.length; x++) {
		for (let y = 0; y < level.data[x].length; y++) {
			// todo should be objects allowing different block types and config, not just 0 or 1
			if (level.data[x][y])
				b.push(
					floater(x * blockSize, y * blockSize, blockSize, blockSize, level.data[x][y], true)
					// floater(x + 20, y, blockSize, true, BlockColors.Green)
				)
		}
	}
	return b
}

// // deprecated
// export default function generateBlocks(size, mapWidthInBlocks) {
// 	const generatedBlocks = []
// 	for (let x = 0; x < mapWidthInBlocks; x++) {
// 		const y = getRandomInt(4)
// 		// floater random height above filled
// 		generatedBlocks.push(floater(x, y + getRandomInt(10), size, true, Colors.Grey))

// 		// filled to random height
// 		generatedBlocks.push(filled(x, y, size))

// 		// clouds every 8 x
// 		if (x % 8 == 0) {
// 			const cy = x % 3 == 0 ? 13 : 14
// 			generatedBlocks.push(floater(x, cy, size, false, Colors.White))
// 			generatedBlocks.push(floater(x + 1, cy, size, false, Colors.White))
// 			generatedBlocks.push(floater(x + 2, cy, size, false, Colors.White))
// 			generatedBlocks.push(floater(x + 1, cy + 1, size, false, Colors.White))
// 			if (x % 3 == 0) generatedBlocks.push(floater(x + 3, cy, size, false, Colors.White))
// 		}
// 	}

// 	return generatedBlocks
// }
