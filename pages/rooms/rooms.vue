<template>
	<view class="page-wrap">
		<!-- 日期栏 -->
		<view class="datebar">
			<picker mode="date" :value="checkIn" :start="minIn" @change="onCheckIn">
				<view class="d-col">
					<text class="d-lab">入住</text>
					<text class="d-val">{{ fmt(checkIn) }}</text>
					<text class="d-week">{{ week(checkIn) }}</text>
				</view>
			</picker>
			<view class="d-mid">
				<view class="nights">{{ nights }}晚</view>
				<view class="d-line"></view>
			</view>
			<picker mode="date" :value="checkOut" :start="minOut" @change="onCheckOut">
				<view class="d-col right">
					<text class="d-lab">离店</text>
					<text class="d-val">{{ fmt(checkOut) }}</text>
					<text class="d-week">{{ week(checkOut) }}</text>
				</view>
			</picker>
		</view>

		<!-- 筛选 -->
		<scroll-view scroll-x class="chips" :show-scrollbar="false">
			<view class="chip" :class="{on: cat===c.key}" v-for="c in cats" :key="c.key" @tap="cat=c.key">{{ c.name }}</view>
			<view class="chip filter" @tap="openFilter"><lwf-icon name="filter" :size="26" color="#8A8A90" :stroke="1.8" /><text>{{ sortName }}</text></view>
		</scroll-view>

		<view class="sec-head">
			<text class="line"></text><text class="txt">预订酒店</text><text class="line r"></text>
		</view>

		<view class="pad-x">
			<view class="room card" v-for="r in list" :key="r.id" @tap="open(r)">
				<view class="room-img"><lwf-scene :scene="r.scene" icon="bed" :iconSize="130" :label="r.name" :note="r.area + '㎡ · ' + r.bed" /></view>
				<view class="room-foot">
					<view class="tags">
						<text class="tag" v-for="t in r.tags" :key="t">{{ t }}</text>
					</view>
					<view class="room-buy">
						<view class="price"><text class="cur">¥</text><text class="num">{{ r.price }}</text><text class="suf">起</text></view>
						<view class="btn btn-primary btn-sm">预订</view>
					</view>
				</view>
			</view>
		</view>
		<view class="safe-bottom"></view>
	</view>
</template>

<script>
import { api } from '@/common/api.js'
export default {
	data() {
		return {
			rooms: [],
			cat: 'all',
			cats: [
				{ key: 'all', name: '全部' },
				{ key: 'big', name: '大床房' },
				{ key: 'twin', name: '双床房' },
				{ key: 'suite', name: '套房' }
			],
			checkIn: '',     // YYYY-MM-DD 入住日
			checkOut: '',    // YYYY-MM-DD 离店日
			sort: 'default'  // default | asc | desc
		}
	},
	onLoad() {
		const today = new Date()
		const tomorrow = new Date(today.getTime() + 86400000)
		this.checkIn = this.toStr(today)
		this.checkOut = this.toStr(tomorrow)
		api.rooms().then(list => { this.rooms = list }).catch(() => {})
	},
	computed: {
		minIn() { return this.toStr(new Date()) },
		minOut() { return this.toStr(new Date(new Date(this.checkIn).getTime() + 86400000)) },
		nights() {
			const a = new Date(this.checkIn).getTime(), b = new Date(this.checkOut).getTime()
			return Math.max(1, Math.round((b - a) / 86400000))
		},
		sortName() { return { default: '筛选', asc: '价格↑', desc: '价格↓' }[this.sort] },
		list() {
			let arr = this.rooms
			if (this.cat !== 'all') {
				const map = { big: '大床', twin: '双床', suite: '套' }
				arr = arr.filter(r => r.name.indexOf(map[this.cat]) >= 0 || r.bed.indexOf(map[this.cat]) >= 0)
			}
			if (this.sort === 'asc') arr = [...arr].sort((a, b) => a.price - b.price)
			else if (this.sort === 'desc') arr = [...arr].sort((a, b) => b.price - a.price)
			return arr
		}
	},
	methods: {
		toStr(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` },
		fmt(s) { const p = (s || '').split('-'); return p.length === 3 ? `${p[1]}/${p[2]}` : s },
		week(s) {
			const w = ['周日','周一','周二','周三','周四','周五','周六']
			const d = new Date(s)
			const t = this.toStr(new Date()), tm = this.toStr(new Date(Date.now() + 86400000))
			if (s === t) return '今天'
			if (s === tm) return '明天'
			return w[d.getDay()] || ''
		},
		onCheckIn(e) {
			this.checkIn = e.detail.value
			// 离店必须晚于入住，至少 1 晚
			if (new Date(this.checkOut).getTime() <= new Date(this.checkIn).getTime()) {
				this.checkOut = this.toStr(new Date(new Date(this.checkIn).getTime() + 86400000))
			}
		},
		onCheckOut(e) {
			const out = e.detail.value
			if (new Date(out).getTime() <= new Date(this.checkIn).getTime()) {
				uni.showToast({ title: '离店需晚于入住', icon: 'none' }); return
			}
			this.checkOut = out
		},
		openFilter() {
			uni.showActionSheet({
				itemList: ['默认排序', '价格从低到高', '价格从高到低'],
				success: e => { this.sort = ['default', 'asc', 'desc'][e.tapIndex] }
			})
		},
		open(r) {
			uni.navigateTo({ url: `/pages/room-detail/room-detail?id=${r.id}&nights=${this.nights}&checkIn=${this.checkIn}&checkOut=${this.checkOut}` })
		}
	}
}
</script>

<style lang="scss">
.pad-x { padding: 0 28rpx; }
.datebar {
	display: flex; align-items: center; background: $card; padding: 28rpx 40rpx;
	box-shadow: $shadow-sm;
}
.d-col { display: flex; flex-direction: column; }
.d-col.right { align-items: flex-end; }
.d-lab { font-size: 22rpx; color: $ink-4; }
.d-val { font-size: 40rpx; font-weight: 800; color: $ink; font-family: "DIN Alternate", sans-serif; }
.d-week { font-size: 20rpx; color: $brand; margin-top: 2rpx; }
.d-col.right { align-items: flex-end; }
.d-mid { flex: 1; display: flex; flex-direction: column; align-items: center; }
.nights { font-size: 22rpx; color: $brand; background: $brand-wash; padding: 4rpx 18rpx; border-radius: 999rpx; margin-bottom: 10rpx; }
.d-line { width: 120rpx; height: 1rpx; background: $line; position: relative; }
.d-line::after { content: ''; position: absolute; right: -4rpx; top: -3rpx; width: 7rpx; height: 7rpx; border-top: 1rpx solid $ink-4; border-right: 1rpx solid $ink-4; transform: rotate(45deg); }

.chips { white-space: nowrap; padding: 22rpx 28rpx 6rpx; }
.chip {
	display: inline-flex; align-items: center; height: 60rpx; padding: 0 30rpx; margin-right: 16rpx;
	background: $card; border-radius: 999rpx; font-size: 26rpx; color: $ink-2; box-shadow: $shadow-sm;
}
.chip.on { color: #fff; background: linear-gradient(135deg,$brand-soft,$brand-deep); box-shadow: $shadow-red; }
.chip.filter text { margin-left: 6rpx; color: $ink-3; }

.room { margin-bottom: 28rpx; }
.room-img { width: 100%; height: 340rpx; }
.room-foot { padding: 22rpx 24rpx; }
.tags { display: flex; gap: 12rpx; margin-bottom: 16rpx; }
.room-buy { display: flex; align-items: flex-end; justify-content: space-between; }
</style>
