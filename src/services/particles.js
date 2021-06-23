export function buildDefaultParticlesConfig() {
	return {
		name: '',
		enabled: false,
		graphic: null,
		speed: 25,
		scale: { start: 1.0, end: 0 },
		alpha: { start: 1.0, end: 1.0 },
		angle: { min: -180, max: 180 },
		rotate: { min: -180, max: 180 },
		frequency: 10,
		lifespan: 2000,
		blendMode: null,
		rgbaColor: null
	}
}

export function hasParticlesConfigured(c) {
	// return c.particles?.enabled && c.particles.graphic != null
	return c.particles != null
}

export function createParticles(scene, p, spriteToFollow) {
	p = {
		...buildDefaultParticlesConfig(),
		...p
	}

	const particleSettings = {
		speed: p.speed,
		scale: {
			start: p.scale.start,
			end: p.scale.end
		},
		alpha: {
			start: p.alpha.start,
			end: p.alpha.end
		},
		lifespan: p.lifespan,
		frequency: p.frequency,
		angle: { min: p.angle.min, max: p.angle.max },
		rotate: { min: p.rotate.min, max: p.rotate.max },
	}

	if (spriteToFollow != null)
		particleSettings.follow = spriteToFollow
	else {
		particleSettings.x = 100
		particleSettings.y = 200
	}

	if (p.blendMode != null)
		particleSettings.blendMode = p.blendMode

	if (p.colorRgba != null && p.colorRgba != 'transparent')
		particleSettings.tint = Phaser.Display.Color.ValueToColor(p.colorRgba)._color

	const particles = scene.add.particles(p.graphic)
	const emitter = particles.createEmitter(particleSettings)
	return { particles, emitter }
}
