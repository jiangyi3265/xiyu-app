<template>
	<view class="poster" :class="theme">
		<view class="tex"></view>
		<view class="glow"></view>
		<view class="frame">
			<view class="brand">
				<text class="bl"></text>
				<text class="bt">{{ brand }}</text>
				<text class="bl"></text>
			</view>
			<view class="main">{{ main }}</view>
			<view class="rule"><text class="dot"></text></view>
			<view class="sub">{{ sub }}</view>
		</view>
		<text class="cor tl"></text><text class="cor tr"></text>
		<text class="cor bl"></text><text class="cor br"></text>
	</view>
</template>

<script>
export default {
	name: 'lwf-poster',
	props: {
		brand: { type: String, default: '平云山居' },
		main:  { type: String, default: '' },
		sub:   { type: String, default: '' },
		theme: { type: String, default: 'red' }    // red | gold | wine
	}
}
</script>

<style lang="scss">
.poster {
	position: relative; width: 100%; height: 100%;
	border-radius: inherit; overflow: hidden;
	background: radial-gradient(130% 90% at 50% -10%, #D8333A 0%, #BC1F26 52%, #8F1219 100%);
}
.poster.wine { background: radial-gradient(130% 90% at 50% -10%, #B0303C 0%, #8C1E2C 52%, #5E1320 100%); }
.poster.gold {
	background: radial-gradient(130% 90% at 50% -10%, #E7CB8C 0%, #C9A24B 52%, #9A7322 100%);
}
/* 喜庆金点纹理 */
.poster .tex {
	position: absolute; inset: 0; opacity: .5;
	background-image: radial-gradient(circle at center, rgba(255,228,160,.18) 1.5rpx, transparent 2.5rpx);
	background-size: 34rpx 34rpx;
}
.poster .glow {
	position: absolute; left: 50%; top: -30%; width: 140%; height: 90%;
	transform: translateX(-50%);
	background: radial-gradient(closest-side, rgba(255,240,200,.35), transparent 70%);
}
.poster .frame {
	position: absolute; inset: 18rpx;
	border: 2rpx solid rgba(240,214,150,.5); border-radius: 14rpx;
	display: flex; flex-direction: column; align-items: center; justify-content: center;
	padding: 12rpx;
}
.poster .brand { display: flex; align-items: center; gap: 10rpx; margin-bottom: 8rpx; }
.poster .brand .bl { width: 28rpx; height: 1rpx; background: rgba(240,214,150,.7); }
.poster .brand .bt { font-size: 19rpx; color: #F3DCA0; letter-spacing: 1rpx; white-space: nowrap; }
.poster .main {
	font-size: 60rpx; font-weight: 800; line-height: 1.05; text-align: center;
	color: #FCE7BE; text-shadow: 0 2rpx 6rpx rgba(90,10,10,.45);
	letter-spacing: 1rpx;
}
.poster.gold .main { color: #6B3E12; text-shadow: 0 1rpx 2rpx rgba(255,255,255,.4); }
.poster .rule { display: flex; align-items: center; justify-content: center; gap: 8rpx; margin: 10rpx 0 8rpx; width: 60%; }
.poster .rule::before, .poster .rule::after { content: ''; height: 1rpx; flex: 1; background: rgba(240,214,150,.5); }
.poster .rule .dot { width: 8rpx; height: 8rpx; border-radius: 50%; background: #F0D696; transform: rotate(45deg); }
.poster .sub {
	font-size: 24rpx; font-weight: 600; color: #FFF4DD;
	padding: 4rpx 20rpx; border-radius: 999rpx; text-align: center;
	background: rgba(255,255,255,.12); border: 1rpx solid rgba(240,214,150,.4);
	max-width: 92%;
}
.poster.gold .sub { color: #5A3A10; background: rgba(255,255,255,.28); border-color: rgba(120,80,20,.3); }
/* 四角金饰 */
.poster .cor { position: absolute; width: 22rpx; height: 22rpx; border: 2rpx solid rgba(240,214,150,.7); }
.poster .cor.tl { top: 12rpx; left: 12rpx; border-right: 0; border-bottom: 0; }
.poster .cor.tr { top: 12rpx; right: 12rpx; border-left: 0; border-bottom: 0; }
.poster .cor.bl { bottom: 12rpx; left: 12rpx; border-right: 0; border-top: 0; }
.poster .cor.br { bottom: 12rpx; right: 12rpx; border-left: 0; border-top: 0; }
</style>
