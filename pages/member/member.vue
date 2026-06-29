<template>
	<view class="page-wrap">
		<!-- 会员头部 -->
		<view class="header">
			<view class="h-bg"></view>
			<view class="h-row">
				<view class="avatar">{{ member.name.charAt(0) }}</view>
				<view class="h-info">
					<view class="h-name">{{ member.name }}<text class="lv">{{ member.level }}</text></view>
					<text class="h-id">会员 ID {{ member.id }}</text>
				</view>
				<view class="h-edit" @tap="go('/pages/profile/profile')">
					<lwf-icon name="edit" :size="32" color="rgba(255,255,255,.9)" :stroke="1.7" />
				</view>
			</view>

			<!-- 储值横幅 -->
			<view class="vbanner" @tap="go('/pages/recharge/recharge')">
				<view class="vb-l"><text class="yi">¥</text></view>
				<view class="vb-c">
					<text class="vb-t">会员储值尊享好礼</text>
					<text class="vb-s">— "储" 即发 · 充值送豪礼 —</text>
				</view>
				<view class="vb-go">GO</view>
			</view>
		</view>

		<!-- 资产卡 -->
		<view class="assets card">
			<view class="asset" @tap="go('/pages/points/points')">
				<text class="a-num">{{ store.points }}</text><text class="a-lab">积分</text>
			</view>
			<view class="a-div"></view>
			<view class="asset" @tap="go('/pages/coupons/coupons')">
				<text class="a-num">{{ store.coupons }}</text><text class="a-lab">优惠券</text>
			</view>
			<view class="a-div"></view>
			<view class="asset" @tap="go('/pages/recharge/recharge')">
				<text class="a-num">{{ store.balance }}</text><text class="a-lab">储值余额</text>
			</view>
		</view>

		<!-- 我的订单 -->
		<view class="card panel">
			<view class="p-head">
				<text class="p-t">我的订单</text>
				<view class="p-more" @tap="goOrder('all')"><text>全部</text><lwf-icon name="arrow" :size="24" color="#B5B5BC" :stroke="2" /></view>
			</view>
			<view class="quick">
				<view class="q" v-for="q in quick" :key="q.key" @tap="goOrder(q.key)">
					<view class="q-ic">
						<lwf-icon :name="q.icon" :size="52" color="#C1272D" :stroke="1.6" />
						<text v-if="badge(q.key)" class="q-badge">{{ badge(q.key) }}</text>
					</view>
					<text class="q-n">{{ q.name }}</text>
				</view>
			</view>
		</view>

		<!-- 服务 -->
		<view class="card panel">
			<view class="p-head"><text class="p-t">尊享服务</text></view>
			<view class="grid8">
				<block v-for="s in services" :key="s.key">
					<button
						v-if="s.key === 'kefu'"
						class="g8 service-btn"
						open-type="contact"
						:show-message-card="true"
						send-message-title="平云山居客服"
						send-message-path="/pages/member/member"
					>
						<lwf-icon :name="s.icon" :size="50" color="#C1272D" :stroke="1.6" />
						<text class="g8-n">{{ s.name }}</text>
					</button>
					<view v-else class="g8" @tap="goService(s)">
						<lwf-icon :name="s.icon" :size="50" color="#C1272D" :stroke="1.6" />
						<text class="g8-n">{{ s.name }}</text>
					</view>
				</block>
			</view>
		</view>

		<!-- 商品推荐 -->
		<view class="sec-bar"><text class="bar"></text><text class="t">商品推荐</text></view>
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
import { ORDER_QUICK, SERVICES } from '@/common/mock.js'
import { api } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() { return { member: store.member, quick: ORDER_QUICK, services: SERVICES, dishes: [], store, orders: [] } },
	onLoad() { api.products('dish').then(list => { this.dishes = list }).catch(() => {}) },
	onShow() {
		store.refreshMember().catch(() => {})
		api.orders('all').then(list => { this.orders = list }).catch(() => {})
	},
	methods: {
		badge(key) {
			const m = { pay: 'pay', confirm: 'confirm', use: 'use' }
			if (!m[key]) return 0
			return this.orders.filter(o => o.status === m[key]).length
		},
		go(url) { url && uni.navigateTo({ url }) },
		goOrder(status) { store.orderTab = status || 'all'; uni.switchTab({ url: '/pages/order/order' }) },
		goService(s) {
			if (!s.url) { uni.showToast({ title: '功能开发中', icon: 'none' }); return }
			uni.navigateTo({ url: s.url })
		},
		openDish(d) { uni.navigateTo({ url: `/pages/product-detail/product-detail?type=dish&id=${d.id}` }) }
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
/* 头部 */
.header { position: relative; padding: 16rpx 28rpx 70rpx; }
.h-bg { position: absolute; inset: -2rpx 0 0; background: linear-gradient(160deg, #C92B32 0%, #A81C24 55%, #8C141C 100%); }
.h-bg::after { content: ''; position: absolute; inset: 0; opacity: .25; background: radial-gradient(circle at 85% 0%, rgba(255,220,170,.5), transparent 45%); }
.h-row { position: relative; display: flex; align-items: center; padding: 14rpx 4rpx 30rpx; }
.avatar { width: 110rpx; height: 110rpx; border-radius: 50%; background: linear-gradient(135deg,#F4DCA4,#D6AE63); color: #7A4F18; font-size: 46rpx; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 3rpx solid rgba(255,255,255,.7); box-shadow: 0 6rpx 18rpx rgba(0,0,0,.18); }
.h-info { flex: 1; padding-left: 24rpx; }
.h-name { font-size: 38rpx; font-weight: 800; color: #fff; display: flex; align-items: center; }
.lv { font-size: 20rpx; font-weight: 600; color: #6B3E12; background: linear-gradient(135deg,#F4DCA4,#D6AE63); padding: 4rpx 14rpx; border-radius: 999rpx; margin-left: 16rpx; }
.h-id { display: block; font-size: 22rpx; color: rgba(255,255,255,.8); margin-top: 10rpx; }
.h-edit { width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; }

.vbanner { position: relative; display: flex; align-items: center; background: linear-gradient(100deg, #2A1112, #4A1A1C); border: 1rpx solid rgba(240,214,150,.4); border-radius: 18rpx; padding: 22rpx 26rpx; box-shadow: 0 10rpx 26rpx rgba(0,0,0,.22); }
.vb-l .yi { font-size: 48rpx; font-weight: 800; color: #F0D696; }
.vb-c { flex: 1; padding-left: 22rpx; }
.vb-t { display: block; font-size: 30rpx; font-weight: 800; color: #F6E3B6; letter-spacing: 2rpx; }
.vb-s { display: block; font-size: 21rpx; color: rgba(246,227,182,.7); margin-top: 6rpx; }
.vb-go { width: 76rpx; height: 76rpx; border-radius: 50%; background: linear-gradient(135deg,#F4DCA4,#CFA456); color: #6B3E12; font-size: 28rpx; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 4rpx 12rpx rgba(0,0,0,.25); }

/* 资产卡 */
.assets { display: flex; align-items: center; margin: -48rpx 28rpx 0; position: relative; padding: 34rpx 0; }
.asset { flex: 1; display: flex; flex-direction: column; align-items: center; }
.a-num { font-size: 44rpx; font-weight: 800; color: $ink; font-family: "DIN Alternate",sans-serif; }
.a-lab { font-size: 23rpx; color: $ink-3; margin-top: 8rpx; }
.a-div { width: 1rpx; height: 56rpx; background: $line; }

/* 面板 */
.panel { margin: 22rpx 28rpx 0; padding: 28rpx; }
.p-head { display: flex; align-items: center; margin-bottom: 24rpx; }
.p-t { font-size: 30rpx; font-weight: 700; }
.p-more { margin-left: auto; display: flex; align-items: center; font-size: 23rpx; color: $ink-4; }
.quick { display: flex; }
.q { flex: 1; display: flex; flex-direction: column; align-items: center; }
.q-ic { position: relative; }
.q-badge { position: absolute; top: -8rpx; right: -14rpx; min-width: 30rpx; height: 30rpx; padding: 0 8rpx; background: $brand; color: #fff; font-size: 19rpx; border-radius: 999rpx; display: flex; align-items: center; justify-content: center; border: 2rpx solid #fff; }
.q-n { font-size: 24rpx; color: $ink-2; margin-top: 14rpx; }

.grid8 { display: flex; flex-wrap: wrap; }
.g8 { width: 25%; display: flex; flex-direction: column; align-items: center; padding: 18rpx 0; }
.service-btn { margin: 0; border: 0; border-radius: 0; background: transparent; line-height: normal; }
.service-btn::after { border: 0; }
.g8-n { font-size: 23rpx; color: $ink-2; margin-top: 14rpx; }

/* 推荐 */
.grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.dish { width: 332rpx; margin-bottom: 24rpx; }
.dish-poster { width: 100%; height: 300rpx; }
.dish-b { padding: 18rpx 20rpx 22rpx; }
.dish-t { font-size: 26rpx; font-weight: 600; line-height: 1.4; min-height: 72rpx; }
.dish-b .price { margin-top: 6rpx; }
</style>
