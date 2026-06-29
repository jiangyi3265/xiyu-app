<template>
	<view class="page-wrap">
		<view class="top">
			<view class="top-bg"></view>
			<text class="top-en">RECOMMEND</text>
			<view class="top-cn"><text class="ln"></text><text class="t">精选推荐</text><text class="ln r"></text></view>
			<text class="top-sub">平云山居 · 粤式盛宴 一席一味</text>
		</view>

		<view class="grid pad-x">
			<view class="dish card" v-for="d in dishes" :key="d.id" @tap="open(d)">
				<view class="dish-poster"><lwf-poster :main="d.main" :sub="d.sub" :theme="d.theme" /></view>
				<view class="dish-b">
					<text class="dish-t ellipsis-2">{{ d.title }}</text>
					<view class="loc">
						<lwf-icon name="location" :size="24" color="#B5B5BC" :stroke="1.8" />
						<text class="loc-t">{{ hotel.city }} | {{ hotel.full }}</text>
					</view>
					<view class="price"><text class="cur">¥</text><text class="num">{{ d.price }}</text><text class="price-old">¥{{ d.old }}</text></view>
				</view>
			</view>
		</view>
		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { HOTEL } from '@/common/mock.js'
import { api } from '@/common/api.js'
export default {
	data() { return { hotel: HOTEL, dishes: [] } },
	onLoad() { api.products('dish').then(list => { this.dishes = list }).catch(() => {}) },
	methods: {
		open(d) { uni.navigateTo({ url: `/pages/product-detail/product-detail?type=dish&id=${d.id}` }) }
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
.top { position: relative; padding: 40rpx 0 28rpx; text-align: center; overflow: hidden; }
.top-bg { position: absolute; inset: 0; background: linear-gradient(180deg, #FCEDEE, $bg); }
.top-en { position: relative; display: block; font-size: 72rpx; font-weight: 800; letter-spacing: 6rpx; color: rgba(193,39,45,.08); }
.top-cn { position: relative; display: flex; align-items: center; justify-content: center; margin-top: -44rpx; }
.top-cn .ln { width: 48rpx; height: 2rpx; background: linear-gradient(90deg, transparent, $brand); }
.top-cn .ln.r { background: linear-gradient(90deg, $brand, transparent); }
.top-cn .t { font-size: 38rpx; font-weight: 800; color: $brand; margin: 0 22rpx; letter-spacing: 4rpx; }
.top-sub { position: relative; display: block; font-size: 23rpx; color: $ink-3; margin-top: 14rpx; letter-spacing: 1rpx; }

.grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.dish { width: 332rpx; margin-bottom: 24rpx; }
.dish-poster { width: 100%; height: 320rpx; }
.dish-b { padding: 18rpx 20rpx 22rpx; }
.dish-t { font-size: 26rpx; font-weight: 600; line-height: 1.4; min-height: 72rpx; }
.loc { display: flex; align-items: center; margin: 8rpx 0 12rpx; }
.loc-t { font-size: 21rpx; color: $ink-4; margin-left: 4rpx; }
</style>
