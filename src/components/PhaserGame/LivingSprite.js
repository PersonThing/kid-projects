import AbilityAttack from './AbilityAttack'
import HealthBar from './HealthBar'
import getAnimationKey from './GetAnimationKey'
import gravityPixelsPerSecond from './Gravity'

export default class LivingSprite extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, template) {
		super(scene, x, y, texture)

		this.template = template

		scene.add.existing(this)
		scene.physics.add.existing(this)

		// gravity affects everything differently
		// todo figure out why this doesn't work for enemies...
		// this.setGravityY(-gravityPixelsPerSecond + gravityPixelsPerSecond * template.gravityMultiplier)

		this.name = template.name
		this.hp = new HealthBar(scene, 0, 0, template.maxHealth, template.maxHealth)
		this.alive = true

		// sort abilities by range
		this.abilities = JSON.parse(JSON.stringify(template.abilities)).sort((a, b) => a.range - b.range)

		this.graphics = {}
		Object.keys(template.graphics).forEach(key => {
			this.graphics[key] = template.graphics[key] || template.graphics.still
		})

		// set size initially and don't change it regardless of graphic (might change later)
		this.body.width = template.graphics.still.animated ? template.graphics.still.frameWidth : template.graphics.still.width
		this.body.height = template.graphics.still.height
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)
		this.hp.moveTo(this)
		if (this.body.y > 1000) this.damage(this.template.maxHealth)
	}

	setGraphic(art, ignoreIfPlaying = true) {
		if (art == null) art = this.graphics.still

		if (ignoreIfPlaying && this.activeGraphic != null && this.activeGraphic.name == art.name) return
		else this.anims.stop()

		if (art.animated) {
			this.anims.play(getAnimationKey(art.name), ignoreIfPlaying, 0)
		} else {
			this.setTexture(art.name)
		}
		this.activeGraphic = art
	}

	damage(amount) {
		this.alive = this.hp.adjust(amount)
	}

	heal(amount) {
		this.damage(-amount)
		// heal any pets too
		this.scene.followers
			.getChildren()
			.filter(f => f.owner == this && f.alive)
			.forEach(f => f.heal(amount * 0.5))
	}

	accelerate(ax) {
		// if they're changing directions, accelerate immediately
		let vx = this.body.velocity.x
		if ((ax > 0 && vx < 0) || (ax < 0 && vx > 0)) vx = ax
		else vx = vx + ax

		if (vx > this.template.maxVelocity) vx = this.template.maxVelocity
		else if (vx < -this.template.maxVelocity) vx = -this.template.maxVelocity

		this.setVelocityX(vx)
		this.flipX = vx < 0
	}

	moveTowardSprite(sprite, desiredDistance = 5) {
		const distanceFromTarget = this.getDistanceFrom(sprite)
		if (distanceFromTarget <= desiredDistance) {
			this.setVelocityX(0)
		} else if (sprite.x < this.x) {
			this.setVelocityX(-this.template.maxVelocity)
			this.flipX = true
		} else {
			this.setVelocityX(this.template.maxVelocity)
			this.flipX = false
		}

		if ((this.body.touching.down || this.template.canFly) && sprite.y < this.y - this.height) {
			this.setVelocityY(-this.template.jumpVelocity)
		}
	}

	attackTarget(target, range) {
		// face target
		this.flipX = this.target.x < this.x

		const distanceFromTarget = this.getDistanceFrom(target)
		const time = this.scene.time.now
		const ability = this.abilities.find(a => a.range > distanceFromTarget && (a.nextFire == null || a.nextFire <= time))
		if (ability != null) {
			// if any are off cooldown, fire them
			// fire and set a timer for when they can use ability again
			this.doAbility(ability, target)
			this.setGraphic(ability.graphics.character)
			ability.nextFire = time + ability.attackRateMs
			this.setVelocityX(0)
		} else if (distanceFromTarget < range) {
			// if any closer range abilities are off cooldown, move toward them
			const closerRangeAbilities = this.abilities.filter(
				a => a.projectile == false || (a.range < distanceFromTarget && (a.nextFire == null || a.nextFire <= time))
			)
			if (closerRangeAbilities.length > 0) {
				this.moveTowardSprite(target, closerRangeAbilities[0].range - 1)

				const isMoving = this.body.velocity.x != 0 || this.body.velocity.y != 0
				if (this.attackingGraphicTimeout == null) {
					this.setGraphic(isMoving ? this.graphics.moving : this.graphics.still)
				}
			}
		}
	}

	assignTargetIfNone(range) {
		if (this.target == null || !this.target.alive || this.getDistanceFrom(this.target) > range) {
			this.target = this.findTargetInRange(range)
		}
	}

	findTargetInRange(range) {
		const targetsInRange = this.getEligibleTargets()
			.filter(t => t.alive)
			.map(t => ({
				sprite: t,
				distance: this.getDistanceFrom(t),
			}))
			.filter(t => t.distance < range)
			.sort((a, b) => a.distance - b.distance)
		return targetsInRange.length > 0 ? targetsInRange[0].sprite : null
	}

	getDistanceFrom(sprite) {
		return Phaser.Math.Distance.Between(this.x, this.y, sprite.x, sprite.y)
	}

	doAbility(ability, target) {
		if (ability.graphics.character != null) {
			this.setGraphic(ability.graphics.character, false)

			// TODO: use anim end event instead...
			// TODO: damage @ end of attack animation instead of beginning - make sure character still in range @ end of animation...
			clearTimeout(this.attackingGraphicTimeout)
			this.attackingGraphicTimeout = setTimeout(() => {
				this.attackingGraphic = false
				this.attackingGraphicTimeout = null
			}, ability.attackRateMs)
		}

		const attack = new AbilityAttack(this.scene, this.x, this.y, ability, target)
		const eligibleTargets = this.getEligibleTargets()
		this.scene.physics.add.overlap(attack, eligibleTargets, (projectile, spriteHit) => {
			spriteHit.damage(ability.damage)
			projectile.destroy()
		})
	}
}
