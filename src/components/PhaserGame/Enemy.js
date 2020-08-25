import LivingSprite from './LivingSprite'
import Projectile from './Projectile'

export default class Enemy extends LivingSprite {
	constructor(scene, x, y, texture, template, player, leashRange = 600, scoreStore) {
		super(scene, x, y, texture, template)

		this.target = player
		this.leashRange = leashRange
		this.isMovingGraphic = false
		this.depth = 1
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)

		if (!this.alive) return
		this.setDirection()

		const distanceFromTarget = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
		const ability = this.abilities.find(a => a.range > distanceFromTarget && (a.nextFire == null || a.nextFire <= time))
		if (ability != null) {
			// if any are off cooldown, fire them
			// fire and set a timer for when they can use ability again
			this.doAbility(ability, this.target)
			this.setGraphic(ability.graphics.character)
			ability.nextFire = time + ability.attackRateMs
			this.setVelocityX(0)
		} else if (distanceFromTarget < this.leashRange) {
			// if any closer range abilities are off cooldown, move toward them
			const closerRangeAbilities = this.abilities.filter(
				a => a.projectile == false || (a.range < distanceFromTarget && (a.nextFire == null || a.nextFire <= time))
			)
			if (closerRangeAbilities.length > 0) {
				this.moveTowardTarget()
			}
		}
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

	doAbility(ability) {
		if (ability.projectile) {
			const projectile = new Projectile(this.scene, this.x, this.y, ability.graphics.projectile, ability.projectileVelocity, this.target)
			this.scene.physics.add.overlap(projectile, this.target, () => {
				this.target.damage(ability.damage)
				projectile.destroy()
			})
		} else {
			this.target.damage(ability.damage)
		}
	}

	setDirection() {
		if (this.target.x > this.x) {
			this.flipX = false
		} else {
			this.flipX = true
		}
	}

	moveTowardTarget() {
		if (Math.abs(this.target.x - this.x) < 5) {
			this.setVelocityX(0)
		} else if (this.target.x < this.x) {
			this.setVelocityX(-this.template.maxVelocity)
		} else {
			this.setVelocityX(this.template.maxVelocity)
		}

		if ((this.body.touching.down || this.template.canFly) && this.target.y < this.y - this.height) {
			this.setVelocityY(-this.template.jumpVelocity)
		}

		const isMoving = this.body.velocity.x != 0 || this.body.velocity.y != 0
		this.setGraphic(isMoving ? this.graphics.moving : this.graphics.still)
	}
}
