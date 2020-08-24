import LivingSprite from './LivingSprite'

export default class Player extends LivingSprite {
	constructor(scene, x, y, texture, template, inputs) {
		super(scene, x, y, texture, template)

		this.inputs = inputs

		// TODO: let me jump through bottom of blocks?

		// TODO: ditch when abilities are in place
		this.spinning = false
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)

		// jumping
		if (this.body.touching.down || this.template.canFly) {
			if (Phaser.Input.Keyboard.JustDown(this.inputs.spacebarKey)) this.setVelocityY(-this.template.jumpVelocity)
		}

		// moving left
		if (this.inputs.cursors.left.isDown && !this.inputs.cursors.right.isDown) {
			const newVelocity =
				this.body.touching.down || this.template.canFly
					? -this.template.maxVelocity
					: Math.max(this.body.velocity.x - this.template.maxVelocity / 15, -this.template.maxVelocity)
			this.setVelocityX(newVelocity)
			this.flipX = true
			this.setGraphic(this.spinning ? 'spinning' : 'moving')
		} else if (this.inputs.cursors.right.isDown && !this.inputs.cursors.isDown) {
			// moving right
			const newVelocity =
				this.body.touching.down || this.template.canFly
					? this.template.maxVelocity
					: Math.min(this.body.velocity.x + this.template.maxVelocity / 15, this.template.maxVelocity)

			this.setVelocityX(newVelocity)
			this.flipX = false
			this.setGraphic(this.spinning ? 'spinning' : 'moving')
		} else if (this.body.touching.down) {
			// stop if touching ground
			this.setVelocityX(0)
			this.setGraphic(this.spinning ? 'spinning' : 'still')
		}

		// r key to spin
		if (Phaser.Input.Keyboard.JustDown(this.inputs.rKey) && this.template.canSpin) {
			this.spinning = true
		} else if (Phaser.Input.Keyboard.JustUp(this.inputs.rKey)) {
			this.spinning = false
		}

		if (this.spinning) {
			this.setAngularVelocity(1080 * (this.body.velocity.x < 0 ? -1 : 1))
		} else {
			// rotate player based on y velocity
			this.setAngularVelocity(0)
			this.setRotation((this.body.velocity.y / 1800) * (this.body.velocity.x < 0 ? -1 : 1))
		}
	}
}
