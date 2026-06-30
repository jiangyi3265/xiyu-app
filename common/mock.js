/**
 * 平云山居 · C端共享常量与工具（页面级展示配置，非业务数据）
 * 业务数据（轮播/房型/餐饮/储值/会员/订单/券/积分等）一律走后端接口（见 api.js）；
 * 本文件只保留前端写死的展示配置与配色工具函数。
 */

export const HOTEL = {
	name: '平云山居',
	full: '平云山居',
	city: '广州',
	id: '304464073'
}

/* 会员中心 — 订单状态宫格 */
export const ORDER_QUICK = [
	{ key: 'pay',     name: '待支付', icon: 'wallet' },
	{ key: 'confirm', name: '待确认', icon: 'clock' },
	{ key: 'use',     name: '待使用', icon: 'ticket' },
	{ key: 'all',     name: '全部订单', icon: 'list' }
]

/* 会员中心 — 服务宫格 */
export const SERVICES = [
	{ key: 'points',  name: '积分明细', icon: 'coin',  url: '/pages/points/points' },
	{ key: 'coupon',  name: '优惠券',   icon: 'ticket',url: '/pages/coupons/coupons' },
	{ key: 'mall',    name: '积分兑换', icon: 'gift',  url: '/pages/points-mall/points-mall' },
	{ key: 'benefit', name: '会员权益', icon: 'crown', url: '/pages/benefits/benefits' },
	{ key: 'profile', name: '个人资料', icon: 'user',  url: '/pages/profile/profile' },
	{ key: 'card',    name: '储值卡',   icon: 'card',  url: '/pages/recharge/recharge' },
	{ key: 'kefu',    name: '联系客服', icon: 'phone', url: '' }
]

/* 订单页 — 状态筛选 tab */
export const ORDER_TABS = [
	{ key: 'all', name: '全部' },
	{ key: 'pay', name: '待支付' },
	{ key: 'confirm', name: '待确认' },
	{ key: 'use', name: '待使用' },
	{ key: 'refund_apply', name: '退款中' },
	{ key: 'expired', name: '已过期' },
	{ key: 'refund', name: '已退款' },
	{ key: 'cancel', name: '已取消' }
]

/* 工具：渐变配色（房型/场景图，scene 为数字或语义串） */
export const SCENE_GRADIENTS = [
	'linear-gradient(135deg,#A9C9E8 0%,#C9B6D8 45%,#E8C9B0 100%)',
	'linear-gradient(135deg,#D8C0A8 0%,#C8B0C0 50%,#A0B8C8 100%)',
	'linear-gradient(135deg,#C9A878 0%,#A88060 50%,#6A5848 100%)',
	'linear-gradient(135deg,#3A4A6A 0%,#6A5878 50%,#A87858 100%)'
]
export function sceneBg(scene) {
	if (typeof scene === 'number') return SCENE_GRADIENTS[scene % SCENE_GRADIENTS.length]
	const map = {
		dine:  'linear-gradient(135deg,#E89B4A 0%,#C85838 100%)',
		room:  'linear-gradient(135deg,#8AA8D8 0%,#B89AC8 100%)',
		night: 'linear-gradient(135deg,#2A2A4A 0%,#5A3A5A 60%,#A85858 100%)',
		mooncake:'linear-gradient(135deg,#E8C878 0%,#B8862B 100%)',
		coupon:'linear-gradient(135deg,#E8B0B0 0%,#C87878 100%)'
	}
	return map[scene] || SCENE_GRADIENTS[0]
}
