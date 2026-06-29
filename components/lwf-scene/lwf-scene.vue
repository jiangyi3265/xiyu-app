<template>
	<view class="scene" :style="'background:' + bg">
		<view class="sheen"></view>
		<view class="wm"><lwf-icon :name="icon" :size="iconSize" color="rgba(255,255,255,0.5)" :stroke="1.4" /></view>
		<view v-if="label" class="cap">
			<view class="cap-grad"></view>
			<view class="cap-in">
				<text class="cap-t">{{ label }}</text>
				<text v-if="note" class="cap-n">{{ note }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { sceneBg } from '@/common/mock.js'
export default {
	name: 'lwf-scene',
	props: {
		scene: { type: [Number, String], default: 0 },
		icon: { type: String, default: 'bed' },
		iconSize: { type: [Number, String], default: 120 },
		label: { type: String, default: '' },
		note: { type: String, default: '' }
	},
	computed: {
		bg() { return sceneBg(this.scene) }
	}
}
</script>

<style lang="scss">
.scene { position: relative; width: 100%; height: 100%; overflow: hidden; }
.scene .sheen {
	position: absolute; inset: 0;
	background:
		linear-gradient(125deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 38%),
		linear-gradient(0deg, rgba(0,0,0,.10), rgba(0,0,0,0) 40%);
}
.scene .wm { position: absolute; right: 24rpx; bottom: 30rpx; opacity: .55; }
.scene .cap { position: absolute; left: 0; right: 0; bottom: 0; }
.scene .cap-grad { height: 120rpx; background: linear-gradient(180deg, transparent, rgba(20,16,16,.55)); }
.scene .cap-in { position: absolute; left: 24rpx; bottom: 20rpx; right: 24rpx; }
.scene .cap-t { display: block; color: #fff; font-size: 32rpx; font-weight: 700; text-shadow: 0 2rpx 8rpx rgba(0,0,0,.4); }
.scene .cap-n { display: block; color: rgba(255,255,255,.92); font-size: 22rpx; margin-top: 6rpx; text-shadow: 0 1rpx 4rpx rgba(0,0,0,.4); }
</style>
