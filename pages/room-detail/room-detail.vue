<template>
	<view class="page-wrap" v-if="room">
		<view class="hero"><lwf-scene :scene="room.scene" icon="bed" :iconSize="200" /></view>

		<view class="sheet">
			<view class="rt-head">
				<text class="rt-name">{{ room.name }}</text>
				<view class="price big"><text class="cur">¥</text><text class="num">{{ room.price }}</text><text class="suf">起/晚</text></view>
			</view>
			<view class="tags">
				<text class="tag" v-for="t in room.tags" :key="t">{{ t }}</text>
			</view>

			<view class="info">
				<view class="irow"><text class="il">床　　型</text><text class="iv">{{ room.bed }}</text></view>
				<view class="irow"><text class="il">面　　积</text><text class="iv">{{ room.area }}㎡</text></view>
				<view class="irow"><text class="il">窗　　户</text><text class="iv">{{ room.win }}</text></view>
				<view class="irow"><text class="il">房型特色</text><text class="iv fill">{{ room.feature }}</text></view>
			</view>
		</view>

		<view class="block">
			<view class="b-head"><text class="b-bar"></text><text class="b-t">预订专享</text></view>
			<view class="irow" v-if="checkIn"><text class="il">入住日期</text><text class="iv fill">{{ checkIn }} 至 {{ checkOut }}（共 {{ nights }} 晚）</text></view>
			<view class="irow"><text class="il">积　　分</text><text class="iv fill">该房型参与了积分活动，入住可获 {{ room.price }} 积分</text></view>
		</view>

		<view class="block">
			<view class="b-head"><text class="b-bar"></text><text class="b-t">设施服务</text></view>
			<view class="facs">
				<view class="fac" v-for="f in room.facilities" :key="f">
					<lwf-icon name="check" :size="26" color="#C1272D" :stroke="2" /><text>{{ f }}</text>
				</view>
			</view>
		</view>

		<view class="block">
			<view class="b-head"><text class="b-bar"></text><text class="b-t">取消规则</text></view>
			<text class="b-p">{{ room.cancel }}</text>
			<text class="b-p muted">含双早 / 单早视房型而定，详情以前台为准。</text>
		</view>

		<view class="safe-bottom" style="height:calc(170rpx + env(safe-area-inset-bottom))"></view>

		<!-- 底部预订栏 -->
		<view class="bar">
			<view class="bar-left">
				<view class="price big"><text class="cur">¥</text><text class="num">{{ total }}</text></view>
				<text class="bar-sub">{{ availText }}</text>
			</view>
			<view class="btn bar-btn" :class="soldOut ? 'btn-ghost' : 'btn-primary'" @tap="book">{{ soldOut ? '已订满' : '立即预订' }}</view>
		</view>
	</view>
</template>

<script>
import { api } from '@/common/api.js'
import { store } from '@/common/store.js'
export default {
	data() { return { room: null, nights: 1, checkIn: '', checkOut: '', available: null } },
	computed: {
		total() { return this.room ? this.room.price * this.nights : 0 },
		soldOut() { return this.available === 0 },
		availText() {
			if (this.available === null) return `${this.nights}晚 · 含税费`
			return this.available === 0 ? '该日期已订满' : `${this.nights}晚 · 剩 ${this.available} 间`
		}
	},
	onLoad(q) {
		this.nights = Number(q.nights) || 1
		this.checkIn = q.checkIn || this.today()
		this.checkOut = q.checkOut || this.addDays(this.checkIn, this.nights)
		api.room(q.id).then(r => { this.room = r; uni.setNavigationBarTitle({ title: r.name }); this.loadAvailability() }).catch(() => {})
	},
	methods: {
		today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` },
		addDays(s, n) { const d = new Date(s); d.setDate(d.getDate() + Number(n || 1)); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` },
		loadAvailability() {
			if (!this.room) return
			api.roomAvailability(this.room.id, this.checkIn, this.checkOut).then(r => { this.available = (r && typeof r.available === 'number') ? r.available : null }).catch(() => {})
		},
		book() {
			if (this.soldOut) { uni.showToast({ title: '该日期已订满', icon: 'none' }); return }
			const dateDesc = this.checkIn ? `${this.checkIn} 入住 · ` : ''
			store.setDraft({
				scene: this.room.scene,
				kind: 'room',
				roomId: this.room.id,
				checkIn: this.checkIn,
				checkOut: this.checkOut,
				title: `${this.room.name} · ${this.nights}间夜`,
				desc: `${dateDesc}入住 ${this.nights} 晚 · 含早`,
				unit: this.room.price,
				qty: this.nights,
				total: this.total
			})
			uni.navigateTo({ url: '/pages/checkout/checkout' })
		}
	}
}
</script>

<style lang="scss">
.hero { width: 100%; height: 460rpx; }
.sheet {
	position: relative; margin-top: -40rpx; background: $card;
	border-radius: $r-xl $r-xl 0 0; padding: 36rpx 32rpx 28rpx; box-shadow: $shadow;
}
.rt-head { display: flex; align-items: flex-end; justify-content: space-between; }
.rt-name { font-size: 40rpx; font-weight: 800; }
.price.big .num { font-size: 52rpx; }
.tags { display: flex; gap: 12rpx; margin: 20rpx 0 4rpx; }

.info { margin-top: 20rpx; }
.irow { display: flex; padding: 18rpx 0; border-bottom: 1rpx solid $line; }
.block .irow:last-child, .info .irow:last-child { border-bottom: 0; }
.il { width: 132rpx; color: $ink-3; font-size: 27rpx; flex-shrink: 0; letter-spacing: 2rpx; }
.iv { color: $ink; font-size: 27rpx; font-weight: 500; }
.iv.fill { flex: 1; line-height: 1.6; }

.block { background: $card; margin: 20rpx 28rpx 0; border-radius: $r-lg; padding: 28rpx; box-shadow: $shadow; }
.b-head { display: flex; align-items: center; margin-bottom: 10rpx; }
.b-bar { width: 6rpx; height: 28rpx; border-radius: 4rpx; background: linear-gradient(180deg,$brand-soft,$brand); margin-right: 14rpx; }
.b-t { font-size: 30rpx; font-weight: 700; }
.b-p { display: block; font-size: 26rpx; color: $ink-2; line-height: 1.7; margin-top: 8rpx; }
.facs { display: flex; flex-wrap: wrap; }
.fac { width: 33.33%; display: flex; align-items: center; padding: 12rpx 0; }
.fac text { font-size: 25rpx; color: $ink-2; margin-left: 8rpx; }

.bar {
	position: fixed; left: 0; right: 0; bottom: 0; z-index: 20;
	display: flex; align-items: center; padding: 18rpx 28rpx calc(18rpx + env(safe-area-inset-bottom));
	background: rgba(255,255,255,.96); box-shadow: 0 -6rpx 24rpx rgba(0,0,0,.06);
	backdrop-filter: blur(10px);
}
.bar-left { display: flex; flex-direction: column; }
.bar-sub { font-size: 21rpx; color: $ink-4; margin-top: 2rpx; }
.bar-btn { flex: 1; max-width: 320rpx; margin-left: auto; height: 84rpx; }
</style>
