import LivingSprite from './LivingSprite'

export default class Enemy extends LivingSprite {
	constructor(scene, x, y, texture, template, player, leashRange = 400) {
		super(scene, x, y, texture, template)
		this.target = player
		this.leashRange = 400
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)
		// move toward player if within leashRange
		if (Math.abs(this.target.x - this.x) < this.leashRange) {
			// x axis
			if (Math.abs(this.target.x - this.x) < 2) this.setVelocityX(0)
			else if (this.target.x < this.x) this.setVelocityX(-this.template.maxVelocity)
			else this.setVelocityX(this.template.maxVelocity)

			// y axis
			if ((this.body.touching.down || this.template.canFly) && this.target.y < this.y - this.height) {
				this.setVelocityY(-this.template.jumpVelocity)
			}
		} else {
			// stop moving
			this.setVelocityX(0)
		}
	}

	damage(amount) {
		if (this.hp.adjust(amount)) {
			this.alive = false
			this.disableBody(true, true)
			this.hp.remove()
		}
	}
}
