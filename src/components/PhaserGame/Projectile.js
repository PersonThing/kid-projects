export default class Projectile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, velocity, target) {
		super(scene, x, y, texture)

		// TODO: consider reusing stuff somehow rather than creating/destroying ad-hoc
		scene.add.existing(this)
		scene.physics.add.existing(this)

		scene.physics.moveToObject(this, target, velocity)
		var angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y)
		this.setAngle(angle)

		// this.setVelocityX(vx)
		// this.flipX = vx < 0
		// this.setVelocityY(vy)

		// TODO: get gravity multiplier working
		this.body.setAllowGravity(false)
		// this.setGravityY(1000)
		// this.setGravityY(0) //gravity * ability.projectileGravityMultiplier)
	}

	preUpdate() {
		// remove if it goes off screen
		if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
			this.destroy()
		}
	}
}
