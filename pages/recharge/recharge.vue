<template>
	<view class="page-wrap">
		<view class="head">
			<text class="h-t">选择充值金额</text>
			<text class="h-s">储值尊享好礼 · "储"即发</text>
		</view>

		<view class="pad-x">
			<view v-for="r in list" :key="r.id" class="rc" :class="{on: sel===r.id}" @tap="pick(r.id)">
				<!-- 头部徽章 -->
				<view class="rc-top">
					<text class="rc-badge">限时购</text>
					<view v-if="sel===r.id" class="cd">
						<text class="cd-lab">距结束</text>
						<text class="cd-d">{{ cd.d }}</text><text class="cd-u">天</text>
						<text class="cd-b">{{ cd.h }}</text><text class="cd-c">:</text>
						<text class="cd-b">{{ cd.m }}</text><text class="cd-c">:</text>
						<text class="cd-b">{{ cd.s }}</text>
					</view>
				</view>

				<text class="rc-title">{{ r.title }}</text>

				<view class="rc-main">
					<view class="rc-amt"><text class="ai">充</text><text class="ac">¥</text><text class="an">{{ r.amount }}</text></view>
					<view v-if="sel===r.id" class="stepper">
						<view class="st-b" @tap.stop="dec"><lwf-icon name="minus" :size="26" color="#8A8A90" :stroke="2" /></view>
						<text class="st-n">{{ qty }}</text>
						<view class="st-b" @tap.stop="inc"><lwf-icon name="plus" :size="26" color="#C1272D" :stroke="2" /></view>
					</view>
					<view v-else class="radio" :class="{on: sel===r.id}"></view>
				</view>

				<text class="rc-give">送{{ r.give }}元 · 另送价值{{ r.coupon }}元赠券</text>

				<!-- 赠送礼包 -->
				<view v-if="sel===r.id && r.gift" class="gift">
					<view class="gift-l"><text class="g1">赠送</text><text class="g2">礼包</text></view>
					<view class="gift-c">
						<text class="gift-n ellipsis">{{ r.gift.name }} <text class="gift-p">¥{{ r.gift.price }}</text> ×{{ r.gift.qty }}</text>
						<text class="gift-v">有效期 {{ r.gift.valid }}</text>
					</view>
					<view class="gift-more" @tap.stop="giftDetail(r)"><text>查看详情</text><lwf-icon name="arrow" :size="22" color="#B5B5BC" :stroke="2" /></view>
				</view>
			</view>
		</view>
		<view class="safe-bottom" style="height:calc(160rpx + env(safe-area-inset-bottom))"></view>

		<!-- 底部 -->
		<view class="bar">
			<view class="bar-home" @tap="goHome">
				<lwf-icon name="store" :size="40" color="#8A8A90" :stroke="1.6" /><text>首页</text>
			</view>
			<view class="bar-amt">
				<view class="price big"><text class="cur">¥</text><text class="num">{{ payAmount }}</text></view>
				<text class="bar-sub">实际需支付金额</text>
			</view>
			<view class="btn btn-primary bar-pay" @tap="payself">给自己充值</view>
		</view>
	</view>
</template>

<script>
import { api } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() {
		return { list: [], sel: null, qty: 1, cd: { d:'00', h:'00', m:'00', s:'00' }, timer: null }
	},
	computed: {
		cur() { return this.list.find(r => r.id === this.sel) || this.list[0] || { amount: 0, give: 0, coupon: 0 } },
		payAmount() { return this.cur.amount * this.qty }
	},
	onLoad() {
		api.recharges().then(list => {
			this.list = list
			const hot = list.find(r => r.hot)
			this.sel = hot ? hot.id : (list[0] && list[0].id)
		}).catch(() => {})
		this.tick(); this.timer = setInterval(this.tick, 1000)
	},
	onUnload() { if (this.timer) clearInterval(this.timer) },
	methods: {
		tick() {
			// 滚动倒计时：每 3 天一轮，永远显示有效剩余时间（避免硬编码日期过期后恒为 0）
			const period = 3 * 86400 * 1000
			const end = Math.ceil((Date.now() + 1) / period) * period
			let s = Math.max(0, Math.floor((end - Date.now()) / 1000))
			const d = Math.floor(s / 86400); s -= d * 86400
			const h = Math.floor(s / 3600); s -= h * 3600
			const m = Math.floor(s / 60); s -= m * 60
			const p = n => String(n).padStart(2, '0')
			this.cd = { d: p(d), h: p(h), m: p(m), s: p(s) }
		},
		giftDetail(r) {
			if (!r.gift) return
			uni.showModal({
				title: '赠送礼包详情',
				content: `${r.gift.name}\n单价 ¥${r.gift.price} · 数量 ×${r.gift.qty}\n有效期 ${r.gift.valid}\n\n充值成功后礼包将自动发放至您的账户。`,
				showCancel: false, confirmText: '好的'
			})
		},
		pick(id) { this.sel = id; this.qty = 1 },
		inc() { this.qty++ },
		dec() { if (this.qty > 1) this.qty-- },
		goHome() { uni.switchTab({ url: '/pages/index/index' }) },
		payself() {
			const r = this.cur
			store.setDraft({
				scene: 'night', kind: 'recharge', rechargeId: r.id,
				title: `储值充值 ¥${r.amount} ×${this.qty}`,
				desc: `送${r.give * this.qty}元 · 赠券价值${r.coupon * this.qty}元`,
				unit: r.amount, qty: this.qty, total: this.payAmount,
				amount: r.amount * this.qty, give: r.give * this.qty
			})
			uni.navigateTo({ url: '/pages/checkout/checkout' })
		}
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
.head { padding: 30rpx 28rpx 8rpx; }
.h-t { font-size: 34rpx; font-weight: 800; }
.h-s { display: block; font-size: 23rpx; color: $ink-3; margin-top: 6rpx; }

.rc { background: $card; border-radius: $r-lg; padding: 24rpx 26rpx; margin-bottom: 22rpx; box-shadow: $shadow-sm; border: 2rpx solid transparent; transition: all .2s; }
.rc.on { box-shadow: $shadow; border-color: rgba(193,39,45,.25); }
.rc-top { display: flex; align-items: center; min-height: 44rpx; }
.rc-badge { font-size: 20rpx; color: #fff; background: linear-gradient(135deg,#C77,#A33); padding: 4rpx 16rpx; border-radius: 8rpx 0 8rpx 0; }
.rc.on .rc-badge { background: linear-gradient(135deg,$brand-soft,$brand-deep); }
.cd { display: flex; align-items: center; margin-left: 16rpx; background: $brand-wash; padding: 6rpx 16rpx; border-radius: 999rpx; }
.cd-lab { font-size: 21rpx; color: $ink-3; margin-right: 10rpx; }
.cd-d { font-size: 26rpx; font-weight: 800; color: $brand; }
.cd-u { font-size: 21rpx; color: $ink-3; margin: 0 6rpx 0 2rpx; }
.cd-b { font-size: 24rpx; font-weight: 800; color: #fff; background: $brand; border-radius: 6rpx; padding: 2rpx 8rpx; font-family: "DIN Alternate",sans-serif; }
.cd-c { color: $brand; font-weight: 800; margin: 0 4rpx; }

.rc-title { display: block; font-size: 25rpx; color: $ink-2; margin: 16rpx 0; line-height: 1.5; }
.rc-main { display: flex; align-items: center; justify-content: space-between; }
.rc-amt { display: flex; align-items: baseline; color: $brand; }
.ai { font-size: 28rpx; font-weight: 700; margin-right: 8rpx; color: $ink; }
.ac { font-size: 30rpx; font-weight: 800; }
.an { font-size: 64rpx; font-weight: 800; line-height: 1; font-family: "DIN Alternate",sans-serif; }
.radio { width: 38rpx; height: 38rpx; border-radius: 50%; border: 2rpx solid $line; }
.stepper { display: flex; align-items: center; border: 1rpx solid $line; border-radius: 999rpx; overflow: hidden; }
.st-b { width: 60rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; }
.st-n { width: 70rpx; text-align: center; font-size: 30rpx; font-weight: 700; }
.rc-give { display: block; font-size: 24rpx; color: $brand; margin-top: 12rpx; font-weight: 600; }

.gift { display: flex; align-items: center; margin-top: 22rpx; padding-top: 22rpx; border-top: 1rpx dashed #E6E6EA; }
.gift-l { width: 76rpx; height: 76rpx; border-radius: 14rpx; background: linear-gradient(135deg,#FBE9C8,#EBD09A); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
.gift-l .g1, .gift-l .g2 { font-size: 24rpx; font-weight: 800; color: #8A5A1E; line-height: 1.2; }
.gift-c { flex: 1; min-width: 0; padding: 0 16rpx; }
.gift-n { display: block; font-size: 24rpx; color: $ink; }
.gift-p { color: $brand; font-weight: 700; }
.gift-v { display: block; font-size: 21rpx; color: $ink-4; margin-top: 6rpx; }
.gift-more { display: flex; align-items: center; font-size: 22rpx; color: $ink-4; flex-shrink: 0; }

.bar { position: fixed; left:0; right:0; bottom:0; z-index:20; display: flex; align-items: center; padding: 14rpx 24rpx calc(14rpx + env(safe-area-inset-bottom)); background: rgba(255,255,255,.97); box-shadow: 0 -6rpx 24rpx rgba(0,0,0,.06); }
.bar-home { display: flex; flex-direction: column; align-items: center; margin-right: 18rpx; }
.bar-home text { font-size: 19rpx; color: $ink-3; margin-top: 2rpx; }
.bar-amt { display: flex; flex-direction: column; flex: 1; }
.bar-amt .price.big .num { font-size: 46rpx; }
.bar-sub { font-size: 20rpx; color: $ink-4; }
.bar-pay { height: 80rpx; padding: 0 48rpx; }
</style>
