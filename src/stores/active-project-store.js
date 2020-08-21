import { writable } from 'svelte/store'
import projects from './project-store'

const { subscribe, set } = writable(null)

let $projects
projects.subscribe(value => {
	$projects = value
})

export default {
	subscribe,
	set: value => {
		set(value)
		if (value != null) {
			projects.set($projects.some(p => p.name == value.name) ? $projects.map(p => (p.name == value.name ? value : p)) : [...$projects, value])
		}
	},
}
