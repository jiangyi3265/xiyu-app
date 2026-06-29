<template>
	<view class="page-wrap">
		<view class="card list">
			<view class="li tap" @tap="changeAvatar">
				<text class="li-l">微信头像</text>
				<image v-if="member.avatar" class="avatar img" :src="member.avatar" mode="aspectFill" />
				<view v-else class="avatar">{{ (member.name || '荔').charAt(0) }}</view>
				<lwf-icon name="arrow" :size="26" color="#C9C9CF" :stroke="2" />
			</view>
			<view class="hr"></view>
			<view class="li"><text class="li-l">会员 ID</text><text class="li-v">{{ member.id }}</text></view>
			<view class="hr"></view>
			<view class="li tap" @tap="goLevel"><text class="li-l">会员级别</text><text class="li-v gold">{{ member.level }}</text><lwf-icon name="arrow" :size="26" color="#C9C9CF" :stroke="2" /></view>
			<view class="hr"></view>
			<view class="li tap" @tap="editAddress"><text class="li-l">我的地址</text><text class="li-v" :class="{muted: !member.address}">{{ member.address || '去添加' }}</text><lwf-icon name="arrow" :size="26" color="#C9C9CF" :stroke="2" /></view>
			<view class="hr"></view>
			<view class="li tap" @tap="editName"><text class="li-l">姓　　名</text><text class="li-v">{{ member.name }}</text><lwf-icon name="arrow" :size="26" color="#C9C9CF" :stroke="2" /></view>
			<view class="hr"></view>
			<view class="li"><text class="li-l">手机号</text><text class="li-v">{{ member.phone }}</text></view>
		</view>

		<view class="priv tap" @tap="showPrivacy">
			<lwf-icon name="shield" :size="32" color="#8A8A90" :stroke="1.7" />
			<text>隐私协议</text>
			<lwf-icon name="arrow" :size="24" color="#C9C9CF" :stroke="2" />
		</view>

		<view class="btn btn-primary btn-block back" @tap="back">返回会员中心</view>
		<view class="logout" @tap="logout">退出登录</view>
	</view>
</template>

<script>
import { store } from '@/common/store.js'
import { api } from '@/common/api.js'
import { BASE_URL } from '@/common/request.js'
export default {
	data() { return { member: store.member } },
	onShow() { store.refreshMember().catch(() => {}) },
	methods: {
		changeAvatar() {
			uni.chooseImage({
				count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'],
				success: res => {
					const path = res.tempFilePaths[0]
					// 真上传到服务器，存回可跨设备访问的 URL（旧版直接存本地临时路径，重启即失效）
					uni.showLoading({ title: '上传中…', mask: true })
					uni.uploadFile({
						url: BASE_URL + '/app/member/avatar',
						filePath: path,
						name: 'file',
						header: { Authorization: uni.getStorageSync('app_token') },
						success: up => {
							let url = ''
							try { url = (JSON.parse(up.data) || {}).url } catch (e) {}
							if (up.statusCode === 200 && url) {
								store.member.avatar = url
								uni.showToast({ title: '头像已更新', icon: 'success' })
							} else {
								uni.showToast({ title: '上传失败，请重试', icon: 'none' })
							}
						},
						fail: () => uni.showToast({ title: '上传失败，请检查网络', icon: 'none' }),
						complete: () => uni.hideLoading()
					})
				}
			})
		},
		goLevel() { uni.navigateTo({ url: '/pages/benefits/benefits' }) },
		editName() {
			uni.showModal({
				title: '修改姓名', editable: true, placeholderText: '请输入姓名', content: this.member.name || '',
				success: r => {
					const name = (r.content || '').trim()
					if (!r.confirm || !name) return
					api.updateProfile({ name }).then(() => {
						store.member.name = name
						uni.showToast({ title: '已保存', icon: 'success' })
					}).catch(() => {})
				}
			})
		},
		editAddress() {
			uni.showModal({
				title: '我的地址', editable: true, placeholderText: '请输入收货/联系地址', content: this.member.address || '',
				success: r => {
					if (!r.confirm) return
					const addr = (r.content || '').trim()
					api.updateProfile({ address: addr }).then(() => {
						store.member.address = addr
						uni.showToast({ title: addr ? '地址已保存' : '已清空', icon: 'none' })
					}).catch(() => {})
				}
			})
		},
		showPrivacy() {
			uni.showModal({
				title: '隐私协议',
				content: '平云山居尊重并保护用户隐私。我们仅在为您提供预订、储值、积分等服务时收集必要信息（手机号、姓名、订单记录），不会向第三方出售您的个人信息。您可随时在会员中心查询或注销账号。',
				showCancel: false, confirmText: '我已知晓'
			})
		},
		back() { uni.navigateBack({ delta: 1, fail: () => uni.switchTab({ url: '/pages/member/member' }) }) },
		logout() {
			uni.showModal({
				title: '退出登录', content: '确认退出当前账号？',
				success: r => {
					if (!r.confirm) return
					api.logout().catch(() => {}).finally(() => {
						store.logout()
						uni.reLaunch({ url: '/pages/login/login' })
					})
				}
			})
		}
	}
}
</script>

<style lang="scss">
.list { margin: 24rpx 28rpx 0; padding: 6rpx 32rpx; }
.li { display: flex; align-items: center; padding: 30rpx 0; }
.li-l { font-size: 28rpx; color: $ink-3; letter-spacing: 2rpx; }
.li-v { margin-left: auto; font-size: 28rpx; color: $ink; font-weight: 500; }
.li-v.gold { color: $gold-deep; font-weight: 700; }
.li-v.muted { color: $ink-4; font-weight: 400; }
.li .lwf-icon { margin-left: 16rpx; }
.avatar { margin-left: auto; width: 72rpx; height: 72rpx; border-radius: 50%; background: linear-gradient(135deg,#F4DCA4,#D6AE63); color: #7A4F18; font-size: 32rpx; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.avatar.img { background: #eee; }

.priv { display: flex; align-items: center; margin: 24rpx 28rpx 0; padding: 28rpx 32rpx; background: $card; border-radius: $r-lg; box-shadow: $shadow-sm; }
.priv text { flex: 1; font-size: 27rpx; color: $ink-2; margin-left: 16rpx; }

.back { margin: 48rpx 28rpx 24rpx; }
.logout { text-align: center; font-size: 26rpx; color: $ink-4; padding: 12rpx 0 40rpx; }
</style>
