import LivingSprite from './LivingSprite'
import Projectile from './Projectile'

export default class Enemy extends LivingSprite {
	constructor(scene, x, y, texture, template, player, leashRange = 600) {
		super(scene, x, y, texture, template)

		this.target = player
		this.leashRange = leashRange
		this.isMovingGraphic = false
		this.depth = 1
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)

		if (!this.alive) return

		// TODO: enemies should be able to target followers too

		this.attackTarget(this.target, this.leashRange, [this.target, ...this.scene.followers.getChildren()])
	}

	damage(amount) {
		super.damage(amount)
		if (!this.alive) {
			// award score to player
			this.scene.addScore(this.template.score)

			this.disableBody(true, false)
			this.hp.destroy()
			// TODO: fade out and eventually destroy
			this.alpha = 0.25
			// this.destroy()
		}
	}
}
