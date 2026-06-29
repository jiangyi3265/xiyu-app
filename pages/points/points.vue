<template>
	<view class="page-wrap">
		<!-- 积分头部 -->
		<view class="phead">
			<view class="ph-bg"></view>
			<view class="ph-in">
				<text class="ph-lab">我的可用积分</text>
				<text class="ph-num">{{ store.points }}</text>
				<view class="ph-stat">
					<view class="ps"><text class="ps-n">+{{ income }}</text><text class="ps-l">累计获得</text></view>
					<view class="ps-d"></view>
					<view class="ps"><text class="ps-n">{{ outcome }}</text><text class="ps-l">累计使用</text></view>
				</view>
			</view>
			<view class="ph-go" @tap="go('/pages/points-mall/points-mall')">
				<lwf-icon name="gift" :size="30" color="#C1272D" :stroke="1.7" /><text>去兑换</text>
			</view>
		</view>

		<!-- 切换 -->
		<view class="seg">
			<view class="seg-i" :class="{on: tab===t.key}" v-for="t in segs" :key="t.key" @tap="tab=t.key">{{ t.name }}</view>
		</view>

		<view class="pad-x">
			<view class="card logs">
				<view class="log" v-for="(l,i) in list" :key="l.id">
					<view class="log-ic" :class="l.type"><lwf-icon :name="l.type==='in'?'up':'gift'" :size="34" :color="l.type==='in' ? '#C1272D' : '#8A8A90'" :stroke="1.8" /></view>
					<view class="log-c">
						<text class="log-t ellipsis">{{ l.title }}</text>
						<text class="log-d">{{ l.date }}</text>
					</view>
					<text class="log-v" :class="l.type">{{ l.type==='in' ? '+' : '-' }}{{ l.val }}</text>
				</view>
			</view>
			<text class="tail">— 仅展示近期积分明细 —</text>
		</view>
		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { api } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() {
		return {
			logs: [], store, tab: 'all',
			segs: [{ key:'all', name:'全部' }, { key:'in', name:'收入' }, { key:'out', name:'支出' }]
		}
	},
	onShow() { api.points('all').then(r => { this.logs = r.list }).catch(() => {}) },
	computed: {
		income() { return this.logs.filter(l => l.type==='in').reduce((s,l)=>s+l.val,0) },
		outcome() { return this.logs.filter(l => l.type==='out').reduce((s,l)=>s+l.val,0) },
		list() { return this.tab==='all' ? this.logs : this.logs.filter(l => l.type===this.tab) }
	},
	methods: { go(u){ uni.navigateTo({url:u}) } }
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
.phead { position: relative; margin: 24rpx 28rpx 0; border-radius: 24rpx; overflow: hidden; padding: 40rpx 36rpx; box-shadow: $shadow-red; }
.ph-bg { position: absolute; inset: 0; background: linear-gradient(135deg,#C92B32,#9E1B22); }
.ph-bg::after { content:''; position:absolute; inset:0; opacity:.3; background: radial-gradient(circle at 90% 10%, rgba(255,220,170,.6), transparent 50%); }
.ph-in { position: relative; }
.ph-lab { font-size: 24rpx; color: rgba(255,255,255,.85); }
.ph-num { display: block; font-size: 84rpx; font-weight: 800; color: #fff; font-family: "DIN Alternate",sans-serif; line-height: 1.1; text-shadow: 0 4rpx 12rpx rgba(80,8,8,.3); }
.ph-stat { display: flex; align-items: center; margin-top: 18rpx; }
.ps { display: flex; flex-direction: column; }
.ps-n { font-size: 30rpx; font-weight: 700; color: #F6E3B6; }
.ps-l { font-size: 21rpx; color: rgba(255,255,255,.7); margin-top: 4rpx; }
.ps-d { width: 1rpx; height: 48rpx; background: rgba(255,255,255,.25); margin: 0 40rpx; }
.ph-go { position: absolute; top: 36rpx; right: 36rpx; display: flex; flex-direction: column; align-items: center; background: #fff; border-radius: 18rpx; padding: 14rpx 22rpx; }
.ph-go text { font-size: 21rpx; color: $brand; font-weight: 700; margin-top: 4rpx; }

.seg { display: flex; margin: 28rpx 28rpx 4rpx; background: #ECECEF; border-radius: 999rpx; padding: 6rpx; }
.seg-i { flex: 1; text-align: center; height: 60rpx; line-height: 60rpx; font-size: 26rpx; color: $ink-2; border-radius: 999rpx; }
.seg-i.on { background: $card; color: $brand; font-weight: 700; box-shadow: $shadow-sm; }

.logs { margin-top: 22rpx; padding: 8rpx 28rpx; }
.log { display: flex; align-items: center; padding: 26rpx 0; border-bottom: 1rpx solid $line; }
.log:last-child { border-bottom: 0; }
.log-ic { width: 72rpx; height: 72rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.log-ic.in { background: $brand-wash; }
.log-ic.out { background: $bg; }
.log-c { flex: 1; min-width: 0; padding: 0 20rpx; }
.log-t { display: block; font-size: 27rpx; color: $ink; font-weight: 500; }
.log-d { display: block; font-size: 22rpx; color: $ink-4; margin-top: 8rpx; }
.log-v { font-size: 34rpx; font-weight: 800; font-family: "DIN Alternate",sans-serif; }
.log-v.in { color: $brand; }
.log-v.out { color: $ink-3; }
.tail { display: block; text-align: center; font-size: 22rpx; color: $ink-4; margin: 30rpx 0; }
</style>
