<template>
	<view class="login">
		<view class="lg-bg"></view>

		<view class="brand">
			<view class="logo">荔</view>
			<text class="bn">平云山居</text>
			<text class="bs">PINGYUNSHANJU HOTEL</text>
		</view>

		<view class="card">
			<view class="seg">
				<text class="seg-i" :class="{on: mode==='login'}" @tap="mode='login'">登录</text>
				<text class="seg-i" :class="{on: mode==='register'}" @tap="mode='register'">注册</text>
			</view>

			<view v-if="mode==='register'" class="field">
				<lwf-icon name="user" :size="34" color="#C1272D" :stroke="1.7" />
				<input class="ipt" v-model="name" placeholder="您的称呼（选填）" placeholder-class="ph" />
			</view>
			<view class="field">
				<lwf-icon name="phone" :size="34" color="#C1272D" :stroke="1.7" />
				<input class="ipt" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" placeholder-class="ph" />
			</view>
			<view class="field">
				<lwf-icon name="shield" :size="34" color="#C1272D" :stroke="1.7" />
				<input class="ipt" v-model="password" :password="true" placeholder="请输入密码" placeholder-class="ph" />
			</view>

			<view class="btn btn-primary btn-block submit" :class="{loading: busy}" @tap="submit">
				{{ busy ? '请稍候…' : (mode==='login' ? '登 录' : '注册并登录') }}
			</view>

		</view>

		<view class="wx">
			<view class="wx-line"><text class="ln"></text><text class="wx-t">微信快捷登录</text><text class="ln"></text></view>
			<view class="wx-btn" @tap="wxLogin">
				<lwf-icon name="user" :size="44" color="#fff" :stroke="1.8" />
			</view>
			<text class="wx-s">微信一键登录</text>
		</view>

		<view class="agree">
			<view class="cbx" :class="{on: agreed}" @tap="agreed=!agreed"><lwf-icon v-if="agreed" name="check" :size="20" color="#fff" :stroke="2.6" /></view>
			<text>我已阅读并同意</text><text class="lnk" @tap="terms">《用户协议与隐私政策》</text>
		</view>
	</view>
</template>

<script>
import { store } from '@/common/store.js'
import { api } from '@/common/api.js'
export default {
	data() { return { mode: 'login', phone: '', password: '', name: '', agreed: false, busy: false } },
	methods: {
		valid() {
			if (!this.agreed) { uni.showToast({ title: '请先同意用户协议', icon: 'none' }); return false }
			if (!/^1\d{10}$/.test(this.phone)) { uni.showToast({ title: '请输入正确的手机号', icon: 'none' }); return false }
			if (!this.password || this.password.length < 6) { uni.showToast({ title: '密码至少 6 位', icon: 'none' }); return false }
			return true
		},
		async submit() {
			if (this.busy || !this.valid()) return
			this.busy = true
			try {
				if (this.mode === 'login') {
					await store.loginByPhone(this.phone, this.password)
				} else {
					const r = await api.register(this.phone, this.password, this.name)
					store.setAuth(r.token); store.applyMember(r.member)
					try { await store.refreshMember() } catch (e) {}
				}
				this.done()
			} catch (e) {
				uni.showToast({ title: (e && e.msg) || '登录失败', icon: 'none' })
			} finally { this.busy = false }
		},
		async wxLogin() {
			if (!this.agreed) { uni.showToast({ title: '请先同意用户协议', icon: 'none' }); return }
			if (this.busy) return
			this.busy = true
			try {
				await store.loginByWeixin()
				this.done()
			} catch (e) {
				uni.showToast({ title: (e && e.msg) || '微信登录失败', icon: 'none' })
			} finally { this.busy = false }
		},
		done() {
			uni.showToast({ title: '登录成功', icon: 'success' })
			setTimeout(() => uni.reLaunch({ url: '/pages/index/index' }), 700)
		},
		terms() {
			uni.showModal({ title: '用户协议与隐私政策', content: '平云山居尊重并保护用户隐私，仅收集为您提供预订、储值、积分等服务所必需的信息，不会向第三方出售您的个人信息。', showCancel: false, confirmText: '我已知晓' })
		}
	}
}
</script>

<style lang="scss">
.login { min-height: 100vh; position: relative; padding: 0 48rpx; }
.lg-bg { position: absolute; top: 0; left: 0; right: 0; height: 520rpx; background: linear-gradient(160deg, #C92B32 0%, #A81C24 55%, #8C141C 100%); }
.lg-bg::after { content: ''; position: absolute; inset: 0; opacity: .3; background: radial-gradient(circle at 85% 0%, rgba(255,220,170,.5), transparent 45%); }

.brand { position: relative; padding: 120rpx 0 56rpx; display: flex; flex-direction: column; align-items: center; }
.logo { width: 128rpx; height: 128rpx; border-radius: 32rpx; background: linear-gradient(135deg,#F4DCA4,#D6AE63); color: #7A4F18; font-size: 72rpx; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 10rpx 30rpx rgba(0,0,0,.25); }
.bn { font-size: 40rpx; font-weight: 800; color: #fff; margin-top: 26rpx; letter-spacing: 2rpx; }
.bs { font-size: 20rpx; color: rgba(255,255,255,.7); margin-top: 8rpx; letter-spacing: 4rpx; }

.card { position: relative; background: #fff; border-radius: 28rpx; padding: 40rpx 36rpx 44rpx; box-shadow: 0 16rpx 50rpx rgba(0,0,0,.12); }
.seg { display: flex; justify-content: center; gap: 56rpx; margin-bottom: 30rpx; }
.seg-i { font-size: 32rpx; color: #9A9AA0; padding-bottom: 10rpx; font-weight: 600; }
.seg-i.on { color: #1C1C1E; font-weight: 800; border-bottom: 5rpx solid #C1272D; }

.field { display: flex; align-items: center; height: 100rpx; border-bottom: 1rpx solid #EFEFF2; }
.ipt { flex: 1; margin-left: 18rpx; font-size: 30rpx; color: #1C1C1E; }
.ph { color: #B5B5BC; }

.submit { height: 92rpx; margin-top: 44rpx; font-size: 32rpx; font-weight: 700; }
.submit.loading { opacity: .7; }

.wx { display: flex; flex-direction: column; align-items: center; margin-top: 56rpx; }
.wx-line { display: flex; align-items: center; width: 100%; }
.wx-line .ln { flex: 1; height: 1rpx; background: rgba(0,0,0,.08); }
.wx-t { font-size: 22rpx; color: #9A9AA0; margin: 0 20rpx; }
.wx-btn { width: 96rpx; height: 96rpx; border-radius: 50%; background: linear-gradient(135deg,#2BB14E,#07A33F); display: flex; align-items: center; justify-content: center; margin-top: 32rpx; box-shadow: 0 8rpx 20rpx rgba(7,163,63,.3); }
.wx-s { font-size: 23rpx; color: #6A6A70; margin-top: 16rpx; }

.agree { display: flex; align-items: center; justify-content: center; margin: 44rpx 0 30rpx; font-size: 22rpx; color: #8A8A90; }
.agree text { margin-left: 4rpx; }
.agree .lnk { color: #C1272D; }
.cbx { width: 32rpx; height: 32rpx; border-radius: 50%; border: 1rpx solid #C9C9CF; display: flex; align-items: center; justify-content: center; margin-right: 8rpx; flex-shrink: 0; }
.cbx.on { background: #C1272D; border-color: #C1272D; }
</style>
