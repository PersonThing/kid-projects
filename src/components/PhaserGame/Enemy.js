import LivingSprite from './LivingSprite'

export default class Enemy extends LivingSprite {
	constructor(scene, x, y, texture, template, player, leashRange = 400) {
		super(scene, x, y, texture, template)
		this.target = player
		this.leashRange = leashRange
		this.moving = false
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)

		// move toward player if within leashRange
		if (Math.abs(this.target.x - this.x) < this.leashRange) {
			if (Math.abs(this.target.x - this.x) < 2) this.setVelocityX(0)
			else if (this.target.x < this.x) {
				this.setVelocityX(-this.template.maxVelocity)
				this.flipX = true
			} else {
				this.setVelocityX(this.template.maxVelocity)
				this.flipX = false
			}

			if ((this.body.touching.down || this.template.canFly) && this.target.y < this.y - this.height) {
				this.setVelocityY(-this.template.jumpVelocity)
			}

			if (!this.moving) {
				this.setGraphic('moving')
				this.moving = true
			}
		} else {
			this.setVelocityX(0)
			if (this.moving) {
				this.setGraphic('still')
				this.moving = false
			}
		}
	}

	damage(amount) {
		super.damage(amount)

		if (!this.alive) {
			this.disableBody(true, true)
			this.hp.remove()
		}
	}
}
