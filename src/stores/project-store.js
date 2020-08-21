import LocalStorageStore from './local-storage-store'
import sampleProjects from './sample-projects.json'

const defaultValue = [...sampleProjects]

// import old keys as a project
const oldArt = localStorage.getItem('pixel-drawings')
if (oldArt != null) {
	defaultValue.push({
		name: 'Bub the bobcat',
		art: JSON.parse(oldArt),
		blocks: JSON.parse(localStorage.getItem('blocks') || '{}'),
		characters: JSON.parse(localStorage.getItem('characters') || '{}'),
		enemies: JSON.parse(localStorage.getItem('enemies') || '{}'),
		levels: JSON.parse(localStorage.getItem('levels') || '{}'),
	})
}

const { subscribe, set } = LocalStorageStore('projects', defaultValue)

export default {
	subscribe,
	set,
}
