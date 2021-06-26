import LivingSprite from './LivingSprite'

export default class Enemy extends LivingSprite {
  constructor(scene, x, y, texture, template, attackRange) {
    super(scene, x, y, texture, template)

    this.attackRange = attackRange
    this.isMovingGraphic = false
    this.depth = 1
  }

  getEligibleTargets() {
    return [this.scene.player, ...this.scene.followers.getChildren()]
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if (!this.alive) return

    this.assignTargetIfNone(this.attackRange)
    if (this.target != null) {
      this.attackTarget(this.target, this.attackRange)
    } else {
      // TODO: make them wander or something?
    }
  }

  damage(amount) {
    super.damage(amount)
    if (!this.alive) {
      // award score to player
      this.scene.addScore(this.template.score)

      this.disableBody(true, false)
      this.hp.destroy()
      this.fadeOut(0)
    }
  }

  fadeOut(n) {
    if (n >= 10) this.destroy()
    else {
      this.alpha = 1 - n / 10
      setTimeout(() => this.fadeOut(n + 1), 10)
    }
  }
}
