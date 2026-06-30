<template>
	<view class="page-wrap" v-if="d">
		<!-- 商品 -->
		<view class="card prod">
			<view class="prod-img">
				<image v-if="d.coverUrl" class="prod-photo" :src="d.coverUrl" mode="aspectFill" />
				<lwf-scene v-else :scene="d.scene" :icon="sceneIcon" :iconSize="70" />
			</view>
			<view class="prod-c">
				<text class="prod-t ellipsis-2">{{ d.title }}</text>
				<text class="prod-d">{{ d.desc }}</text>
				<view class="prod-b">
					<view class="price"><text class="cur">¥</text><text class="num">{{ d.unit }}</text></view>
					<text class="qty">×{{ d.qty }}</text>
				</view>
			</view>
		</view>

		<!-- 联系人 -->
		<view class="card list">
			<view class="li">
				<lwf-icon name="user" :size="36" color="#C1272D" :stroke="1.7" />
				<text class="li-l">联系人</text>
				<text class="li-v">{{ member.name }}</text>
			</view>
			<view class="hr"></view>
			<view class="li">
				<lwf-icon name="phone" :size="36" color="#C1272D" :stroke="1.7" />
				<text class="li-l">手机号</text>
				<text v-if="!needBindPhone" class="li-v">{{ displayPhone }}</text>
				<button v-else class="phone-auth" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">授权手机号</button>
			</view>
		</view>

		<!-- 优惠 -->
		<view class="card list">
			<view class="li tap" @tap="toggleCoupon">
				<lwf-icon name="ticket" :size="36" color="#C1272D" :stroke="1.7" />
				<text class="li-l">优惠券</text>
				<text class="li-v" :class="{red: coupon>0}">{{ coupon>0 ? '-¥'+coupon : (couponable+'张可用') }}</text>
				<lwf-icon name="arrow" :size="26" color="#C9C9CF" :stroke="2" />
			</view>
			<view class="hr"></view>
			<view class="li">
				<lwf-icon name="coin" :size="36" color="#C1272D" :stroke="1.7" />
				<text class="li-l">积分抵扣</text>
				<text class="li-sub">可用 {{ store.points }} 积分</text>
				<switch :checked="usePoints" color="#C1272D" style="transform:scale(.8)" @change="onPoints" />
			</view>
		</view>

		<!-- 价格明细 -->
		<view class="card detail">
			<view class="dl"><text>商品金额</text><text>¥{{ d.total }}</text></view>
			<view class="dl" v-if="coupon>0"><text>优惠券</text><text class="red">-¥{{ coupon }}</text></view>
			<view class="dl" v-if="pointCut>0"><text>积分抵扣</text><text class="red">-¥{{ pointCut }}</text></view>
			<view class="hr"></view>
			<view class="dl total"><text>实付金额</text><view class="price big"><text class="cur">¥</text><text class="num">{{ payable }}</text></view></view>
		</view>

		<view class="agree" @tap="agreed = !agreed">
			<view class="cbx" :class="{on: agreed}">
				<lwf-icon v-if="agreed" name="check" :size="22" color="#fff" :stroke="2.6" />
			</view>
			<text>下单即代表同意</text><text class="lnk" @tap.stop="showTerms">《预订与使用条款》</text>
		</view>
		<view class="safe-bottom" style="height:calc(160rpx + env(safe-area-inset-bottom))"></view>

		<view class="bar">
			<view class="bar-amt">
				<text class="bar-lab">实付</text>
				<view class="price big"><text class="cur">¥</text><text class="num">{{ payable }}</text></view>
			</view>
			<view class="btn btn-primary bar-btn" @tap="submit">提交订单</view>
		</view>
	</view>

	<view v-else class="empty-wrap">
		<lwf-icon name="ticket" :size="120" color="#D8D8DE" :stroke="1.4" />
		<text class="empty-t">暂无结算商品</text>
		<view class="btn btn-ghost" @tap="goHome">去首页逛逛</view>
	</view>
</template>

<script>
import { store } from '@/common/store.js'
import { api, wxRequestPayment } from '@/common/api.js'
export default {
	data() { return { member: store.member, store, d: null, coupons: [], couponIdx: -1, usePoints: false, submitting: false, agreed: false } },
	computed: {
		sceneIcon() { return this.d && this.d.scene === 'dine' ? 'dish' : (this.d && this.d.scene === 'night' ? 'card' : 'bed') },
		displayPhone() { return (this.member.phone || '').replace('86-', '') },
		needBindPhone() { return !/^1\d{10}$/.test(this.displayPhone) },
		couponable() { return this.coupons.length },
		coupon() { return this.couponIdx >= 0 && this.coupons[this.couponIdx] ? this.coupons[this.couponIdx].amount : 0 },
		pointCut() {
			if (!this.usePoints) return 0
			return Math.min(20, Math.floor(store.points / 100))   // 100积分=1元，最多抵20
		},
		payable() { return this.d ? Math.max(0, this.d.total - this.coupon - this.pointCut) : 0 }
	},
	onLoad() {
		this.d = store.draft
		if (this.d && this.d.kind !== 'recharge') {
			api.coupons('0').then(list => {
				this.coupons = list.filter(c => this.d.total >= c.cond)
			}).catch(() => {})
		}
	},
	methods: {
		toggleCoupon() {
			if (!this.d || this.d.kind === 'recharge' || !this.coupons.length) return
			this.couponIdx = this.couponIdx + 1 >= this.coupons.length ? -1 : this.couponIdx + 1
			if (this.couponIdx >= 0) uni.showToast({ title: '已选 ¥' + this.coupons[this.couponIdx].amount + ' 优惠券', icon: 'none' })
		},
		onPoints(e) { this.usePoints = e.detail.value },
		async onGetPhoneNumber(e) {
			const code = e && e.detail && e.detail.code
			if (!code) {
				uni.showToast({ title: '未授权手机号', icon: 'none' })
				return
			}
			try {
				await store.bindWeixinPhone(code)
				uni.showToast({ title: '手机号已绑定', icon: 'success' })
			} catch (err) {
				uni.showToast({ title: (err && err.msg) || '手机号授权失败', icon: 'none' })
			}
		},
		goHome() { uni.switchTab({ url: '/pages/index/index' }) },
		showTerms() {
			uni.showModal({
				title: '预订与使用条款',
				content: '1. 在线支付订单一经确认不可退改（可退房型以详情页取消规则为准）。\n2. 优惠券、积分抵扣不与其他优惠叠加。\n3. 储值赠送部分不可提现。\n4. 入住需出示有效证件，最终解释权归平云山居所有。',
				showCancel: false, confirmText: '我已阅读'
			})
		},
		async submit() {
			if (this.submitting || !this.d) return
			if (!this.agreed) { uni.showToast({ title: '请先阅读并同意预订与使用条款', icon: 'none' }); return }
			if (this.needBindPhone) { uni.showToast({ title: '请先授权手机号', icon: 'none' }); return }
			this.submitting = true; let r = null
			try {
				if (this.d.kind === 'recharge') {
					r = await api.recharge(this.d.rechargeId, this.d.qty)
				} else {
					r = await api.createOrder({
						kind: this.d.kind, scene: this.d.scene, title: this.d.title, desc: this.d.desc,
						unitPrice: this.d.unit, qty: this.d.qty, amount: this.d.total,
						couponMcId: this.couponIdx >= 0 ? this.coupons[this.couponIdx].id : null,
						usePoints: this.usePoints, roomId: this.d.roomId, productId: this.d.productId,
						checkIn: this.d.checkIn, checkOut: this.d.checkOut
					})
				}
				if (r && r.needPay && r.pay) {
						try {
							await wxRequestPayment(r.pay)
						} catch (e) {
							store.setDraft(null)
							uni.showToast({ title: '支付未完成，可在订单中继续支付', icon: 'none' })
							setTimeout(() => uni.switchTab({ url: '/pages/order/order' }), 900)
							return
						}
					}
					await store.refreshMember()
				store.setDraft(null)
				uni.showToast({ title: (r && r.needPay) ? '支付成功' : '下单成功', icon: 'success' })
				setTimeout(() => uni.switchTab({ url: '/pages/order/order' }), 850)
			} catch (e) {
				this.submitting = false
			}
		}
	}
}
</script>

<style lang="scss">
.prod { display: flex; margin: 24rpx 28rpx 0; padding: 24rpx; }
.prod-img { width: 150rpx; height: 150rpx; border-radius: $r; overflow: hidden; flex-shrink: 0; }
.prod-photo { width: 100%; height: 100%; display: block; }
.prod-c { flex: 1; min-width: 0; padding-left: 22rpx; display: flex; flex-direction: column; }
.prod-t { font-size: 28rpx; font-weight: 600; line-height: 1.45; }
.prod-d { font-size: 23rpx; color: $ink-4; margin-top: 8rpx; }
.prod-b { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; }
.qty { font-size: 24rpx; color: $ink-3; }

.list { margin: 20rpx 28rpx 0; padding: 6rpx 28rpx; }
.li { display: flex; align-items: center; padding: 26rpx 0; }
.li-l { font-size: 27rpx; color: $ink; margin-left: 16rpx; }
.li-v { margin-left: auto; font-size: 27rpx; color: $ink; font-weight: 500; }
.li-v.red { color: $brand; font-weight: 700; }
.li-sub { margin-left: auto; font-size: 23rpx; color: $ink-4; margin-right: 12rpx; }
.li .lwf-icon:last-child { margin-left: 12rpx; }
.phone-auth { margin-left: auto; padding: 0 24rpx; height: 56rpx; line-height: 56rpx; border-radius: 28rpx; background: $brand; color: #fff; font-size: 24rpx; }
.phone-auth::after { border: 0; }

.detail { margin: 20rpx 28rpx 0; padding: 28rpx; }
.dl { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; font-size: 26rpx; color: $ink-2; }
.dl .red { color: $brand; }
.dl.total { padding-top: 18rpx; }
.dl.total text:first-child { font-size: 28rpx; font-weight: 700; color: $ink; }
.detail .price.big .num { font-size: 48rpx; }

.agree { display: flex; align-items: center; justify-content: center; margin: 28rpx; font-size: 23rpx; color: $ink-3; }
.agree text { margin-left: 4rpx; }
.agree .lnk { color: $brand; }
.cbx { width: 34rpx; height: 34rpx; border-radius: 50%; border: 1rpx solid #C9C9CF; display: flex; align-items: center; justify-content: center; margin-right: 8rpx; flex-shrink: 0; }
.cbx.on { background: $brand; border-color: $brand; }

.bar { position: fixed; left:0; right:0; bottom:0; z-index:20; display: flex; align-items: center; padding: 16rpx 28rpx calc(16rpx + env(safe-area-inset-bottom)); background: rgba(255,255,255,.97); box-shadow: 0 -6rpx 24rpx rgba(0,0,0,.06); }
.bar-amt { display: flex; align-items: baseline; flex: 1; }
.bar-lab { font-size: 24rpx; color: $ink-2; margin-right: 8rpx; }
.bar-amt .price.big .num { font-size: 52rpx; }
.bar-btn { height: 84rpx; padding: 0 64rpx; }

.empty-wrap { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.empty-t { font-size: 28rpx; color: $ink-4; margin: 24rpx 0 36rpx; }
</style>
