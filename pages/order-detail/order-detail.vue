<template>
	<view class="page-wrap" v-if="o">
		<!-- 状态条 -->
		<view class="st" :class="o.status">
			<text class="st-t">{{ o.statusText }}</text>
			<text class="st-s">{{ statusHint }}</text>
		</view>

		<!-- 商品 -->
		<view class="card prod">
			<view class="prod-img"><lwf-scene :scene="o.scene" :icon="oIcon" :iconSize="70" /></view>
			<view class="prod-c">
				<view class="prod-tt">
					<text v-if="o.tagText" class="prod-tag">{{ o.tagText }}</text>
					<text class="prod-t ellipsis-2">{{ o.title }}</text>
				</view>
				<view class="prod-b">
					<text class="prod-unit">¥{{ money(o.unitPrice) }}</text>
					<text class="prod-qty">×{{ o.qty || 1 }}</text>
				</view>
			</view>
		</view>

		<!-- 价格明细 -->
		<view class="card detail">
			<view class="dl"><text>商品金额</text><text>¥{{ money(o.amount) }}</text></view>
			<view class="dl" v-if="discount > 0"><text>优惠</text><text class="red">-¥{{ money(discount) }}</text></view>
			<view class="hr"></view>
			<view class="dl total"><text>实付金额</text><view class="price big"><text class="cur">¥</text><text class="num">{{ money(o.payAmount) }}</text></view></view>
		</view>

		<!-- 订单信息 -->
		<view class="card info">
			<view class="li"><text class="il">订单编号</text><text class="iv">{{ o.id }}</text><text class="copy" @tap="copyNo">复制</text></view>
			<view class="hr"></view>
			<view class="li"><text class="il">下单时间</text><text class="iv">{{ o.createTime || o.date }}</text></view>
			<view class="hr"></view>
			<view class="li"><text class="il">联系人</text><text class="iv">{{ o.memberName || '—' }}</text></view>
			<view class="hr"></view>
			<view class="li"><text class="il">门店</text><text class="iv">{{ o.shop }}</text></view>
			<view class="hr" v-if="o.remark"></view>
			<view class="li" v-if="o.remark"><text class="il">备注</text><text class="iv">{{ o.remark }}</text></view>
		</view>

		<view class="safe-bottom" style="height:calc(150rpx + env(safe-area-inset-bottom))"></view>

		<!-- 底部操作 -->
		<view class="bar" v-if="acts.length">
			<block v-for="a in acts" :key="a">
				<button
					v-if="a === '联系客服'"
					class="btn btn-ghost bar-btn"
					open-type="contact"
					:show-message-card="true"
					:send-message-title="o.title"
					send-message-path="/pages/order/order"
				>{{ a }}</button>
				<view v-else class="btn bar-btn" :class="primary === a ? 'btn-primary' : 'btn-ghost'" @tap="act(a)">{{ a }}</view>
			</block>
		</view>
	</view>

	<view v-else class="empty-wrap">
		<lwf-icon name="list" :size="120" color="#D8D8DE" :stroke="1.4" />
		<text class="empty-t">订单不存在或已删除</text>
		<view class="btn btn-ghost" @tap="back">返回订单列表</view>
	</view>
</template>

<script>
import { store } from '@/common/store.js'
import { api, wxRequestPayment } from '@/common/api.js'
const STATUS_HINT = {
	pay: '请尽快完成支付', confirm: '商家确认中，请耐心等待', use: '可到店出示核销码使用',
	done: '订单已完成，欢迎再次光临', cancel: '订单已取消', refund: '退款已处理', expired: '订单已过期'
}
export default {
	data() { return { o: null } },
	computed: {
		oIcon() { return this.o.scene === 'dine' ? 'dish' : (this.o.scene === 'mooncake' ? 'gift' : (this.o.scene === 'coupon' ? 'ticket' : 'bed')) },
		statusHint() { return STATUS_HINT[this.o.status] || '' },
		discount() { return Math.max(0, (Number(this.o.amount) || 0) - (Number(this.o.payAmount) || 0)) },
		acts() {
			const m = {
				done: [this.o.reviewed ? '已评价' : '去评价', '删除订单'],
				use: ['去退款', '去使用'],
				pay: ['取消', '去支付'],
				confirm: ['联系客服'],
				cancel: ['删除订单'], refund: ['删除订单'], expired: ['删除订单']
			}
			return m[this.o.status] || []
		},
		primary() { return { use: '去使用', pay: '去支付', done: '去评价' }[this.o.status] || '' }
	},
	onLoad(q) {
		const cur = store.currentOrder
		if (cur && String(cur.oid) === String(q.oid)) { this.o = cur }
		else { api.orders('all').then(list => { this.o = list.find(x => String(x.oid) === String(q.oid)) || null }).catch(() => {}) }
	},
	methods: {
		money(n) { return Number(n || 0).toFixed(2) },
		back() { uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/order/order' }) }) },
		copyNo() { uni.setClipboardData({ data: this.o.id, success: () => uni.showToast({ title: '已复制', icon: 'none' }) }) },
		done(msg) { uni.showToast({ title: msg, icon: 'success' }); setTimeout(() => this.back(), 700) },
		act(a) {
			const o = this.o
			if (a === '去支付') {
				uni.showModal({ title: '订单支付', content: `需支付 ¥${this.money(o.price)}\n确认支付后订单将转为"待使用"。`, confirmText: '确认支付', success: r => {
					if (r.confirm) api.prepayOrder(o.oid).then(res => { if (res && res.needPay && res.pay) { wxRequestPayment(res.pay).then(() => this.done('支付成功')).catch(() => uni.showToast({ title: '支付未完成', icon: 'none' })) } else { this.done('支付成功') } }).catch(() => {})
				}})
				return
			}
			if (a === '去使用') {
				uni.showModal({ title: '出示核销码', content: `核销码：${o.id}\n请到店出示给工作人员，确认使用后完成核销。`, confirmText: '确认核销', success: r => {
					if (r.confirm) api.useOrder(o.oid).then(() => this.done('核销成功')).catch(() => {})
				}})
				return
			}
			if (a === '去退款') {
				uni.showModal({ title: '申请退款', content: '确认申请退款该订单？', confirmText: '确认退款', success: r => {
					if (r.confirm) api.refundOrder(o.oid).then(() => this.done('退款成功')).catch(() => {})
				}})
				return
			}
			if (a === '取消') {
				uni.showModal({ title: '提示', content: '确认取消该订单？', success: r => {
					if (r.confirm) api.cancelOrder(o.oid).then(() => this.done('已取消')).catch(() => {})
				}})
				return
			}
			if (a === '删除订单') {
				uni.showModal({ title: '提示', content: '确认删除该订单？', success: r => {
					if (r.confirm) api.deleteOrder(o.oid).then(() => this.done('已删除')).catch(() => {})
				}})
				return
			}
			if (a === '已评价') { uni.showToast({ title: '您已评价过该订单', icon: 'none' }); return }
			if (a === '去评价') {
				uni.showModal({ title: '评价订单', editable: true, placeholderText: '说说您的入住/用餐体验…', confirmText: '提交评价', success: r => {
					if (!r.confirm) return
					api.review(o.oid, (r.content || '').trim() || '好评', 5).then(() => this.done('评价成功，感谢反馈')).catch(() => {})
				}})
				return
			}
		}
	}
}
</script>

<style lang="scss">
.st { padding: 40rpx 36rpx; color: #fff; background: linear-gradient(135deg, #C92B32, #8C141C); }
.st.pay, .st.use { background: linear-gradient(135deg, #C92B32, #8C141C); }
.st.confirm { background: linear-gradient(135deg, #D79A36, #A8761E); }
.st.done { background: linear-gradient(135deg, #2BB14E, #07A33F); }
.st.cancel, .st.refund, .st.expired { background: linear-gradient(135deg, #8A8A90, #6A6A70); }
.st-t { font-size: 40rpx; font-weight: 800; }
.st-s { display: block; font-size: 24rpx; opacity: .9; margin-top: 12rpx; }

.prod { display: flex; margin: -24rpx 28rpx 0; padding: 26rpx; position: relative; }
.prod-img { width: 150rpx; height: 150rpx; border-radius: $r; overflow: hidden; flex-shrink: 0; }
.prod-c { flex: 1; min-width: 0; padding-left: 22rpx; display: flex; flex-direction: column; }
.prod-tt { display: flex; align-items: flex-start; }
.prod-tag { font-size: 19rpx; color: #fff; background: linear-gradient(135deg,$brand-soft,$brand); padding: 3rpx 10rpx; border-radius: 6rpx; margin-right: 10rpx; flex-shrink: 0; line-height: 1.6; }
.prod-t { font-size: 28rpx; font-weight: 600; line-height: 1.45; }
.prod-b { margin-top: auto; display: flex; align-items: baseline; justify-content: space-between; }
.prod-unit { font-size: 28rpx; color: $ink; font-weight: 700; }
.prod-qty { font-size: 24rpx; color: $ink-3; }

.detail, .info { margin: 20rpx 28rpx 0; padding: 28rpx; }
.dl { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; font-size: 26rpx; color: $ink-2; }
.dl .red { color: $brand; }
.dl.total text:first-child { font-size: 28rpx; font-weight: 700; color: $ink; }
.detail .price.big .num { font-size: 48rpx; }
.hr { height: 1rpx; background: $line; margin: 8rpx 0; }

.li { display: flex; align-items: center; padding: 22rpx 0; }
.il { width: 150rpx; color: $ink-3; font-size: 26rpx; flex-shrink: 0; }
.iv { flex: 1; color: $ink; font-size: 26rpx; word-break: break-all; }
.copy { color: $brand; font-size: 24rpx; padding-left: 16rpx; }

.bar { position: fixed; left:0; right:0; bottom:0; z-index:20; display: flex; justify-content: flex-end; gap: 16rpx; align-items: center; padding: 16rpx 28rpx calc(16rpx + env(safe-area-inset-bottom)); background: rgba(255,255,255,.97); box-shadow: 0 -6rpx 24rpx rgba(0,0,0,.06); }
.bar-btn { height: 76rpx; padding: 0 40rpx; }

.empty-wrap { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.empty-t { font-size: 28rpx; color: $ink-4; margin: 24rpx 0 36rpx; }
</style>
