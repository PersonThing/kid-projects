import SkillKeys from './SkillKeys'

const buttonSize = 50
const buttonSpacing = 5
const buttonFontSize = 12

export default class AbilityBar {
	constructor(scene, abilities, keys, initialActiveKey) {
		this.abilities = abilities
		this.activeKey = abilities.length > 0 ? abilities[0].key : null
		this.bar = new Phaser.GameObjects.Graphics(scene)
		this.bar.setScrollFactor(0)
		this.bar.alpha = 0.5
		this.draw()
		scene.add.existing(this.bar)

		// abilities - change active ability key on press
		// then right or left click will use that ability
		SkillKeys.forEach(k => {
			const key = keys[k]
			key.on('down', event => this.setActiveKey(k))
		})

		this.activeKey = initialActiveKey
	}

	draw() {
		this.bar.clear()

		// TODO: replace Svelte-based ability bar graphics with this...
		// for (let i = 0; i < this.abilities.length; i++) {
		// 	const ability = this.abilities[i]
		// 	// draw a background square
		// 	this.bar.fillStyle(0x000000)
		// 	this.bar.fillRect(10 + i * (buttonSize + buttonSpacing), this.bar.scene.cameras.main.height - buttonSize - 10, buttonSize, buttonSize)
		// 	// text hotkey in white text in top left
		// 	// texture projectile graphic if any, otherwise character graphic
		// 	// draw a border if it's active
		//	// draw a cooldown indicator if nextFire is set
		// }
	}

	setActiveKey(key) {
		this.activeKey = key
		this.draw()
	}

	getActiveAbilities() {
		return this.abilities.filter(a => a.key === this.activeKey)
	}
}
