<template>
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>

		<!-- 合计 -->
		<view class="amount-box">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>

		<!-- 结算 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations, mapState } from 'vuex';

	export default {
		data() {
			return {
				//	倒计时
				seconds: 3,
				timer: null
			};
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user', ['token']),
			...mapState('m_cart', ['cart']),
			isFullCheck() {
				return this.checkedCount === this.total;
			}
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			...mapMutations('m_user', ['updateRedirectInfo']),
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck);
			},
			//	点击结算
			settlement() {
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品');

				if (!this.addstr) return uni.$showMsg('请选择收货地址！');

				// if(!this.token) return uni.$showMsg('请先登录！')
				if (!this.token) return this.delayNavigate();

				this.payOrder();
			},
			async payOrder() {
				//	订单信息
				const orderInfo = {
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({
						goods_id: x.goods_id,
						goods_number: x.goods_count,
						goods_price: x.goods_price
					}))
				};

				//	请求创建订单
				const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
				console.log(res);
				if (res.meta.status !== 200) return uni.$showMsg('帅逼获取不到订单');

				const orderNumber = res.message.order_number;
				console.log(orderNumber);
			},

			//	延时导航到 my页面
			delayNavigate() {
				this.seconds = 3;
				this.showTips(this.seconds);

				this.timer = setInterval(() => {
					this.seconds--;

					if (this.seconds <= 0) {
						clearInterval(this.timer);

						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									openType: 'switchTab',
									from: '/pages/cart/cart'
								});
							}
						});

						return;
					}

					this.showTips(this.seconds);
				}, 1000);
			},

			//	倒计时提示
			showTips(n) {
				uni.showToast({
					icon: 'none',
					title: '有请大帅比登录' + n + '秒后自动跳转登陆页面',
					mask: true,
					duration: 1500
				});
			}
		}
	};
</script>

<style lang="scss">
	.my-settle-container{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;

		.radio{
			display: flex;
			align-items: center;
		}

		.amount-box {
			.amount{
				color: #C00000;
				font-weight: bold;
			}
		}

		.btn-settle{
			background-color: #C00000;
			height: 50px;
			color: white;
			line-height: 50px;
			padding: 0 10px;
			min-width: 100px;
			text-align: center;
		}
	}
</style>
