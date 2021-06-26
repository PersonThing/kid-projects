export default class HealthBar {
  constructor(scene, x, y, health, maxHealth) {
    this.bar = new Phaser.GameObjects.Graphics(scene)
    this.x = x
    this.y = y
    this.health = health
    this.maxHealth = maxHealth
    this.width = 80
    this.height = 12

    this.draw()
    this.bar.alpha = 0.5

    scene.add.existing(this.bar)
  }

  adjust(amount) {
    this.health = Math.max(Math.min(this.maxHealth, this.health - amount), 0)
    this.draw()
    return this.health > 0
  }

  reset() {
    this.health = this.maxHealth
    this.draw()
  }

  hide() {
    this.bar.clear()
  }

  draw() {
    this.bar.clear()

    // BG
    this.bar.fillStyle(0x000000)
    this.bar.fillRect(this.x, this.y, this.width, this.height)

    // Health
    if (this.health < 30) {
      this.bar.fillStyle(0xff0000)
    } else {
      this.bar.fillStyle(0x00ff00)
    }
    this.bar.fillRect(this.x + 1, this.y + 1, Math.floor((this.health / this.maxHealth) * (this.width - 2)), this.height - 2)
  }

  moveTo(sprite) {
    this.bar.x = sprite.body.x + (sprite.width - this.width) / 2
    this.bar.y = sprite.body.y - sprite.body.halfHeight // - 160 // not sure why the 150 is necessary here....
  }

  destroy() {
    this.bar.destroy()
  }
}
