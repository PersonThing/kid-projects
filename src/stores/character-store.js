import LocalStorageStore from './local-storage-store'
export default LocalStorageStore('characters', {
	'mr squiggles': {
		graphicStill: 'mr squiggles',
		graphicSpinning: 'mr squiggles spin',
		motionGraphics: ['mr squiggles move 1', 'mr squiggles move 2', 'mr squiggles move 3', 'mr squiggles move 4', 'mr squiggles move 5'],
		framesPerGraphic: 2,
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
		canFireProjectiles: true,
		projectileDamage: 50,
		projectileYStart: 25,
		projectileVelocity: 20,
		projectileGravityMultiplier: 0.1,
		spinSpeed: 20,
		graphicProjectile: 'fireball',
	},
})
