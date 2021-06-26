import LocalStorageStore from './local-storage-store'
import sampleProjects from './sample-projects.json'
import migrate1 from './project-migrations/migrate1'
import migrate2 from './project-migrations/migrate2'

export const PROJECT_VERSION = 2

const defaultValue = [...sampleProjects]

// migrate any existing projects to fix keys / etc
const oldProjectsValue = localStorage.getItem('projects')
const projectsValue = (oldProjectsValue != null ? JSON.parse(oldProjectsValue) : defaultValue).map(p => migrateProject(p))
localStorage.setItem('projects', JSON.stringify(projectsValue))

function migrateProject(project) {
	if (project.version == null) project.version = 0.1

	// future migrations should add more lines like this one... or i should do something polymorphic with project migration functions in separate files
	if (project.version < 1) project = migrate1(project)
	if (project.version < 2) project = migrate2(project)

	// remove invalid stuff
	project = cleanup(project)

	return project
}

function cleanup(project) {
	Object.keys(project.blocks)
		.map(id => project.blocks[id])
		.forEach((b, id) => {
			b.id = id
			b.graphic = nullIfInvalid(project.art, b.graphic)
		})

	Object.keys(project.particles)
		.map(id => project.particles[id])
		.forEach(p => {
			p.graphic = nullIfInvalid(project.art, p.graphic)
		})

	Object.keys(project.characters)
		.map(id => project.characters[id])
		.forEach(c => {
			c.particles = nullIfInvalid(project.particles, c.particles)
			c.graphics.still = nullIfInvalid(project.art, c.graphics.still)
			c.graphics.moving = nullIfInvalid(project.art, c.graphics.moving)
			c.abilities = c.abilities.map(a => ({
				...a,
				graphics: {
					character: nullIfInvalid(project.art, a.graphics.character),
					projectile: nullIfInvalid(project.art, a.graphics.projectile),
				},
				particles: nullIfInvalid(project.particles, a.particles),
			}))
		})

	Object.keys(project.enemies)
		.map(id => project.enemies[id])
		.forEach(e => {
			e.particles = nullIfInvalid(project.particles, e.particles)
			e.graphics.still = nullIfInvalid(project.art, e.graphics.still)
			e.graphics.moving = nullIfInvalid(project.art, e.graphics.moving)
			e.abilities = e.abilities.map(a => ({
				...a,
				graphics: {
					character: nullIfInvalid(project.art, a.graphics.character),
					projectile: nullIfInvalid(project.art, a.graphics.projectile),
				},
				particles: nullIfInvalid(project.particles, a.particles),
			}))
		})

	Object.keys(project.levels)
		.map(id => project.levels[id])
		.forEach(l => {
			l.blocks = l.blocks.filter(b => project.blocks.hasOwnProperty(b[0]))
			l.enemies = l.enemies.filter(e => project.enemies.hasOwnProperty(e[0]))
		})

	return project
}

function nullIfInvalid(collection, key) {
	return key != null && collection[key] != null ? key : null
}

const { subscribe, set } = LocalStorageStore('projects', defaultValue)
export default {
	subscribe,
	set,
}

export function getNextId(collection) {
	const maxId = Object.values(collection)
		.map(c => c.id)
		.sort()
		.pop()
	return maxId == null ? 0 : maxId + 1
}
