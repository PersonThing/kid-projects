import { gridSize } from './Constants'

export function migrateLevel(level) {
	if (level.blocks.some(b => b.x != null) === true) {
		level.blocks = level.blocks.map(b => [b.name, b.x / gridSize, b.y / gridSize])
	}
	if (level.enemies.some(e => e.x != null) === true) {
		level.enemies = level.enemies.map(e => [e.name, e.x / gridSize, e.y / gridSize])
	}
	return level
}

export function migrateCharacter(character) {
	if (character.followers == null) character.followers = []
	return character
}
