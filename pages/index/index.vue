<template>
	<view class="page-wrap">
		<!-- 顶部轮播 -->
		<view class="banner">
			<swiper class="sw" circular autoplay interval="4000" duration="600"
				indicator-dots indicator-color="rgba(255,255,255,.45)" indicator-active-color="#fff">
				<swiper-item v-for="b in banners" :key="b.id" @tap="openBanner(b)">
					<view class="bslide" :style="'background:' + bg(b.scene)">
						<view class="bsheen"></view>
						<view class="bcontent">
							<text class="btag">PINGYUNSHANJU · 平云山居</text>
							<text class="btitle">{{ b.title }}</text>
							<text class="bsub">{{ b.sub }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 金刚区 -->
		<view class="entries card">
			<view class="entry tap" v-for="e in entries" :key="e.key" @tap="go(e)">
				<view class="etile">
					<lwf-icon :name="e.icon" :size="50" color="#C1272D" :stroke="1.6" />
				</view>
				<text class="ename">{{ e.name }}</text>
			</view>
		</view>

		<!-- 618 周年庆 -->
		<view class="sec-head">
			<text class="line"></text>
			<text class="txt">618 周年庆</text>
			<text class="line r"></text>
		</view>
		<view class="pad-x">
			<view class="promo card" v-for="p in promos" :key="p.id" @tap="openPromo(p)">
				<view class="promo-poster">
					<lwf-poster :main="p.main" :sub="p.sub" :theme="p.theme" />
					<text class="rib">{{ p.badge }}</text>
				</view>
				<view class="promo-info">
					<text class="promo-title ellipsis-2">{{ p.title }}</text>
					<view class="loc">
						<lwf-icon name="location" :size="26" color="#B5B5BC" :stroke="1.8" />
						<text class="loc-t">{{ hotel.city }} | {{ hotel.full }}</text>
					</view>
					<view class="promo-buy">
						<view class="price">
							<text class="cur">¥</text><text class="num">{{ p.price }}</text>
							<text class="price-old">¥{{ p.old }}</text>
						</view>
						<view class="btn btn-primary btn-sm">立即购买</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 精选客房 -->
		<view class="sec-bar">
			<text class="bar"></text><text class="t">精选客房</text>
			<text class="more" @tap="goUrl('/pages/rooms/rooms')">查看全部 ›</text>
		</view>
		<scroll-view scroll-x class="hscroll" :show-scrollbar="false">
			<view class="hroom" v-for="r in rooms" :key="r.id" @tap="openRoom(r)">
				<view class="hroom-img">
					<image v-if="r.coverUrl" class="hroom-photo" :src="r.coverUrl" mode="aspectFill" />
					<lwf-scene v-else :scene="r.scene" icon="bed" :iconSize="90" />
				</view>
				<view class="hroom-b">
					<text class="hroom-n ellipsis">{{ r.name }}</text>
					<text class="hroom-s">{{ r.area }}㎡ · {{ r.bed }}</text>
					<view class="price"><text class="cur">¥</text><text class="num">{{ r.price }}</text><text class="suf">起</text></view>
				</view>
			</view>
		</scroll-view>

		<!-- 平云山居精选餐饮 -->
		<view class="sec-head">
			<text class="line"></text>
			<text class="txt">平云山居 · 精选</text>
			<text class="line r"></text>
		</view>
		<view class="grid pad-x">
			<view class="dish card" v-for="d in dishes" :key="d.id" @tap="openDish(d)">
				<view class="dish-poster"><lwf-poster :main="d.main" :sub="d.sub" :theme="d.theme" /></view>
				<view class="dish-b">
					<text class="dish-t ellipsis-2">{{ d.title }}</text>
					<view class="price"><text class="cur">¥</text><text class="num">{{ d.price }}</text><text class="price-old">¥{{ d.old }}</text></view>
				</view>
			</view>
		</view>

		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { sceneBg } from '@/common/mock.js'
import { api } from '@/common/api.js'
export default {
	data() {
		return { hotel: { name: '平云山居', full: '平云山居', city: '广州' }, banners: [], entries: [], promos: [], rooms: [], dishes: [] }
	},
	onLoad() { this.load() },
	methods: {
		async load() {
			try {
				const d = await api.home()
				this.hotel = d.hotel; this.banners = d.banners; this.entries = d.entries
				this.promos = d.promos; this.rooms = d.rooms; this.dishes = d.dishes
			} catch (e) {}
		},
		bg(s) { return sceneBg(s) },
		openBanner(b) {
			// 轮播点击：按场景跳到对应频道
			const tabMap = { dine: '/pages/dining/dining', dish: '/pages/dining/dining' }
			const navMap = { night: '/pages/recharge/recharge', card: '/pages/recharge/recharge', recharge: '/pages/recharge/recharge' }
			if (tabMap[b.scene]) { uni.navigateTo({ url: tabMap[b.scene] }); return }
			if (navMap[b.scene]) { uni.navigateTo({ url: navMap[b.scene] }); return }
			uni.navigateTo({ url: '/pages/rooms/rooms' })
		},
		go(e) {
			if (e.tab) uni.switchTab({ url: e.url })
			else uni.navigateTo({ url: e.url })
		},
		goUrl(url) { uni.navigateTo({ url }) },
		openPromo(p) { uni.navigateTo({ url: `/pages/product-detail/product-detail?type=promo&id=${p.id}` }) },
		openRoom(r) { uni.navigateTo({ url: `/pages/room-detail/room-detail?id=${r.id}` }) },
		openDish(d) { uni.navigateTo({ url: `/pages/product-detail/product-detail?type=dish&id=${d.id}` }) }
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }

/* 轮播 */
.banner { padding: 24rpx 28rpx 8rpx; }
.banner .sw { width: 100%; height: 320rpx; border-radius: $r-lg; overflow: hidden; box-shadow: $shadow; }
.bslide { position: relative; width: 100%; height: 100%; }
.bsheen { position: absolute; inset: 0; background: linear-gradient(115deg, rgba(255,255,255,.28), transparent 45%), linear-gradient(0deg, rgba(0,0,0,.28), transparent 55%); }
.bcontent { position: absolute; left: 36rpx; bottom: 40rpx; right: 36rpx; }
.btag { display: block; font-size: 20rpx; letter-spacing: 3rpx; color: rgba(255,255,255,.85); margin-bottom: 12rpx; }
.btitle { display: block; font-size: 42rpx; font-weight: 800; color: #fff; text-shadow: 0 3rpx 12rpx rgba(0,0,0,.35); }
.bsub { display: block; font-size: 24rpx; color: rgba(255,255,255,.92); margin-top: 8rpx; text-shadow: 0 2rpx 8rpx rgba(0,0,0,.3); }

/* 金刚区 */
.entries { display: flex; margin: 16rpx 28rpx 8rpx; padding: 32rpx 12rpx; }
.entry { flex: 1; display: flex; flex-direction: column; align-items: center; }
.etile {
	width: 96rpx; height: 96rpx; border-radius: 28rpx; margin-bottom: 16rpx;
	display: flex; align-items: center; justify-content: center;
	background: linear-gradient(135deg, #FDEEEF, #FBE0E2);
	box-shadow: inset 0 0 0 1rpx rgba(193,39,45,.08);
}
.ename { font-size: 25rpx; color: $ink-2; font-weight: 600; }

/* 促销卡片 */
.promo { display: flex; padding: 20rpx; margin-bottom: 24rpx; }
.promo-poster { position: relative; width: 240rpx; height: 240rpx; border-radius: $r; overflow: hidden; flex-shrink: 0; }
.rib { position: absolute; top: 0; left: 0; padding: 4rpx 16rpx; font-size: 19rpx; color: #fff; background: linear-gradient(135deg,#E8484F,#9E1B22); border-radius: $r 0 16rpx 0; box-shadow: 0 4rpx 10rpx rgba(158,27,34,.3); }
.promo-info { flex: 1; min-width: 0; padding-left: 22rpx; display: flex; flex-direction: column; }
.promo-title { font-size: 28rpx; font-weight: 600; line-height: 1.45; color: $ink; }
.loc { display: flex; align-items: center; margin-top: 12rpx; }
.loc-t { font-size: 22rpx; color: $ink-4; margin-left: 4rpx; }
.promo-buy { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 16rpx; }

/* 横滑客房 */
.hscroll { white-space: nowrap; padding: 6rpx 28rpx 24rpx; }
.hroom { display: inline-block; width: 300rpx; margin-right: 22rpx; background: $card; border-radius: $r-lg; box-shadow: $shadow; overflow: hidden; vertical-align: top; }
.hroom-img { width: 100%; height: 200rpx; overflow: hidden; }
.hroom-photo { width: 100%; height: 100%; display: block; }
.hroom-b { padding: 18rpx 20rpx 22rpx; }
.hroom-n { display: block; font-size: 27rpx; font-weight: 700; }
.hroom-s { display: block; font-size: 21rpx; color: $ink-4; margin: 8rpx 0 12rpx; }

/* 餐饮网格 */
.grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.dish { width: 332rpx; margin-bottom: 24rpx; }
.dish-poster { width: 100%; height: 300rpx; }
.dish-b { padding: 18rpx 20rpx 22rpx; }
.dish-t { font-size: 26rpx; font-weight: 600; line-height: 1.4; min-height: 72rpx; }
.dish-b .price { margin-top: 8rpx; }
</style>
