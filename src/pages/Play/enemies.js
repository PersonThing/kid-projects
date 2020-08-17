import enemyStore from '../../stores/enemy-store'
const artScale = 2

// todo configurable per enemy
const leashRange = 400 // in pixels

export default function CreateEnemy(template, config, width, height) {
	return {
		...template,
		...config,

		width,
		height,

		health: template.maxHealth,
		tvx: template.maxVelocity,
		vx: 0,
		vy: 0,
		grounded: false,
		alive: true,

		tick(me, player) {
			if (!me.grounded) return

			// is player in leash range?
			if (Math.abs(player.x - me.x) < leashRange) {
				// move toward them

				// x axis
				if (player.x == me.x) me.vx = 0
				else if (player.x < me.x) me.vx = -me.tvx
				else me.vx = me.tvx

				// y axis
				if (player.y > me.y + me.height) {
					me.vy = me.jumpVelocity
					me.y += 1
				}
			} else {
				// stop moving
				me.vx = 0
			}
		},

		onDeath() {
			// nothing yet
		},
	}
}
