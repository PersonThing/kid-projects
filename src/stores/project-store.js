import LocalStorageStore from './local-storage-store'
import sampleProjects from './sample-projects.json'

const defaultValue = [...sampleProjects]

// migrate any existing projects to fix keys / etc
const oldProjectsValue = localStorage.getItem('projects')
const projectsValue = (oldProjectsValue != null ? JSON.parse(oldProjectsValue) : defaultValue).map(p => migrateProject(p))
localStorage.setItem('projects', JSON.stringify(projectsValue))

function migrateProject(project) {

	if (project.particles == null) {
		const particles = {}

		const hasParticlesConfigured = o => o.particles?.enabled && o.particles.graphic != null
		const copy = o => {
			const result = JSON.parse(JSON.stringify(o))
			delete result.enabled
			return result
		}

		for (const name in project.characters) {
			const c = project.characters[name]
			if (hasParticlesConfigured(c)) {
				particles[c.name] = copy(c.particles)
				c.particles = c.name
			}
			c.abilities.filter(hasParticlesConfigured).forEach(a => {
				particles[a.name] = copy(a.particles)
				a.particles = a.name
			})
		}

		for (const name in project.enemies) {
			const e = project.enemies[name]
			if (hasParticlesConfigured(e)) {
				particles[e.name] = copy(e.particles)
				e.particles = e.name
			}
			e.abilities.filter(hasParticlesConfigured).forEach(a => {
				particles[a.name] = copy(a.particles)
				a.particles = a.name
			})
		}

		for (const name in project.blocks) {
			const b = project.blocks[name]
			if (!hasParticlesConfigured(b)) continue
			particles[b.name] = copy(b.particles)
			b.particles = b.name
		}

		project.particles = particles
	}

	for (const c in project.particles) {
		project.particles[c].name = c
	}

	return project
}


const { subscribe, set } = LocalStorageStore('projects', defaultValue)

export default {
	subscribe,
	set,
}
