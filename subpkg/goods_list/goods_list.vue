<template>
	<view>
		<view class="goods-list">
			<!-- block节点无法绑定事件 -->
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//	请求参数对象
				queryObj: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0,
				//	节流阀
				isLoading: false
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';

			this.getGoodsList();
		},
		methods: {
			async getGoodsList(cb) {
				//	开节流阀
				this.isLoading = true;
				const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
				//	关节流阀
				this.isLoading = false;
				cb && cb();
				if (res.meta.status !== 200) return uni.$showMsg();

				this.goodsList = [...this.goodsList, ...res.message.goods];
				this.total = res.message.total;
			},
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				});
			}
		},
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！');

			if (this.isLoading) return;

			//	页码自加一
			this.queryObj.pagenum++;
			this.getGoodsList();
		},
		onPullDownRefresh() {
			//	重置数据
			this.queryObj.pagenum = 1;
			this.total = 0;
			this.isLoading = false;
			this.goodsList = [];

			//	重新发数据请求
			this.getGoodsList(() => uni.stopPullDownRefresh());
		}
	};
</script>

<style lang="scss">

</style>
