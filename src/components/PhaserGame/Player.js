import AbilityAttack from './AbilityAttack'
import AbilityBar from './AbilityBar'
import LivingSprite from './LivingSprite'

export default class Player extends LivingSprite {
	constructor(scene, x, y, texture, template, keys) {
		super(scene, x, y, texture, template)

		this.keys = keys

		// let me jump through bottom of blocks Sonic-style
		this.body.checkCollision.up = !template.canJumpThroughBlocks

		// show above enemies
		this.depth = 3

		// manage user input for abilities & show a little widget
		this.abilityBar = new AbilityBar(scene, this.abilities, keys)

		this.pointerIsDown = false
		this.scene.input.on('pointerdown', pointer => this.setPointerDown(pointer))
		this.scene.input.on('pointerup', pointer => this.setPointerDown(pointer))
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)

		// jumping
		if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
			// initial jump, or flying
			if (this.body.touching.down || this.template.canFly) {
				// maybe do a triple jump or something in the future (like "it lurks below" unique pants bonus)
				this.remainingJumpsAvailable = this.template.canDoubleJump ? 1 : 0
				this.jump()
			}
			// double jump if character template allows it
			else if (this.remainingJumpsAvailable > 0) {
				this.remainingJumpsAvailable--
				this.jump()
			}
		}

		// moving left or right
		const ax = this.body.touching.down || this.canFly ? this.template.maxVelocity / 10 : this.template.maxVelocity / 30
		if (this.keys.cursors.left.isDown || this.keys.A.isDown) {
			this.accelerate(-ax)
		} else if (this.keys.cursors.right.isDown || this.keys.D.isDown) {
			this.accelerate(ax)
		} else if (this.body.touching.down) {
			// stop if touching ground
			this.setVelocityX(0)
		}

		if (this.attackingGraphicTimeout == null) {
			this.setGraphic(this.body.velocity.x != 0 ? this.graphics.moving : this.graphics.still)
		}

		// do abilities if pointer down
		if (this.pointerIsDown) {
			// fire any active abilities that are off cooldown
			this.abilityBar
				.getActiveAbilities()
				.filter(a => a.nextFire == null || a.nextFire < this.scene.time.now)
				.forEach(a => {
					this.doAbility(a)
					a.nextFire = this.scene.time.now + a.attackRateMs
				})
		}
	}

	jump() {
		this.setVelocityY(-this.template.jumpVelocity)
	}

	setPointerDown(pointer) {
		this.pointerIsDown = pointer.leftButtonDown() || pointer.rightButtonDown()
	}

	doAbility(ability) {
		if (ability.graphics.character != null) {
			this.setGraphic(ability.graphics.character, false)

			// TODO: use anim end event instead...
			clearTimeout(this.attackingGraphicTimeout)
			this.attackingGraphicTimeout = setTimeout(() => {
				this.attackingGraphicTimeout = null
			}, ability.attackRateMs)
		}

		// target mouse pointer
		let targetCoords = this.getCursorCoordinates()

		// make character look toward target coords
		this.flipX = targetCoords.x < this.x

		const attack = new AbilityAttack(this.scene, this.x, this.y, ability, targetCoords)
		this.scene.physics.add.overlap(attack, this.scene.enemies, (attack, enemy) => {
			enemy.damage(ability.damage)
			attack.destroy()
		})
	}

	getCursorCoordinates() {
		return {
			x: this.scene.input.mousePointer.x + this.scene.cameras.main.worldView.x,
			y: this.scene.input.mousePointer.y + this.scene.cameras.main.worldView.y,
		}
	}
}
