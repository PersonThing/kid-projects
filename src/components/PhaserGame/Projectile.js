import getAnimationKey from './GetAnimationKey'
import gravityPixelsPerSecond from './Gravity'

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, art, velocity, range, passThroughBlocks, target) {
		super(scene, x, y, art.name)

		// make sure it doesn't travel past range

		// TODO: sounds like best practice is to create a group and reuse sprites rather than creating them on the fly
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// collide with blocks unless told not to
		if (!passThroughBlocks) scene.physics.add.collider(this, scene.simpleBlocksGroup, () => this.onBlockCollision())

		// move toward target
		scene.physics.moveToObject(this, target, velocity)

		// this.setVelocityX(vx)
		// this.flipX = vx < 0
		// this.setVelocityY(vy)
		this.body.setAllowGravity(false)
		// this.setGravityY(-gravityPixelsPerSecond + gravityPixelsPerSecond * gravityMultiplier)

		// use animation
		if (art.animated) {
			// console.log('animating projectile art')
			this.anims.play(getAnimationKey(art.name), true)
		}

		this.range = range
		this.origin = {
			x,
			y,
		}
	}

	preUpdate() {
		// angle based on velocity
		this.rotation = this.body.velocity.angle()

		if (
			// past ability range
			Phaser.Math.Distance.Between(this.x, this.y, this.origin.x, this.origin.y) > this.range ||
			// out of world
			!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())
		) {
			this.destroy()
		}
	}

	onBlockCollision() {
		this.destroy()
	}
}
