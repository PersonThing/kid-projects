import LocalStorageStore from './local-storage-store'
export default LocalStorageStore('characters', {
	'mr squiggles': {
		graphicStill: 'mr squiggles',
		graphicSpinning: 'mr squiggles spin',
		motionGraphics: ['mr squiggles move 1', 'mr squiggles move 2', 'mr squiggles move 3'],
		framesPerGraphic: 6,
		name: 'mr squiggles',
		maxHealth: 200,
		maxVelocity: 5,
		jumpVelocity: 15,
		gravityMultiplier: 1,
		fallDamageMultiplier: 1,
		dps: 250,
		canFly: false,
		canSpin: true,
		spinDegreesPerFrame: 15,
		spinSpeed: 20,
	},
})
