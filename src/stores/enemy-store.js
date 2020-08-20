import LocalStorageStore from './local-storage-store'
export default LocalStorageStore('enemies', {
	'mr smiley': {
		graphicStill: 'mr smiley',
		name: 'mr smiley',
		maxVelocity: 3,
		jumpVelocity: 12,
		gravityMultiplier: 1,
		fallDamageMultiplier: 1,
		dps: 120,
		dpsToPlayers: 50,
		maxHealth: 1000,
		score: 10,
	},
	alien: {
		graphicStill: 'alien',
		name: 'alien',
		maxVelocity: 5,
		jumpVelocity: 7,
		gravityMultiplier: 1,
		fallDamageMultiplier: 0.5,
		dps: 20,
		dpsToPlayers: 50,
		maxHealth: 100,
		score: 1,
	},
})
