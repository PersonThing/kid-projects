import { createParticles, destroyParticles, hasParticlesConfigured } from '../../services/particles'
import getAnimationKey from './GetAnimationKey'

export default class AbilityAttack extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, ability, target) {
		const art = ability.projectile ? ability.graphics.projectile : null
		super(scene, x, y, art?.id)

		this.ability = ability
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// collide with blocks unless told not to
		if (!ability.projectilePassThroughBlocks) {
			scene.physics.add.collider(this, scene.simpleBlocksGroup, (attack, block) => this.onBlockCollision(attack, block))
		}

		// move toward target if projectile
		if (ability.projectile) {
			scene.physics.moveToObject(this, target, ability.projectileVelocity)

			if (hasParticlesConfigured(ability)) {
				const { particles, emitter } = createParticles(scene, ability.particles, this)
				this.particles = particles
				this.emitter = emitter
			}
		} else {
			// non-projectiles just spawn at target, or as close to it as possible given their range
			const distance = Phaser.Math.Distance.Between(x, y, target.x, target.y)
			if (distance > ability.range) {
				const percentTowardTarget = ability.range / distance
				target.x = x + Math.round((target.x - x) * percentTowardTarget)
				target.y = y + Math.round((target.y - y) * percentTowardTarget)
			}
			this.x = target.x
			this.y = target.y
		}

		this.body.setAllowGravity(false)

		// use animation
		if (ability.projectile && art?.animated) {
			this.anims.play(getAnimationKey(art.id), true)
		}

		this.range = ability.range
		this.origin = {
			x,
			y,
		}
	}

	preUpdate() {
		// angle based on velocity
		this.rotation = this.body.velocity.angle()

		if (
			!this.ability.projectile ||
			// past ability range
			Phaser.Math.Distance.Between(this.x, this.y, this.origin.x, this.origin.y) > this.range ||
			// out of world
			!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())
		) {
			this.destroy()
		}
	}

	onBlockCollision(projectile, block) {
		if (this.ability.damageBlocksOnHit) {
			if (block.particles) block.particles.destroy()
			block.destroy()
		}
		this.destroy()
	}

	destroy() {
		if (this.particles) destroyParticles(this.particles, this.emitter, this.ability.particles.lifespan)
		super.destroy()
	}
}
