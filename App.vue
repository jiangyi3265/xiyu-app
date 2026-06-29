<script>
	import { store } from '@/common/store.js'
	export default {
		onLaunch: function() {
			// 启动恢复登录态：有令牌则进入，否则跳登录页
			store.tryResume().then(ok => {
				// 登录页是入口页：已登录进首页，未登录留在登录页
				uni.reLaunch({ url: ok ? '/pages/index/index' : '/pages/login/login' })
			})
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	/* 全局公共样式：作用于所有页面 */
	@import "@/common/app.scss";
</style>
