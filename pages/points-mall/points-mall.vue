<template>
	<view class="page-wrap">
		<!-- 暗色头部 -->
		<view class="mhead">
			<view class="mh-tabs">
				<view class="mh-tab" @tap="goPoints">积分明细</view>
				<view class="mh-div"></view>
				<view class="mh-tab" @tap="showRules">积分规则</view>
			</view>
			<view class="mh-bal">
				<text class="mh-lab">当前可用积分</text>
				<text class="mh-num">{{ store.points }}</text>
			</view>
		</view>

		<!-- 分类 -->
		<scroll-view scroll-x class="mtabs" :show-scrollbar="false">
			<view class="mtab" :class="{on: cat===i}" v-for="(c,i) in cats" :key="i" @tap="cat=i">
				<text>{{ c }}</text>
				<view v-if="cat===i" class="mtab-ul"></view>
			</view>
		</scroll-view>

		<view class="grid pad-x">
			<view class="goods card" v-for="g in list" :key="g.id" @tap="redeem(g)">
				<view class="goods-img"><lwf-scene :scene="g.scene" :icon="gIcon(g)" :iconSize="110" /></view>
				<view class="goods-b">
					<text class="goods-t ellipsis-2">{{ g.title }}</text>
					<view class="goods-foot">
						<view class="goods-pt"><text class="gp-n">{{ g.points }}</text><text class="gp-u">积分</text></view>
						<view class="btn btn-primary btn-sm goods-btn">兑换</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!list.length" class="empty">
			<lwf-icon name="gift" :size="120" color="#DCDCE2" :stroke="1.3" />
			<text class="empty-t">该分类暂无可兑换商品</text>
		</view>
		<text v-else class="tail">没有更多了</text>
		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { api } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() { return { cats: [], mall: [], cat: 0, store } },
	onLoad() { api.mall().then(r => { this.cats = r.tabs; this.mall = r.items }).catch(() => {}) },
	computed: { list() { return this.mall.filter(g => g.cat === this.cat) } },
	methods: {
		goPoints() { uni.navigateTo({ url: '/pages/points/points' }) },
		showRules() {
			uni.showModal({
				title: '积分规则',
				content: '1. 消费每满 1 元累计 1 积分，储值同步赠送积分。\n2. 积分可在积分商城兑换房券、餐饮券等礼遇。\n3. 下单时 100 积分可抵 1 元，单笔最多抵 20 元。\n4. 积分自获取之日起 2 年内有效。',
				showCancel: false, confirmText: '我知道了'
			})
		},
		gIcon(g) { return g.scene === 'dine' ? 'dish' : (g.scene === 'mooncake' ? 'gift' : (g.scene === 'night' ? 'card' : 'bed')) },
		redeem(g) {
			if (store.points < g.points) {
				uni.showToast({ title: `还差 ${g.points - store.points} 积分`, icon: 'none' })
				return
			}
			uni.showModal({
				title: '积分兑换', content: `确认使用 ${g.points} 积分兑换「${g.title}」？`,
				confirmColor: '#C1272D',
				success: r => {
					if (r.confirm) {
						api.redeem(g.id).then(() => {
							store.refreshMember()
							uni.showToast({ title: '兑换成功', icon: 'success' })
						}).catch(() => {})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
.mhead { background: linear-gradient(180deg,#2B2B30,#3A3A40); padding: 8rpx 28rpx 30rpx; }
.mh-tabs { display: flex; align-items: center; justify-content: center; padding: 12rpx 0 24rpx; }
.mh-tab { font-size: 28rpx; color: rgba(255,255,255,.55); padding: 0 36rpx; }
.mh-tab.on { color: #fff; font-weight: 700; }
.mh-div { width: 1rpx; height: 28rpx; background: rgba(255,255,255,.25); }
.mh-bal { display: flex; flex-direction: column; align-items: center; }
.mh-lab { font-size: 22rpx; color: rgba(255,255,255,.6); }
.mh-num { font-size: 64rpx; font-weight: 800; color: #F6E3B6; font-family: "DIN Alternate",sans-serif; line-height: 1.2; }

.mtabs { white-space: nowrap; background: $card; padding: 6rpx 16rpx 0; box-shadow: $shadow-sm; position: sticky; top: 0; z-index: 5; }
.mtab { display: inline-flex; flex-direction: column; align-items: center; padding: 22rpx 24rpx; font-size: 27rpx; color: $ink-2; }
.mtab.on { color: $brand; font-weight: 700; }
.mtab-ul { width: 36rpx; height: 5rpx; border-radius: 3rpx; background: $brand; margin-top: 10rpx; }

.grid { display: flex; flex-wrap: wrap; justify-content: space-between; padding-top: 24rpx; }
.goods { width: 332rpx; margin-bottom: 24rpx; }
.goods-img { width: 100%; height: 240rpx; }
.goods-b { padding: 18rpx 20rpx 20rpx; }
.goods-t { font-size: 26rpx; font-weight: 600; line-height: 1.4; min-height: 72rpx; }
.goods-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 10rpx; }
.goods-pt { display: flex; align-items: baseline; color: $brand; }
.gp-n { font-size: 40rpx; font-weight: 800; font-family: "DIN Alternate",sans-serif; }
.gp-u { font-size: 22rpx; margin-left: 4rpx; }
.goods-btn { height: 52rpx; padding: 0 28rpx; }

.empty { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }
.empty-t { font-size: 26rpx; color: $ink-4; margin-top: 24rpx; }
.tail { display: block; text-align: center; font-size: 22rpx; color: $ink-4; margin: 14rpx 0 30rpx; }
</style>
