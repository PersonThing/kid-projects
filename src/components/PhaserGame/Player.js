import LivingSprite from './LivingSprite'
import Projectile from './Projectile'

export default class Player extends LivingSprite {
	constructor(scene, x, y, texture, template, keys, enemies) {
		super(scene, x, y, texture, template)

		this.keys = keys

		// let me jump through bottom of blocks Sonic-style
		this.body.checkCollision.up = false

		// show above enemies
		this.depth = 2

		// abilities
		// this felt clunkier than just checking keyDown in frames
		// this.abilityKeys = ['Q', 'W', 'E', 'R']
		// this.abilityKeys.forEach(k => {
		// 	const key = this.keys[k]
		// 	key.on('down', event => {
		// 		console.log(k, 'pressed')
		// 		const ability = this.abilities.find(a => a.key === k && (a.nextFire == null || a.nextFire < scene.time.now))
		// 		if (ability != null) {
		// 			console.log('firing', ability.name, scene.time.now)
		// 			this.doAbility(ability, { x: this.body.velocity.x < 0 ? -10000 : 10000, y: this.y - 100 })
		// 			this.setGraphic(ability.graphics.character)
		// 			ability.nextFire = scene.time.now + ability.attackRateMs
		// 		}
		// 	})
		// })
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta)

		// jumping
		if (this.body.touching.down || this.template.canFly) {
			if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.setVelocityY(-this.template.jumpVelocity)
		}

		// moving left or right
		const ax = this.body.touching.down || this.canFly ? this.template.maxVelocity / 10 : this.template.maxVelocity / 30
		if (this.keys.cursors.left.isDown && !this.keys.cursors.right.isDown) {
			this.accelerate(-ax)
		} else if (this.keys.cursors.right.isDown && !this.keys.cursors.isDown) {
			this.accelerate(ax)
		} else if (this.body.touching.down) {
			// stop if touching ground
			this.setVelocityX(0)
		}

		this.setGraphic(this.body.velocity.x != 0 ? this.graphics.moving : this.graphics.still)

		// abilities
		this.abilityKeys = ['Q', 'W', 'E', 'R']
		this.abilityKeys.forEach(k => {
			const key = this.keys[k]
			if (key.isDown) {
				const ability = this.abilities.find(a => a.key === k && (a.nextFire == null || a.nextFire < this.scene.time.now))
				if (ability != null) {
					this.doAbility(ability)
					this.setGraphic(ability.graphics.character)
					ability.nextFire = this.scene.time.now + ability.attackRateMs
				}
			}
		})
	}

	doAbility(ability) {
		const targetCoords = { x: this.flipX ? -10000 : 10000, y: this.y - 100 }
		if (ability.projectile) {
			const projectile = new Projectile(this.scene, this.x, this.y, ability.graphics.projectile, ability.projectileVelocity, targetCoords)
			this.scene.physics.add.overlap(projectile, this.enemies, (projectile, enemy) => {
				enemy.damage(ability.damage)
				projectile.destroy()
			})
		} else {
			// TODO: how will melee non-projectile abilities work for player... ?
		}
	}

	onEnemyOverlap(enemy) {
		// TODO: check for melee abilities??
		// enemy.damage(100 / 60)
		// this.damage(20 / 60)
	}
}
