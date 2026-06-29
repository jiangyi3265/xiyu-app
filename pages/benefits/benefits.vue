<template>
	<view class="page-wrap">
		<!-- 会员卡轮播 -->
		<view class="cards">
			<swiper class="cw" circular :indicator-dots="false" previous-margin="60rpx" next-margin="60rpx" @change="onCard">
				<swiper-item v-for="(lv,i) in levels" :key="i">
					<view class="mcard" :class="{cur: cur===i}">
						<view class="mc-sheen"></view>
						<view class="mc-top"><text class="mc-cn">会员卡</text></view>
						<view class="mc-mid">
							<text class="mc-en">LOYALTY</text>
							<text class="mc-pg">P · R · O · G · R · A · M</text>
						</view>
						<view class="mc-foot">
							<text class="mc-lv">{{ lv }}</text>
							<text class="mc-id">NO. {{ member.id }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots">
				<view class="dot" :class="{on: cur===i}" v-for="(lv,i) in levels" :key="i"></view>
			</view>
		</view>

		<view class="sec-head">
			<text class="line"></text><text class="txt">会员权益</text><text class="line r"></text>
		</view>
		<text class="lv-tip">当前等级：{{ member.level }} · 享 {{ benefits.length }} 项专属权益</text>

		<view class="card ben-card">
			<view class="ben-grid">
				<view class="ben" v-for="b in benefits" :key="b.name">
					<view class="ben-ic"><lwf-icon :name="b.icon" :size="56" color="#C1272D" :stroke="1.6" /></view>
					<text class="ben-n">{{ b.name }}</text>
					<text v-if="b.val" class="ben-v">{{ b.val }}</text>
				</view>
			</view>
		</view>

		<view class="declare card">
			<view class="b-head"><text class="b-bar"></text><text class="b-t">升级礼遇与权益声明</text></view>
			<text class="dec-p">1. 会员权益依据会员等级享有，等级越高礼遇越丰厚；</text>
			<text class="dec-p">2. 多倍积分、免费升级等权益需在预订时满足相应条件后生效；</text>
			<text class="dec-p">3. 最终解释权归 {{ hotel.full }} 所有。</text>
		</view>
		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { HOTEL } from '@/common/mock.js'
import { api } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() { return { hotel: HOTEL, member: store.member, levels: [], benefits: [], cur: 0 } },
	onLoad() { api.benefits().then(r => { this.levels = r.levels; this.benefits = r.benefits }).catch(() => {}) },
	methods: { onCard(e) { this.cur = e.detail.current } }
}
</script>

<style lang="scss">
.cards { padding: 30rpx 0 6rpx; }
.cw { width: 100%; height: 320rpx; }
.mcard {
	position: relative; width: 100%; height: 290rpx; margin-top: 15rpx; border-radius: 24rpx; overflow: hidden;
	background: linear-gradient(135deg, #EBD9AC 0%, #CBA559 38%, #B68F3C 60%, #DBC489 100%);
	box-shadow: 0 16rpx 36rpx rgba(150,110,40,.3); transform: scale(.93); transition: transform .3s;
	padding: 34rpx 36rpx;
}
.mcard.cur { transform: scale(1); }
.mc-sheen { position: absolute; inset: 0; background: linear-gradient(125deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,.25) 55%, rgba(255,255,255,0) 75%); }
.mc-top { position: relative; display: flex; justify-content: flex-end; }
.mc-cn { font-size: 26rpx; font-weight: 700; color: #5A3E14; letter-spacing: 4rpx; }
.mc-mid { position: relative; margin-top: 26rpx; }
.mc-en { font-size: 64rpx; font-weight: 800; color: #4A3210; letter-spacing: 8rpx; line-height: 1; }
.mc-pg { display: block; font-size: 20rpx; color: rgba(74,50,16,.7); letter-spacing: 6rpx; margin-top: 10rpx; }
.mc-foot { position: absolute; left: 36rpx; right: 36rpx; bottom: 30rpx; display: flex; align-items: flex-end; justify-content: space-between; }
.mc-lv { font-size: 30rpx; font-weight: 800; color: #4A3210; }
.mc-id { font-size: 22rpx; color: rgba(74,50,16,.65); letter-spacing: 1rpx; }
.dots { display: flex; justify-content: center; gap: 10rpx; margin-top: 18rpx; }
.dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: #E0D2B4; }
.dot.on { width: 28rpx; border-radius: 6rpx; background: $gold; }

.lv-tip { display: block; text-align: center; font-size: 23rpx; color: $ink-3; margin: -8rpx 0 20rpx; }
.ben-card { margin: 0 28rpx; padding: 16rpx 8rpx; }
.ben-grid { display: flex; flex-wrap: wrap; }
.ben { width: 33.33%; display: flex; flex-direction: column; align-items: center; padding: 34rpx 0; }
.ben-ic { width: 100rpx; height: 100rpx; border-radius: 28rpx; background: linear-gradient(135deg,#FDEEEF,#FBE0E2); display: flex; align-items: center; justify-content: center; margin-bottom: 16rpx; }
.ben-n { font-size: 24rpx; color: $ink-2; text-align: center; padding: 0 8rpx; }
.ben-v { font-size: 22rpx; color: $brand; font-weight: 700; margin-top: 4rpx; }

.declare { margin: 22rpx 28rpx 0; padding: 28rpx; }
.b-head { display: flex; align-items: center; margin-bottom: 14rpx; }
.b-bar { width: 6rpx; height: 28rpx; border-radius: 4rpx; background: linear-gradient(180deg,$brand-soft,$brand); margin-right: 14rpx; }
.b-t { font-size: 30rpx; font-weight: 700; }
.dec-p { display: block; font-size: 24rpx; color: $ink-3; line-height: 1.8; }
</style>
