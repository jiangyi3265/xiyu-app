import { reactive } from 'vue'
import { api } from './api.js'

/** 全局状态：登录令牌、会员资产、下单草稿 */
export const store = reactive({
	token: uni.getStorageSync('app_token') || '',
	member: { id: '', name: '', level: '', phone: '', points: 0, balance: 0, avatar: '', address: '' },
	points: 0,
	balance: 0,
	coupons: 0,
	draft: null,                 // 结算页待提交订单
	orderTab: '',                // 跳订单页时预选的状态 tab（tabBar 页无法带参）
	currentOrder: null,          // 订单详情页待展示订单

	isLogin() { return !!this.token },
	setDraft(d) { this.draft = d },

	setAuth(token) {
		this.token = token
		uni.setStorageSync('app_token', token)
	},

	applyMember(m, couponCount) {
		if (m) {
			// 原地更新，保持各页面 member 引用有效（响应式）
			Object.assign(this.member, {
				id: m.memberId, name: m.name, level: m.level, phone: m.phone,
				points: m.points, balance: Number(m.balance), avatar: m.avatar || '', address: m.address || ''
			})
			this.points = m.points
			this.balance = Number(m.balance)
		}
		if (couponCount != null) this.coupons = couponCount
	},

	async refreshMember() {
		const r = await api.memberInfo()
		this.applyMember(r.data, r.couponCount)
		return this.member
	},

	/** 恢复登录态：仅在已有令牌时刷新，不自动登录（未登录返回 false，由页面跳登录页） */
	async tryResume() {
		if (!this.token) return false
		try { await this.refreshMember(); return true }
		catch (e) { this.token = ''; uni.removeStorageSync('app_token'); return false }
	},

	/** 手机号 + 密码登录 */
	async loginByPhone(phone, password) {
		const r = await api.login(phone, password)
		this.setAuth(r.token)
		this.applyMember(r.member)
		try { await this.refreshMember() } catch (e) {}
		return true
	},

	/** 微信一键登录：uni.login 取 code，可带昵称/头像 */
	async loginByWeixin(nickName, avatarUrl) {
		const code = await new Promise((resolve, reject) => {
			uni.login({ provider: 'weixin', success: r => resolve(r.code), fail: reject })
		})
		const r = await api.wxLogin(code, nickName, avatarUrl)
		this.setAuth(r.token)
		this.applyMember(r.member)
		try { await this.refreshMember() } catch (e) {}
		return true
	},

	/** 兼容旧入口：确保已登录（有令牌则刷新，否则自动登录演示账号） */
	async ensureLogin() {
		if (await this.tryResume()) return true
		try { return await this.loginByPhone('13700009163', '123456') } catch (e) { return false }
	},

	logout() {
		this.token = ''
		Object.assign(this.member, { id: '', name: '', level: '', phone: '', points: 0, balance: 0, avatar: '', address: '' })
		this.points = 0
		this.balance = 0
		this.coupons = 0
		uni.removeStorageSync('app_token')
	}
})
