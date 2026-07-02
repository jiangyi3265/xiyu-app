/**
 * 平云山居 · C端网络请求封装（对接 RuoYi 后端 /app 接口）
 * 生产环境请将 BASE_URL 改为正式域名（小程序需在后台配置 request 合法域名）
 */
export const BASE_URL = 'https://zhdg.gziic.cn'

export default function request(options) {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('app_token')
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: Object.assign(
				{ 'Content-Type': 'application/json;charset=utf-8' },
				token ? { 'Authorization': token } : {},
				options.header || {}
			),
			timeout: 15000,
			success: (res) => {
				const d = res.data
				if (res.statusCode === 200 && d && d.code === 200) {
					resolve(d)
				} else if (d && d.code === 401) {
					// 登录态失效：清除令牌并跳转登录页（避免卡在空数据页）
					uni.removeStorageSync('app_token')
					if (!options.silent) uni.showToast({ title: d.msg || '登录已过期，请重新登录', icon: 'none' })
					const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
					const cur = pages.length ? pages[pages.length - 1].route : ''
					if (cur !== 'pages/login/login') {
						setTimeout(() => uni.reLaunch({ url: '/pages/login/login' }), 500)
					}
					reject(d)
				} else {
					if (!options.silent) uni.showToast({ title: (d && d.msg) || '请求失败', icon: 'none' })
					reject(d || { msg: '网络错误' })
				}
			},
			fail: (err) => {
				if (!options.silent) uni.showToast({ title: '网络连接失败，请检查后端服务', icon: 'none' })
				reject(err)
			}
		})
	})
}
