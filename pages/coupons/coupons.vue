<template>
	<view class="page-wrap">
		<!-- 顶部分类 -->
		<view class="cats">
			<view class="cat" :class="{on: cat===i}" v-for="(c,i) in catList" :key="i" @tap="cat=i">
				<text>{{ c }}</text>
				<view v-if="cat===i" class="cat-ul"></view>
			</view>
		</view>

		<!-- 状态 -->
		<view class="subs">
			<view class="sub" :class="{on: sub===s.key}" v-for="s in subList" :key="s.key" @tap="sub=s.key">{{ s.name }}</view>
		</view>

		<view class="pad-x">
			<block>
				<view class="cp" :class="{dead: sub!=='avail'}" v-for="c in list" :key="c.id">
					<view class="cp-l">
						<view class="cp-amt"><text class="cur">¥</text><text class="num">{{ c.amount }}</text></view>
						<text class="cp-cond">满¥{{ c.cond }}可用</text>
					</view>
					<view class="cp-notch top"></view>
					<view class="cp-notch bot"></view>
					<view class="cp-c">
						<text class="cp-t ellipsis">{{ c.title }}</text>
						<text class="cp-d ellipsis">{{ c.desc }}</text>
						<text class="cp-v">有效期至 {{ c.valid }}</text>
						<view class="cp-more" @tap.stop="detail(c)"><text>查看详情</text><lwf-icon name="arrow" :size="22" color="#C9C9CF" :stroke="2" /></view>
					</view>
					<view class="cp-r">
						<view v-if="sub==='avail'" class="btn btn-primary btn-sm cp-use" @tap="use(c)">去使用</view>
						<view v-else-if="sub==='used'" class="cp-stamp">已使用</view>
						<view v-else class="cp-stamp">{{ c.reason || '已失效' }}</view>
					</view>
				</view>

				<view v-if="!list.length" class="empty">
					<lwf-icon name="ticket" :size="120" color="#DCDCE2" :stroke="1.3" />
					<text class="empty-t">暂无{{ subName }}的优惠券</text>
				</view>
				<text v-else class="tail">没有更多券啦</text>
				<view class="findmore" @tap="findMore"><text class="fm-t">找不到您想要的券？</text><text class="fm-l">点此查看 ›</text></view>
			</block>

			</view>
		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { api } from '@/common/api.js'
export default {
	data() {
		return {
			avail: [], used: [], expired: [], cat: 0,
			catList: ['优惠券','权益券','礼遇券','其他券'],
			sub: 'avail',
			subList: [{ key:'avail', name:'待使用' }, { key:'used', name:'已使用' }, { key:'expired', name:'已失效' }]
		}
	},
	onShow() {
		api.coupons('').then(list => {
			this.avail = list.filter(c => c.status === '0')
			this.used = list.filter(c => c.status === '1')
			this.expired = list.filter(c => c.status === '2')
		}).catch(() => {})
	},
	computed: {
		list() {
			const byStatus = { avail: this.avail, used: this.used, expired: this.expired }[this.sub] || []
			return byStatus.filter(c => (c.cat || 0) === this.cat)
		},
		subName() { return (this.subList.find(s => s.key===this.sub) || {}).name }
	},
	methods: {
		use(c) {
			// 去使用：带用户回首页挑选可用此券的商品（券在结算页自动抵扣）
			uni.showToast({ title: '请选择商品使用该券', icon: 'none' })
			setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 600)
		},
		detail(c) {
			uni.showModal({
				title: c.title,
				content: `面额：¥${c.amount}\n使用门槛：满¥${c.cond}可用\n有效期至：${c.valid}\n说明：${c.desc || '无'}`,
				showCancel: false, confirmText: '知道了'
			})
		},
		findMore() {
			uni.showModal({
				title: '领券中心', content: '更多优惠券可在首页活动与储值有礼中领取，敬请关注平云山居最新活动。',
				confirmText: '去首页', cancelText: '取消',
				success: r => { if (r.confirm) uni.switchTab({ url: '/pages/index/index' }) }
			})
		}
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
.cats { display: flex; background: $card; padding: 0 12rpx; box-shadow: $shadow-sm; }
.cat { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 24rpx 0; font-size: 28rpx; color: $ink-2; }
.cat.on { color: $brand; font-weight: 700; }
.cat-ul { width: 40rpx; height: 5rpx; border-radius: 3rpx; background: $brand; margin-top: 10rpx; }

.subs { display: flex; gap: 18rpx; padding: 26rpx 28rpx 8rpx; }
.sub { padding: 10rpx 32rpx; font-size: 25rpx; color: $ink-2; background: $card; border-radius: 999rpx; box-shadow: $shadow-sm; }
.sub.on { color: $brand; background: $brand-wash; font-weight: 700; }

.cp { position: relative; display: flex; align-items: stretch; background: $card; border-radius: $r-lg; margin-top: 22rpx; box-shadow: $shadow; overflow: hidden; }
.cp-l { width: 220rpx; flex-shrink: 0; background: linear-gradient(135deg,#E8484F,#BC1F26); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 36rpx 0; }
.cp.dead .cp-l { background: linear-gradient(135deg,#C7C7CC,#A8A8AE); }
.cp-amt { display: flex; align-items: baseline; }
.cp-amt .cur { font-size: 30rpx; font-weight: 700; }
.cp-amt .num { font-size: 76rpx; font-weight: 800; line-height: 1; font-family: "DIN Alternate",sans-serif; }
.cp-cond { font-size: 21rpx; margin-top: 12rpx; opacity: .92; }
/* 票券缺口 */
.cp-notch { position: absolute; left: 206rpx; width: 28rpx; height: 28rpx; border-radius: 50%; background: $bg; }
.cp-notch.top { top: -14rpx; }
.cp-notch.bot { bottom: -14rpx; }
.cp-c { flex: 1; min-width: 0; padding: 26rpx 24rpx; border-left: 2rpx dashed #ECECEF; display: flex; flex-direction: column; }
.cp-t { font-size: 27rpx; font-weight: 700; color: $ink; }
.cp.dead .cp-t { color: $ink-3; }
.cp-d { font-size: 22rpx; color: $ink-4; margin-top: 8rpx; }
.cp-v { font-size: 21rpx; color: $ink-4; margin-top: 8rpx; }
.cp-more { display: flex; align-items: center; margin-top: 12rpx; font-size: 21rpx; color: $ink-4; }
.cp-r { display: flex; align-items: center; padding-right: 24rpx; }
.cp-use { height: 58rpx; }
.cp-stamp { font-size: 22rpx; color: $ink-4; background: $bg; padding: 10rpx 18rpx; border-radius: 999rpx; }

.empty { display: flex; flex-direction: column; align-items: center; padding: 110rpx 0; }
.empty-t { font-size: 26rpx; color: $ink-4; margin-top: 24rpx; }
.tail { display: block; text-align: center; font-size: 23rpx; color: $ink-4; margin: 34rpx 0 10rpx; }
.findmore { display: flex; align-items: center; justify-content: center; padding-bottom: 20rpx; }
.fm-t { font-size: 23rpx; color: $ink-3; }
.fm-l { font-size: 23rpx; color: $brand; }
</style>
