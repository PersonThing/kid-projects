export class SimpleEnemy {
	constructor(x, y) {
		this.alive = true
		this.tvx = 2
		this.width = 100
		this.height = 50
		this.x = x
		this.y = y
		this.vx = 0
		this.vy = 0
		this.health = 100
		this.maxHealth = 100
		this.jumpVelocity = 20
		this.gravityDamageMultiplier = 2
		this.score = 1
		this.dps = 10

		// todo replace w/ graphic states
		this.isBoss = false

		this.grounded = false
	}
	q
	tick(player) {
		// default enemy just moves toward player
		if (this.grounded) {
			// x axis
			if (player.x == this.x) this.vx = 0
			else if (player.x < this.x) this.vx = -this.tvx
			else this.vx = this.tvx

			// y axis
			if (player.y > this.y + this.height) {
				this.vy = this.jumpVelocity
				this.y += 1
			}
		}
	}

	onDeath() {}
}

export class BossEnemy extends SimpleEnemy {
	constructor(x, y) {
		super(x, y)
		this.health = 400
		this.maxHealth = 400
		this.score = 5
		this.width = 400
		this.height = 300
		this.isBoss = true
		this.dps = 50
	}
}
