import HealthBar from './HealthBar'

export default class LivingSprite extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, template) {
		super(scene, x, y, texture)

		this.template = template

		scene.add.existing(this)
		scene.physics.add.existing(this)

		this.name = template.name
		this.hp = new HealthBar(scene, 0, 0, template.maxHealth, template.maxHealth)
		this.alive = true
		this.setCollideWorldBounds(true)
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)
		this.hp.moveTo(this)

		if (this.body.y > 1000) {
			this.damage(1000000) // lol
		}
	}
}
