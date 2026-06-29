<template>
	<view class="lwf-icon" :style="style"></view>
</template>

<script>
/**
 * 轻量图标组件：用 URL-encoded SVG 作为背景图，H5 / 小程序通用，可任意着色。
 * 用法： <lwf-icon name="bed" :size="44" color="#C1272D" />
 */
const ICONS = {
	bed:   `<path d="M2 5v14"/><path d="M2 9h16a3 3 0 0 1 3 3v7"/><path d="M2 16h19"/><path d="M6 9v6"/>`,
	dish:  `<path d="M4 18h16"/><path d="M5 18a7 7 0 0 1 14 0"/><path d="M12 8V5"/><path d="M10 5h4"/>`,
	card:  `<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><path d="M6 14.5h4"/>`,
	crown: `<path d="M5 18.5h14l1.4-9.5-4.7 3.6L12 6 8.3 12.6 3.6 9z" fill="COLOR" stroke="none"/><path d="M5 18.5h14" /><circle cx="12" cy="9.5" r="1" fill="COLOR" stroke="none"/>`,
	coin:  `<circle cx="12" cy="12" r="8.6"/><path d="M9 9l3 3 3-3"/><path d="M12 12v4"/><path d="M9.6 13.4h4.8"/><path d="M9.6 11.2h4.8"/>`,
	up:    `<circle cx="12" cy="12" r="8.6"/><path d="M12 16.2V8.4"/><path d="M8.4 12 12 8.4l3.6 3.6"/>`,
	clock: `<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3 1.9"/>`,
	heart: `<path d="M12 20.3C5.4 16 4 12 4 9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 8 2.5c0 2.5-1.4 6.5-8 10.8z" fill="COLOR" stroke="none"/>`,
	wifi:  `<path d="M4.5 11.5a11 11 0 0 1 15 0"/><path d="M7.5 14.7a6.5 6.5 0 0 1 9 0"/><circle cx="12" cy="18.5" r="1.3" fill="COLOR" stroke="none"/>`,
	car:   `<path d="M4.5 14l1.6-5.2A2 2 0 0 1 8 7.4h8a2 2 0 0 1 1.9 1.4L19.5 14"/><rect x="3" y="13.5" width="18" height="4.2" rx="1.8"/><circle cx="8" cy="18.6" r="1.7" fill="COLOR" stroke="none"/><circle cx="16" cy="18.6" r="1.7" fill="COLOR" stroke="none"/>`,
	gift:  `<rect x="4" y="10.5" width="16" height="9" rx="1.5"/><path d="M3 10.5h18v3.2H3z"/><path d="M12 10.5v9"/><path d="M12 10.5C12 8 10.8 6 8.8 6a2 2 0 0 0 0 4.5"/><path d="M12 10.5C12 8 13.2 6 15.2 6a2 2 0 0 1 0 4.5"/>`,
	doc:   `<path d="M6.5 3.5h7l4 4v13h-11z"/><path d="M13.5 3.5v4h4"/><path d="M9 13h6"/><path d="M9 16h6"/><path d="M9 10h3"/>`,
	wallet:`<rect x="3" y="6" width="18" height="13" rx="2.6"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.4" fill="COLOR" stroke="none"/>`,
	ticket:`<path d="M4 8.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 1.8 1.8 0 0 0 0 3.6V15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.9a1.8 1.8 0 0 0 0-3.6z"/><path d="M13.5 6.5v11" stroke-dasharray="1.6 2"/>`,
	list:  `<path d="M8.5 6.5h11"/><path d="M8.5 12h11"/><path d="M8.5 17.5h11"/><circle cx="4.5" cy="6.5" r="1.3" fill="COLOR" stroke="none"/><circle cx="4.5" cy="12" r="1.3" fill="COLOR" stroke="none"/><circle cx="4.5" cy="17.5" r="1.3" fill="COLOR" stroke="none"/>`,
	user:  `<circle cx="12" cy="8.2" r="3.8"/><path d="M5 20a7 7 0 0 1 14 0"/>`,
	share: `<circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6.2" r="2.4"/><circle cx="17" cy="17.8" r="2.4"/><path d="M8.1 10.9 14.9 7.3"/><path d="M8.1 13.1l6.8 3.6"/>`,
	phone: `<path d="M6 3.5h2.6l1.5 4.6-1.9 1.4a11 11 0 0 0 4.8 4.8l1.4-1.9 4.6 1.5V18a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4 5.5a2 2 0 0 1 2-2z"/>`,
	location:`<path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>`,
	filter:`<path d="M4 6.5h16"/><path d="M7 12h10"/><path d="M10 17.5h4"/>`,
	search:`<circle cx="11" cy="11" r="6"/><path d="M19.5 19.5l-4.2-4.2"/>`,
	plus:  `<path d="M12 5.5v13"/><path d="M5.5 12h13"/>`,
	minus: `<path d="M5.5 12h13"/>`,
	check: `<path d="M5 12.5 10 17.5 19.5 7"/>`,
	close: `<path d="M6 6l12 12"/><path d="M18 6 6 18"/>`,
	arrow: `<path d="M9 5.5l6.5 6.5L9 18.5"/>`,
	star:  `<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" fill="COLOR" stroke="none"/>`,
	edit:  `<path d="M5 19h14"/><path d="M14.5 5.5l4 4-9.5 9.5H5v-4z"/>`,
	shield:`<path d="M12 3l7.5 3.2v5.3c0 4.8-3.2 8.5-7.5 10.7C7.7 20 4.5 16.3 4.5 11.5V6.2z"/><path d="M9 12l2 2 4.2-4.2"/>`,
	calendar:`<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/>`,
	store: `<path d="M4 10.5V19h16v-8.5"/><path d="M3 6.5h18l-1.3 4.2a2.7 2.7 0 0 1-5.2-.4 2.7 2.7 0 0 1-5 0 2.7 2.7 0 0 1-5.2.4z"/><path d="M9.5 19v-4h5v4"/>`,
	hot:   `<path d="M12 3c1 3-1 4.5-1 6.5a3 3 0 0 0 3 3c1.5 0 2.5-1 2.5-2.5 2 1.8 2.5 4 1.5 6.2A7 7 0 0 1 5.5 13C5.5 8 9 6 12 3z" fill="COLOR" stroke="none"/>`,
	tag:   `<path d="M12.5 3.5H19a1.5 1.5 0 0 1 1.5 1.5v6.5a2 2 0 0 1-.6 1.4l-7 7a2 2 0 0 1-2.8 0l-5-5a2 2 0 0 1 0-2.8l7-7a2 2 0 0 1 1.4-.6z"/><circle cx="16" cy="8" r="1.3" fill="COLOR" stroke="none"/>`
}

export default {
	name: 'lwf-icon',
	props: {
		name: { type: String, required: true },
		size: { type: [Number, String], default: 44 },
		color: { type: String, default: '#1C1C1E' },
		stroke: { type: [Number, String], default: 1.7 }
	},
	computed: {
		style() {
			const inner = (ICONS[this.name] || '').replace(/COLOR/g, this.color)
			const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${this.color}" stroke-width="${this.stroke}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
			const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`
			const s = this.size + 'rpx'
			return `width:${s};height:${s};background-image:url("${uri}");background-size:100% 100%;background-repeat:no-repeat;`
		}
	}
}
</script>

<style>
.lwf-icon { display: inline-block; flex-shrink: 0; }
</style>
