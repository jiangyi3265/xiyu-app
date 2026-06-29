/**
 * 平云山居 · C端 API（含字段适配：后端 camelCase → 前端原有数据形状）
 */
import request from './request.js'

/**
 * 唤起微信支付（小程序）。后端 needPay=true 时把返回的 pay 参数传进来。
 * resolve=支付成功，reject=用户取消/失败。
 */
export function wxRequestPayment(pay) {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: pay.timeStamp,
			nonceStr: pay.nonceStr,
			package: pay.package,
			signType: pay.signType || 'MD5',
			paySign: pay.paySign,
			success: () => resolve(true),
			fail: err => reject(err)
		})
	})
}

/* ---------- 工具 ---------- */
const csv = s => (s ? String(s).split(',').filter(Boolean) : [])
// 数字型场景("0".."3")转 number，其余(dine/night...)保持字符串
const scn = s => {
	if (s === null || s === undefined || s === '') return 0
	return /^\d+$/.test(String(s)) ? Number(s) : s
}
const cut = (s, n) => (s ? String(s).slice(0, n) : '')
const validParam = v => v !== undefined && v !== null && !['', 'undefined', 'null'].includes(String(v).trim())
const params = data => Object.keys(data).reduce((o, k) => {
	if (validParam(data[k])) o[k] = String(data[k]).trim()
	return o
}, {})

/* ---------- 适配器 ---------- */
const normBanner = b => ({ id: b.bannerId, scene: b.scene, title: b.title, sub: b.sub })
const normRoom = r => ({
	id: r.roomId, name: r.name, area: r.area, bed: r.bed, win: r.win,
	price: Number(r.price), scene: scn(r.scene), tags: csv(r.tags),
	feature: r.feature, cancel: r.cancelRule, facilities: csv(r.facilities)
})
const normProduct = p => ({
	id: p.productId, type: p.type, title: p.title, main: p.main, sub: p.sub,
	theme: p.theme, badge: p.badge, scene: scn(p.scene),
	price: Number(p.price), old: Number(p.oldPrice), people: p.people,
	terms: p.terms, items: csv(p.items)
})
const normRecharge = c => ({
	id: c.rechargeId, amount: Number(c.amount), give: Number(c.give),
	coupon: Number(c.coupon), hours: c.hours, title: c.title, hot: c.hot === '1',
	gift: c.giftName ? { name: c.giftName, price: Number(c.giftPrice), qty: c.giftQty, valid: c.giftValid } : null
})
const normMall = m => ({ id: m.mallId, cat: m.cat, scene: scn(m.scene), title: m.title, points: m.points })
const normBenefit = b => ({ name: b.name, val: b.val, icon: b.icon })

const ORDER_STATUS_TEXT = {
	pay: '待支付', confirm: '待确认', use: '待使用', done: '已完成',
	cancel: '已取消', refund: '全部退款', expired: '已过期'
}
const normOrder = o => ({
	id: o.orderNo, oid: o.orderId, shop: o.shop, status: o.status,
	statusText: ORDER_STATUS_TEXT[o.status] || o.status,
	scene: scn(o.scene), tagText: o.tagText, title: o.title,
	price: Number(o.payAmount), date: cut(o.createTime, 10),
	reviewed: o.reviewed === '1',
	// 详情页用完整字段
	kind: o.kind, qty: o.qty, memberName: o.memberName,
	unitPrice: Number(o.unitPrice), amount: Number(o.amount), payAmount: Number(o.payAmount),
	remark: o.remark, createTime: cut(o.createTime, 19)
})
const normCoupon = c => ({
	id: c.mcId, cat: Number(c.cat) || 0, amount: Number(c.amount), cond: Number(c.condAmount),
	title: c.title, valid: cut(c.validTime, 16), desc: c.descr, reason: c.reason, status: c.status
})
const normPointLog = l => ({ id: l.logId, type: l.type, title: l.title, date: cut(l.createTime, 16), val: l.points })

/* ---------- API ---------- */
export const api = {
	/* 公共 */
	home: () => request({ url: '/app/home' }).then(r => ({
		hotel: r.hotel, entries: r.entries,
		banners: (r.banners || []).map(normBanner),
		promos: (r.promos || []).map(normProduct),
		dishes: (r.dishes || []).map(normProduct),
		rooms: (r.rooms || []).map(normRoom)
	})),
	rooms: () => request({ url: '/app/room/list' }).then(r => (r.data || []).map(normRoom)),
	room: id => request({ url: '/app/room/' + id }).then(r => normRoom(r.data)),
	roomAvailability: (id, checkIn, checkOut) => request({ url: '/app/room/' + id + '/availability', data: params({ checkIn, checkOut }), silent: true }),
	products: type => request({ url: '/app/product/list', data: params({ type }) }).then(r => (r.data || []).map(normProduct)),
	product: id => request({ url: '/app/product/' + id }).then(r => normProduct(r.data)),
	recharges: () => request({ url: '/app/recharge/list' }).then(r => (r.data || []).map(normRecharge)),
	mall: () => request({ url: '/app/mall/list' }).then(r => ({ tabs: r.tabs, items: (r.items || []).map(normMall) })),
	benefits: () => request({ url: '/app/benefit/list' }).then(r => ({ levels: r.levels, benefits: (r.benefits || []).map(normBenefit) })),

	/* 鉴权 */
	login: (phone, password) => request({ url: '/app/auth/login', method: 'POST', data: { phone, password }, silent: true }),
	wxLogin: (code, nickName, avatarUrl) => request({ url: '/app/auth/wxlogin', method: 'POST', data: { code, nickName, avatarUrl }, silent: true }),
	register: (phone, password, name) => request({ url: '/app/auth/register', method: 'POST', data: { phone, password, name } }),
	logout: () => request({ url: '/app/auth/logout', method: 'POST', silent: true }),

	/* 会员 */
	memberInfo: () => request({ url: '/app/member/info', silent: true }),
	updateProfile: data => request({ url: '/app/member/profile', method: 'PUT', data }),
	orders: (status, kw) => {
		const data = params({ status: status === 'all' ? '' : status, kw })
		return request({ url: '/app/member/order/list', data }).then(r => (r.data || []).map(normOrder))
	},
	createOrder: data => request({ url: '/app/member/order', method: 'POST', data }),
	deleteOrder: oid => request({ url: '/app/member/order/' + oid, method: 'DELETE' }),
	cancelOrder: oid => request({ url: '/app/member/order/' + oid + '/cancel', method: 'PUT' }),
	payOrder: oid => request({ url: '/app/member/order/' + oid + '/pay', method: 'PUT' }),
	// 对已存在的待支付订单再次发起支付（返回 needPay + 唤起参数）
	prepayOrder: oid => request({ url: '/app/member/order/' + oid + '/prepay', method: 'PUT' }),
	useOrder: oid => request({ url: '/app/member/order/' + oid + '/use', method: 'PUT' }),
	refundOrder: oid => request({ url: '/app/member/order/' + oid + '/refund', method: 'PUT' }),
	review: (orderId, content, rating) => request({ url: '/app/member/review', method: 'POST', data: { orderId, content, rating } }),
	recharge: (rechargeId, qty) => request({ url: '/app/member/recharge', method: 'POST', data: { rechargeId, qty } }),
	redeem: mallId => request({ url: '/app/member/mall/redeem', method: 'POST', data: { mallId } }),
	points: type => request({ url: '/app/member/point/list', data: params({ type: type === 'all' ? '' : type }) }).then(r => ({
		list: (r.data || []).map(normPointLog), income: r.income, outcome: r.outcome
	})),
	coupons: status => request({ url: '/app/member/coupon/list', data: params({ status }) }).then(r => (r.data || []).map(normCoupon))
}

export default api
