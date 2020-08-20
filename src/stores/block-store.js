import LocalStorageStore from './local-storage-store'
export default LocalStorageStore('blocks', {
	grass: { name: 'grass', solid: true, dps: 0, dpsToPlayers: null, graphic: 'grass', width: 30, height: 30 },
	spikes: { name: 'spikes', solid: true, dps: 1000, dpsToPlayers: 100, graphic: 'spike', width: 30, height: 30, throwOnTouch: true },
	lava: { name: 'lava', solid: true, dps: 10000, dpsToPlayers: 1000, graphic: 'lava', throwOnTouch: true },
	dirt: { name: 'dirt', solid: true, dps: 0, dpsToPlayers: null, graphic: 'dirt' },
	bouncer: { name: 'bouncer', solid: true, throwOnTouch: true, dps: 0, graphic: 'bouncer' },
})
