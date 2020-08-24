import LivingSprite from './LivingSprite'

export default class Player extends LivingSprite {
	constructor(scene, x, y, texture, template) {
		super(scene, x, y, texture, template)
		// TODO: let me jump through bottom of blocks
	}

	damage(amount) {
		if (this.hp.adjust(amount)) {
			this.alive = false
		}
	}
}
