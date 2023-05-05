import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	watch: {
		total() {
			this.setBadge();
		}
	},
	onShow() {
		this.setBadge();
	},
	methods: {
		//	在购物车页面 右上角也显示购物车数量
		setBadge() {
			uni.setTabBarBadge({
				index: 2,
				text: this.total + ''
			});
		}
	}
};
