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

	setGraphic(art) {
		if (art == null) art = this.graphics.still
		if (this.activeGraphic != null && this.activeGraphic.name == art.name) return
		if (art.animated) {
			this.anims.play(this.getAnimationKey(art.name), true)
		} else {
			this.setTexture(art.name)
		}
		this.activeGraphic = art
	}

	getAnimationKey(key) {
		return `${key}.animation`
	}

	damage(amount) {
		this.alive = this.hp.adjust(amount)
	}

	accelerate(ax) {
		let vx = this.body.velocity.x + ax

		if (vx > this.template.maxVelocity) vx = this.template.maxVelocity
		else if (vx < -this.template.maxVelocity) vx = -this.template.maxVelocity

		this.setVelocityX(vx)
		this.flipX = vx < 0
	}
}
