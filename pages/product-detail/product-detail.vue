<template>
	<view class="page-wrap" v-if="p">
		<view class="hero">
			<lwf-poster :main="p.main" :sub="p.sub" :theme="p.theme" />
		</view>

		<view class="sheet">
			<view class="row-top">
				<view class="price big"><text class="cur">¥</text><text class="num">{{ p.price }}</text><text class="price-old">¥{{ p.old }}</text></view>
				<view class="save" v-if="p.old">立省 ¥{{ p.old - p.price }}</view>
			</view>
			<text class="title">{{ p.title }}</text>
			<view class="loc">
				<lwf-icon name="location" :size="26" color="#B5B5BC" :stroke="1.8" />
				<text class="loc-t">{{ hotel.city }} | {{ hotel.full }}</text>
				<text v-if="p.people" class="people">{{ p.people }}</text>
			</view>
		</view>

		<view class="block" v-if="p.items && p.items.length">
			<view class="b-head"><text class="b-bar"></text><text class="b-t">{{ p.type==='dish' ? '套餐内容' : '套餐包含' }}</text><text class="b-tip">共 {{ p.items.length }} 项</text></view>
			<view class="items">
				<view class="item" v-for="(it,i) in p.items" :key="i">
					<view class="item-dot"><lwf-icon name="check" :size="24" color="#C1272D" :stroke="2.2" /></view>
					<text class="item-t">{{ it }}</text>
				</view>
			</view>
		</view>

		<view class="block">
			<view class="b-head"><text class="b-bar"></text><text class="b-t">使用条款</text></view>
			<view class="terms">
				<view class="term" v-for="(t,i) in terms" :key="i">
					<text class="term-i">{{ i+1 }}</text><text class="term-t">{{ t }}</text>
				</view>
			</view>
		</view>

		<view class="safe-bottom" style="height:calc(170rpx + env(safe-area-inset-bottom))"></view>

		<view class="bar">
			<view class="bar-home" @tap="goHome"><lwf-icon name="store" :size="40" color="#8A8A90" :stroke="1.6" /><text>首页</text></view>
			<view class="bar-amt">
				<view class="price big"><text class="cur">¥</text><text class="num">{{ p.price }}</text></view>
				<text class="bar-sub">优惠价 · 含税</text>
			</view>
			<view class="btn btn-primary bar-btn" @tap="buy">立即购买</view>
		</view>
	</view>
</template>

<script>
import { HOTEL } from '@/common/mock.js'
import { api } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() { return { hotel: HOTEL, p: null } },
	computed: {
		terms() {
			if (this.p && this.p.terms) return this.p.terms.split('；').filter(Boolean)
			return ['请提前1天预订，到店出示订单核销','法定节假日及特殊日期不可用','每单限用一份，不与其他优惠同享','最终解释权归平云山居所有']
		}
	},
	onLoad(q) {
		api.product(q.id).then(p => {
			this.p = p
			uni.setNavigationBarTitle({ title: p.type === 'promo' ? '周年庆套票' : '套餐详情' })
		}).catch(() => {})
	},
	methods: {
		goHome() { uni.switchTab({ url: '/pages/index/index' }) },
		buy() {
			store.setDraft({
				scene: this.p.scene, kind: this.p.type, productId: this.p.id,
				title: this.p.title, desc: this.p.sub || this.p.people || '',
				unit: this.p.price, qty: 1, total: this.p.price
			})
			uni.navigateTo({ url: '/pages/checkout/checkout' })
		}
	}
}
</script>

<style lang="scss">
.hero { width: 100%; height: 480rpx; padding: 28rpx; }
.hero .poster { border-radius: $r-xl; box-shadow: $shadow; }
.sheet { background: $card; margin: -36rpx 28rpx 0; border-radius: $r-xl; padding: 30rpx 28rpx; position: relative; box-shadow: $shadow; }
.row-top { display: flex; align-items: center; }
.price.big .num { font-size: 56rpx; }
.save { margin-left: 16rpx; font-size: 21rpx; color: $brand; background: $brand-wash; padding: 5rpx 16rpx; border-radius: 8rpx; font-weight: 600; }
.title { display: block; font-size: 32rpx; font-weight: 700; line-height: 1.5; margin: 16rpx 0; }
.loc { display: flex; align-items: center; }
.loc-t { font-size: 23rpx; color: $ink-4; margin-left: 4rpx; }
.people { margin-left: auto; font-size: 22rpx; color: $gold-deep; background: rgba(201,162,75,.12); padding: 4rpx 16rpx; border-radius: 999rpx; }

.block { background: $card; margin: 20rpx 28rpx 0; border-radius: $r-lg; padding: 28rpx; box-shadow: $shadow; }
.b-head { display: flex; align-items: center; margin-bottom: 16rpx; }
.b-bar { width: 6rpx; height: 28rpx; border-radius: 4rpx; background: linear-gradient(180deg,$brand-soft,$brand); margin-right: 14rpx; }
.b-t { font-size: 30rpx; font-weight: 700; }
.b-tip, .b-head .b-tip { margin-left: auto; font-size: 22rpx; color: $ink-4; }
.items { display: flex; flex-wrap: wrap; }
.item { width: 50%; display: flex; align-items: center; padding: 12rpx 0; }
.item-dot { width: 36rpx; height: 36rpx; border-radius: 50%; background: $brand-wash; display: flex; align-items: center; justify-content: center; margin-right: 12rpx; flex-shrink: 0; }
.item-t { font-size: 25rpx; color: $ink-2; }
.term { display: flex; align-items: flex-start; padding: 10rpx 0; }
.term-i { width: 34rpx; height: 34rpx; border-radius: 50%; background: $bg; color: $ink-3; font-size: 22rpx; display: flex; align-items: center; justify-content: center; margin-right: 14rpx; flex-shrink: 0; }
.term-t { flex: 1; font-size: 25rpx; color: $ink-2; line-height: 1.6; }

.bar { position: fixed; left:0; right:0; bottom:0; z-index:20; display: flex; align-items: center; padding: 14rpx 24rpx calc(14rpx + env(safe-area-inset-bottom)); background: rgba(255,255,255,.97); box-shadow: 0 -6rpx 24rpx rgba(0,0,0,.06); }
.bar-home { display: flex; flex-direction: column; align-items: center; margin-right: 20rpx; }
.bar-home text { font-size: 19rpx; color: $ink-3; margin-top: 2rpx; }
.bar-amt { display: flex; flex-direction: column; flex: 1; }
.bar-amt .price.big .num { font-size: 46rpx; }
.bar-sub { font-size: 20rpx; color: $ink-4; }
.bar-btn { height: 84rpx; padding: 0 56rpx; }
</style>
