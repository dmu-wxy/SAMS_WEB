<template>
	<div>
		<el-container>
		  <el-header class='homeHeader'>
			  <div class="title">
				SAMS后台
			  </div>
			  <el-dropdown class="userInfo" @command="commandHandler">
			    <span class="el-dropdown-link">
			      {{manager.mname}}<i class="el-icon-arrow-down el-icon--right"></i>
			    </span>
			    <el-dropdown-menu slot="dropdown">
			      <el-dropdown-item command = 'userInfo'>个人中心</el-dropdown-item>
			      <el-dropdown-item command = 'setting'>设置</el-dropdown-item>
			      <el-dropdown-item command = 'logout' divided>注销</el-dropdown-item>
			    </el-dropdown-menu>
			  </el-dropdown>
		  </el-header>
		  <el-container>
		    <el-aside width="200px">
				        <el-menu router
							   >
				          <el-submenu index="1" v-for="(item,index) in this.$router.options.routes" v-if="!item.hidden" :key="index">
				            <template slot="title">
				              <i class="el-icon-location"></i>
				              <span>{{item.name}}</span>
				            </template>
				            <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
				          </el-submenu>
				        </el-menu>
			</el-aside>
		    <el-main >
				<router-view></router-view>
			</el-main>
		  </el-container>
		</el-container>
	</div>
</template>

<script>
	export default{
		name:'Home',
		data(){
			return{
				manager:JSON.parse(window.sessionStorage.getItem('manager'))
			}
		},
		methods:{
			commandHandler(cmd){
				if(cmd == 'logout'){
					this.$confirm('此操作将注销登录, 是否继续?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					          this.getRequest("/logout");
							  window.sessionStorage.removeItem("manager");
							  this.$router.replace("/");
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '取消操作'
					          });          
					        });
				}
			}
		}
	}
</script>

<style>
	.homeHeader{
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 30px;
		box-sizing: border-box;
		border-bottom: 5px solid royalblue
	}
	.homeHeader .title{
		font-size: 30px;
		font-family: 华文行楷;
		color: royalblue;
	}
	.homeHeader .userInfo{
		cursor: pointer;
	}
	.asideContainer{
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.asideLast{
		flex: 1;
		background-color: F5F5F5;
	}
</style>
