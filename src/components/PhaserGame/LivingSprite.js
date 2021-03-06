import AbilityAttack from './AbilityAttack'
import HealthBar from './HealthBar'
import getAnimationKey from './GetAnimationKey'
import { createParticles, destroyParticles, hasParticlesConfigured } from '../../services/particles'
import { gravityPixelsPerSecond } from '../../components/PhaserGame/Constants'

export default class LivingSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, template) {
    super(scene, x, y, texture)

    this.template = template

    scene.add.existing(this)
    scene.physics.add.existing(this)

    // gravity affects everything differently
    // todo figure out why this doesn't work for enemies...
    // this.body.setGravity(0, gravityPixelsPerSecond * template.gravityMultiplier)

    this.name = template.name
    this.hp = new HealthBar(scene, 0, 0, template.maxHealth, template.maxHealth)
    this.alive = true
    this.gravityFlipped = false

    // sort abilities by range
    this.abilities = JSON.parse(JSON.stringify(template.abilities)).sort((a, b) => a.range - b.range)

    this.graphics = {}
    Object.keys(template.graphics).forEach(key => {
      this.graphics[key] = template.graphics[key] || template.graphics.still
    })

    // set size initially and don't change it regardless of graphic (might change later)
    this.body.width = template.graphics.still.animated ? template.graphics.still.frameWidth : template.graphics.still.width
    this.body.height = template.graphics.still.height

    if (hasParticlesConfigured(template)) {
      const { particles, emitter } = createParticles(scene, template.particles, this)
      this.particles = particles
      this.emitter = emitter
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    this.hp.moveTo(this)
    if (this.body.y > this.scene.physics.world.bounds.height + 1000) this.damage(this.template.maxHealth)

    // flip emitter if our sprite is flipped

    // flip graphic if gravity is flipped
    this.flipY = this.gravityFlipped
  }

  setGraphic(art, ignoreIfPlaying = true) {
    if (art == null) art = this.graphics.still

    if (ignoreIfPlaying && this.activeGraphic != null && this.activeGraphic.id == art.id) return
    else this.anims.stop()

    if (art.animated) {
      this.anims.play(getAnimationKey(art.id), ignoreIfPlaying, 0)
    } else {
      this.setTexture(art.id)
    }
    this.activeGraphic = art
  }

  damage(amount) {
    this.alive = this.hp.adjust(amount)
  }

  isTouchingDown() {
    return (!this.gravityFlipped && this.body.touching.down) || (this.gravityFlipped && this.body.touching.up)
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
    if (this.attackingGraphicTimeout == null) this.flipX = vx < 0
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

    const isTouchingDown = this.isTouchingDown()
    if (this.template.canFly || isTouchingDown) {
      if (!this.gravityFlipped && sprite.y < this.y - this.height) {
        // console.log('gravity not flipped, target is above us')
        this.jump()
      } else if (this.gravityFlipped && sprite.y - this.height > this.y) {
        // console.log('gravity flipped, target is below us')
        this.jump()
      }
    }
  }

  jump() {
    this.setVelocityY(this.template.jumpVelocity * (this.gravityFlipped ? 1 : -1))
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

  assignTargetIfNone(range, origin = this) {
    if (this.target == null || !this.target.alive || this.getDistanceFrom(this.target, origin) > range) {
      this.target = this.findTargetInRange(range, origin)
    }
  }

  findTargetInRange(range, origin = this) {
    const targetsInRange = this.getEligibleTargets()
      .filter(t => t.alive)
      .map(t => ({
        sprite: t,
        distance: this.getDistanceFrom(t, origin),
      }))
      .filter(t => t.distance < range)
      .sort((a, b) => a.distance - b.distance)
    return targetsInRange.length > 0 ? targetsInRange[0].sprite : null
  }

  getDistanceFrom(sprite, origin = this) {
    return Phaser.Math.Distance.Between(origin.x, origin.y, sprite.x, sprite.y)
  }

  doAbility(ability, target) {
    if (ability.graphics.character != null) {
      this.setGraphic(ability.graphics.character, false)

      // TODO: use anim end event instead...
      // TODO: damage @ end of attack animation instead of beginning - make sure character still in range @ end of animation...
      clearTimeout(this.attackingGraphicTimeout)
      this.attackingGraphicTimeout = setTimeout(() => {
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

  destroy() {
    if (this.particles) destroyParticles(this.particles, this.emitter, this.template.particles.lifespan)
    super.destroy()
  }
}
