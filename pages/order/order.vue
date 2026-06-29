<template>
	<view class="page-wrap">
		<!-- 搜索 -->
		<view class="searchbar">
			<view class="sb-in">
				<lwf-icon name="search" :size="32" color="#B5B5BC" :stroke="1.8" />
				<input class="sb-ip" v-model="kw" placeholder="请输入产品名称" placeholder-class="ph" confirm-type="search" @confirm="onSearch" />
			</view>
			<text class="sb-btn" @tap="onSearch">搜索</text>
		</view>

		<!-- 状态标签 -->
		<scroll-view scroll-x class="tabs" :show-scrollbar="false">
			<view class="tab" :class="{on: tab===t.key}" v-for="t in tabs" :key="t.key" @tap="tab=t.key">
				<text>{{ t.name }}</text>
				<view v-if="tab===t.key" class="tab-ul"></view>
			</view>
		</scroll-view>

		<!-- 订单列表 -->
		<view class="pad-x">
			<view class="order card" v-for="o in list" :key="o.id">
				<view class="o-main" @tap="openDetail(o)">
					<view class="o-head">
						<text class="o-shop">{{ o.shop }}</text>
						<text class="o-status" :class="o.status">{{ o.statusText }}</text>
					</view>
					<view class="o-body">
						<view class="o-img"><lwf-scene :scene="o.scene" :icon="oIcon(o)" :iconSize="62" /></view>
						<view class="o-c">
							<view class="o-tt">
								<text v-if="o.tagText" class="o-tag">{{ o.tagText }}</text>
								<text class="o-title ellipsis-2">{{ o.title }}</text>
							</view>
							<view class="o-price"><text class="cur">¥</text><text class="num">{{ money(o.price) }}</text></view>
						</view>
					</view>
				</view>
				<view class="o-foot">
					<text class="o-no">订单号 {{ o.id }}</text>
					<view class="o-acts">
						<block v-for="a in actions(o)" :key="a">
							<button
								v-if="a === '联系客服'"
								class="btn btn-ghost btn-sm act-contact"
								open-type="contact"
								:show-message-card="true"
								:send-message-title="o.title"
								send-message-path="/pages/order/order"
							>{{ a }}</button>
							<view v-else class="btn btn-ghost btn-sm" @tap="act(a, o)">{{ a }}</view>
						</block>
					</view>
				</view>
			</view>

			<view v-if="!list.length" class="empty">
				<lwf-icon name="list" :size="120" color="#DCDCE2" :stroke="1.3" />
				<text class="empty-t">该状态下暂无订单</text>
			</view>
		</view>
		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { ORDER_TABS } from '@/common/mock.js'
import { api, wxRequestPayment } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() { return { tabs: ORDER_TABS, tab: 'all', kw: '', orders: [] } },
	computed: {
		list() {
			let arr = this.orders
			if (this.tab !== 'all') arr = arr.filter(o => o.status === this.tab)
			if (this.kw) arr = arr.filter(o => o.title.indexOf(this.kw) >= 0)
			return arr
		}
	},
	onShow() {
		// 从会员中心宫格跳来时定位到对应状态 tab
		if (store.orderTab) { this.tab = store.orderTab; store.orderTab = '' }
		this.load()
	},
	methods: {
		load() { api.orders('all').then(list => { this.orders = list }).catch(() => {}) },
		openDetail(o) { store.currentOrder = o; uni.navigateTo({ url: '/pages/order-detail/order-detail?oid=' + o.oid }) },
		onSearch() { uni.hideKeyboard && uni.hideKeyboard() },
		money(n) { return Number(n).toFixed(2) },
		oIcon(o) { return o.scene === 'dine' ? 'dish' : (o.scene === 'mooncake' ? 'gift' : (o.scene === 'coupon' ? 'ticket' : 'bed')) },
		actions(o) {
			const m = {
				done: [o.reviewed ? '已评价' : '去评价', '删除订单'],
				use: ['去退款', '去使用'],
				pay: ['取消', '去支付'],
				confirm: ['联系客服'],
				cancel: ['删除订单'],
				refund: ['删除订单'],
				expired: ['删除订单']
			}
			return m[o.status] || []
		},
		act(a, o) {
			if (a === '去支付') {
				uni.showModal({
					title: '订单支付', content: `需支付 ¥${this.money(o.price)}\n确认支付后订单将转为"待使用"。`,
					confirmText: '确认支付',
					success: r => {
						if (r.confirm) {
							api.prepayOrder(o.oid).then(res => {
								if (res && res.needPay && res.pay) { wxRequestPayment(res.pay).then(() => { uni.showToast({ title: '支付成功', icon: 'success' }); this.load() }).catch(() => { uni.showToast({ title: '支付未完成', icon: 'none' }); this.load() }); return }
								uni.showToast({ title: '支付成功', icon: 'success' })
								this.load()
							}).catch(() => {})
						}
					}
				})
				return
			}
			if (a === '已评价') { uni.showToast({ title: '您已评价过该订单', icon: 'none' }); return }
			if (a === '去评价') {
				uni.showModal({
					title: '评价订单', editable: true, placeholderText: '说说您的入住/用餐体验…', confirmText: '提交评价',
					success: r => {
						if (!r.confirm) return
						api.review(o.oid, (r.content || '').trim() || '好评', 5).then(() => {
							uni.showToast({ title: '评价成功，感谢反馈', icon: 'success' })
							this.load()
						}).catch(() => {})
					}
				})
				return
			}
			if (a === '去使用') {
				uni.showModal({
					title: '出示核销码',
					content: `核销码：${o.id}\n请到店出示给工作人员，确认使用后完成核销。`,
					confirmText: '确认核销',
					success: r => {
						if (r.confirm) {
							api.useOrder(o.oid).then(() => {
								uni.showToast({ title: '核销成功', icon: 'success' })
								this.load()
							}).catch(() => {})
						}
					}
				})
				return
			}
			if (a === '去退款' || a === '退款') {
				uni.showModal({ title: '申请退款', content: '确认申请退款该订单？', confirmText: '确认退款', success: r => {
					if (r.confirm) {
						api.refundOrder(o.oid).then(() => {
							uni.showToast({ title: '退款成功', icon: 'success' })
							this.load()
						}).catch(() => {})
					}
				}})
				return
			}
			if (a === '取消') {
				uni.showModal({ title: '提示', content: '确认取消该订单？', success: r => {
					if (r.confirm) api.cancelOrder(o.oid).then(() => this.load()).catch(() => {})
				}})
				return
			}
			if (a === '删除订单') {
				uni.showModal({ title: '提示', content: '确认删除该订单？', success: r => {
					if (r.confirm) api.deleteOrder(o.oid).then(() => this.load()).catch(() => {})
				}})
				return
			}
			uni.showToast({ title: a, icon: 'none' })
		}
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
.searchbar { display: flex; align-items: center; background: $card; padding: 18rpx 28rpx; }
.sb-in { flex: 1; display: flex; align-items: center; height: 68rpx; background: $bg; border-radius: 999rpx; padding: 0 24rpx; }
.sb-ip { flex: 1; font-size: 26rpx; margin-left: 12rpx; }
.ph { color: $ink-4; }
.sb-btn { font-size: 28rpx; color: $ink; font-weight: 600; padding-left: 24rpx; }

.tabs { white-space: nowrap; background: $card; padding: 4rpx 16rpx 0; box-shadow: $shadow-sm; }
.tab { display: inline-flex; flex-direction: column; align-items: center; padding: 18rpx 22rpx; font-size: 27rpx; color: $ink-2; }
.tab.on { color: $brand; font-weight: 700; }
.tab-ul { width: 40rpx; height: 5rpx; border-radius: 3rpx; background: $brand; margin-top: 10rpx; }

.order { margin-top: 22rpx; padding: 26rpx 26rpx 22rpx; }
.o-head { display: flex; align-items: center; justify-content: space-between; }
.o-shop { font-size: 26rpx; color: $ink-2; font-weight: 600; }
.o-status { font-size: 26rpx; font-weight: 700; color: $ink-3; }
.o-status.done, .o-status.use, .o-status.pay { color: $brand; }
.o-status.confirm { color: #C9A24B; }
.o-status.cancel, .o-status.refund, .o-status.expired { color: $ink-4; }
.o-body { display: flex; margin: 24rpx 0; }
.o-img { width: 130rpx; height: 130rpx; border-radius: $r; overflow: hidden; flex-shrink: 0; }
.o-c { flex: 1; min-width: 0; padding-left: 22rpx; display: flex; flex-direction: column; }
.o-tt { display: flex; align-items: flex-start; }
.o-tag { font-size: 19rpx; color: #fff; background: linear-gradient(135deg,$brand-soft,$brand); padding: 3rpx 10rpx; border-radius: 6rpx; margin-right: 10rpx; flex-shrink: 0; line-height: 1.6; }
.o-title { font-size: 27rpx; color: $ink; line-height: 1.45; }
.o-price { margin-top: auto; color: $ink; font-weight: 800; }
.o-price .cur { font-size: 22rpx; }
.o-price .num { font-size: 36rpx; font-family: "DIN Alternate",sans-serif; }
.o-foot { display: flex; align-items: center; padding-top: 20rpx; border-top: 1rpx solid $line; }
.o-no { font-size: 22rpx; color: $ink-4; }
.o-acts { margin-left: auto; display: flex; gap: 16rpx; }
.act-contact { margin: 0; border: 0; background: transparent; line-height: normal; }
.act-contact::after { border: 0; }

.empty { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }
.empty-t { font-size: 26rpx; color: $ink-4; margin-top: 24rpx; }
</style>
