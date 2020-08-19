import LocalStorageStore from './local-storage-store'
export default LocalStorageStore('blocks', {
	Spikes: { name: 'Spikes', solid: true, dps: 1000, dpsToPlayers: 100, graphic: 'spike', width: 30, height: 30, throwOnTouch: true },
	Grass: { name: 'Grass', solid: true, dps: 0, dpsToPlayers: null, graphic: 'grass block', width: 30, height: 30 },
	Lava: { name: 'Lava', solid: true, dps: 10000, dpsToPlayers: 1000, graphic: 'lava', throwOnTouch: true },
	ground: { name: 'ground', solid: true, dps: 0, dpsToPlayers: null, graphic: 'stone dirt' },
})
