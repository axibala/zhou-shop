<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<text class="tips-text">登陆后尽享更多权益</text>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex';
	export default {
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			getUserProfile() {
				uni.getUserProfile({
					desc: '帅比的授权信息',
					success: res => {
						this.updateUserInfo(res.userInfo);
						this.getToken(res);
					},
					fail: res => uni.$showMsg('本帅比取消了登录授权')
				});
			},
			async getToken(info) {
				const [err, res] = await uni.login().catch(err => err);

				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登陆gg了!!!');

				const query = {
					code: res.code,		//	用户登录凭证
					encryptedData: info.encryptedData,	//	完整用户信息密文
					iv: info.iv,	//	加密算法初始向量
					rawData: info.rawData,	//	原始用户信息字符串
					signature: info.signature
				};

				const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query);

				// loginResult.message = {"token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"};

				loginResult.message = { 'token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o' };

				// console.log(loginResult);

				// if(loginResult.meta.status !== 200) return uni.$showMsg('登录gg了!')
				uni.$showMsg('帅比登录成功!');
				//	token保存到vuex
				this.updateToken(loginResult.message.token);
				this.navigateBack();
			},
			navigateBack() {
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null);
						}
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.login-container{
		height: 750rpx;
		background-color: #F8F8F8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;

		&::after{
			content: '';
			display: block;
			width: 100%;
			height: 40px;
			background-color: white;
			position: absolute;
			left: 0;
			bottom: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}

		.btn-login{
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}

		.tips-text{
			font-size: 12px;
			color: gray;
		}
	}
</style>
