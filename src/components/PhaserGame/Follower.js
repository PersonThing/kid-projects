import LivingSprite from './LivingSprite'

export default class Follower extends LivingSprite {
	constructor(scene, x, y, texture, template, owner, leashRange = 600, attackRange = 600) {
		super(scene, x, y, texture, template)

		this.owner = owner
		this.leashRange = leashRange
		this.attackRange = attackRange
		this.isMovingGraphic = false
		this.depth = 2
		this.framesOutsideLeashRange = 0
	}

	getEligibleTargets() {
		return this.scene.enemies.getChildren()
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)

		if (!this.alive) return

		if (this.isOutsideLeashRange()) {
			// console.log('FOLLOWER leashing')
			this.framesOutsideLeashRange++
			this.moveTowardSprite(this.owner)
			// 1b. if stuck away from owner for more than 2 seconds, respawn at owner
			if (this.framesOutsideLeashRange > 120) this.respawnAtOwner()
		} else {
			this.framesOutsideLeashRange = 0

			// 2. pick a target and stick to them until they're dead or out of range
			this.assignTargetIfNone(this.attackRange)

			// 3. attack target
			if (this.target != null) {
				// console.log('FOLLOWER', this.template.name, 'attacking', this.target?.template.name)
				this.attackTarget(this.target, this.attackRange)
			} else {
				// 4. move toward owner
				// console.log('FOLLOWER', this.template.name, 'moving toward owner')
				this.moveTowardSprite(this.owner, 100)
			}
		}

		// set graphic based on whether we're moving or not
		const isMoving = this.body.velocity.x != 0 || this.body.velocity.y != 0
		if (this.attackingGraphicTimeout == null) this.setGraphic(isMoving ? this.graphics.moving : this.graphics.still)
	}

	isOutsideLeashRange() {
		return this.getDistanceFrom(this.owner) > this.leashRange
	}

	damage(amount) {
		super.damage(amount)
		if (!this.alive) {
			this.hp.hide()
			this.disableBody(true, true)
			setTimeout(() => this.respawnAtOwner(), 1000)
		}
	}

	respawnAtOwner() {
		this.alive = true
		this.hp.reset()
		this.enableBody(true, this.owner.x, this.owner.y - (this.body.height - this.owner.body.height), true, true)
	}
}
