<template>
	<div>
		<div class="header">
			<span class="loginTitle"><b>SAMS后台</b></span>
		</div>
		<div class="center">
			 <div class="description">
				 <h1>表象在猫，根源在人</h1>
				 <!-- <span>我们都是城市生态系统的一部分</span> -->
			 </div>
			 <div class="login">
				<el-form 
					v-loading="loading"
				    element-loading-text="正在登录..."
				    element-loading-spinner="el-icon-loading"
				    element-loading-background="rgba(0, 0, 0, 0.8)"
					:rules="rules" 
					ref="loginForm" 
					:model="loginForm" 
					class="loginContainer">
					<h3>后台登录</h3>
					<el-form-item prop="username">
						<el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码" @keydown.enter.native="submitLogin"></el-input>
					</el-form-item>
					<el-row>
						<el-col :span="15">
							<div style="width: 200px;">
								<el-form-item prop="verify_code">
									<el-input type="text" v-model="loginForm.verify_code" auto-complete="off" placeholder="验证码" @keydown.enter.native="submitLogin"></el-input>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="9">
							<div style="width: 120px;">
								<el-image :src="verify_code_url">
								  <div slot="placeholder" class="image-slot">
									加载中<span class="dot">...</span>
								  </div>
								</el-image>
							</div>
						</el-col>
					</el-row>
					<el-checkbox v-model="checked"></el-checkbox>&nbsp;&nbsp;记住密码
					<el-button type="primary" style="width: 100%;margin-top: 15px;" @click="submitLogin">登录</el-button>
				</el-form>
			</div>
		</div>
		<div class="down">
			版本信息：流浪动物管理系统 v0.1
		</div>
	</div>
</template>

<script>
	
	export default{
		name:"Login",
		data(){
			return{
				loginForm:{
					username: 'admin',
					password: '123456',
					verify_code: ''
				},
				loading: false,
				checked: false,
				rules:{
					username:[{required:true,message:'请输入用户名',trigger:'blur'}],
					password:[{required:true,message:'请输入密码',trigger:'blur'}],
					verify_code:[{required:true,message:'请输入验证码',trigger:'blur'}]
				},
				verify_code_url: '/verifyCode',
			}
		},
		methods:{
			submitLogin(){
				this.$refs.loginForm.validate((valid) => {
						  this.loading = true;
				          if (valid) {
				            this.postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{
								this.loading = false;
								if(resp){
									this.$store.commit('INIT_CURRENT_MANAGER',resp.obj);
									window.sessionStorage.setItem('manager',JSON.stringify(resp.obj));
									let path = this.$route.query.redirect;
									this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
								}
							})
				          } else {
				            this.$message.error("请输入账号/密码/验证码");
							this.loading = false;
				            return false;
				          }
				        });
			}
		}
	}
</script>

<style>
	.header{
		background: #eff4fa;
		display: flex;
		align-items: center;
		width: 100%; 
		height: 62px;
		border-bottom: 1px solid #d6dfea
	}
	.header .loginTitle{
		margin-left: 30px;
		font-size: 30px;
		font-family: 华文行楷;
		color: royalblue;
	}
	.center{
	    background:url("../../public/login/cat.jpg") no-repeat;
	    background-position: 38% center;
	    width: 100%;
	    position: absolute;
	    top: 62px;
	    bottom:36px;
	    left: 0px;
	    padding-top: 75px;
	    display: flex;
	    justify-content: space-between;
	}
	.description {
	    color: #6f95c8;
	    width: 900px;
	    text-align: center;
	    display: flex;
	    flex-direction: column;
	    justify-content: flex-start;
	    align-items: center;
	}
	.description span {
	   margin-top: 10px;
	    size: A5;
	    color: #3e3e3e;
	}
	.login{
		margin-right: 80px;
	}
	.loginContainer{
		background-clip: padding-box;
		width: 335px;
		height: 330px;
		padding: 15px 35px 15px 35px;
		background-color: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}
	.down{
		width:100%; 
		height:36px;
		position: fixed;
		bottom: 0px;
		background-color: #eff4fa;
		border-top: 1px solid #d6dfea;
		text-align: center;
		color: #b6b6b6;
	}
</style>
