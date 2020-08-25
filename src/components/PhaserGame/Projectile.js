import getAnimationKey from './GetAnimationKey'
import gravityPixelsPerSecond from './Gravity'

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, art, velocity, gravityMultiplier, target) {
		super(scene, x, y, art.name)

		// TODO: sounds like best practice is to create a group and reuse sprites rather than creating them on the fly
		scene.add.existing(this)
		scene.physics.add.existing(this)

		scene.physics.moveToObject(this, target, velocity)

		// this.setVelocityX(vx)
		// this.flipX = vx < 0
		// this.setVelocityY(vy)
		this.setGravityY(-gravityPixelsPerSecond + gravityPixelsPerSecond * gravityMultiplier)

		// use animation
		if (art.animated) {
			// console.log('animating projectile art')
			this.anims.play(getAnimationKey(art.name), true)
		}
	}

	preUpdate() {
		// angle based on velocity
		this.rotation = this.body.velocity.angle()

		// remove if it goes off screen
		if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
			this.destroy()
		}
	}
}
