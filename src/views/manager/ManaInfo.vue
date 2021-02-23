<template>
	<div>
		<div style="margin-top: 10px;display: flex;justify-content: center;">
			<el-input @keydown.enter.native="doSearch()" v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search" style="width: 300px;margin-right: 10px;" size="small"></el-input>
			<el-button icon="el-icon-search" type="primary" @click="doSearch()" size="small">搜索</el-button>
			<el-button icon="el-icon-plus" type="success" @click="dialogVisible = true" size="small">添加操作员</el-button>
		</div>
		
		<el-dialog
		  title="添加用户"
		  :visible.sync="dialogVisible"
		  width="50%"
		  :before-close="handleClose">
		  <el-steps :space="400" :active="account" finish-status="success">
		    <el-step title="用户名"></el-step>
		    <el-step title="手机号"></el-step>
		    <el-step title="电子邮箱"></el-step>
			<el-step title="出生日期"></el-step>
			<el-step title="性别"></el-step>
			<el-step title="角色"></el-step>
		  </el-steps>
		  <el-input :model="manager.mname" placeholder="请输入用户名"></el-input>
		  <el-input :model="manager.mphone" placeholder="请输入手机号"></el-input>
		  <el-input :model="manager.memail" placeholder="请输入电子邮箱"></el-input>
		  <el-date-picker
			v-model="manager.birth"
			type="datetime"
			placeholder="选择日期时间">
		  </el-date-picker>
		  <el-radio-group v-model="manager.gender">
		    <el-radio :label="0">男</el-radio>
		    <el-radio :label="1">女</el-radio>
		  </el-radio-group>
		  <el-select v-model="manager.role.nameZh" placeholder="请选择">
		    <el-option
		      v-for="item in roles"
		      :key="item"
		      :label="item"
		      :value="item">
		    </el-option>
		  </el-select>
		  <span slot="footer" class="dialog-footer">
		    <el-button :disabled="account == 0" @click="account--">上一步</el-button>
		    <el-button type="primary" @click="account < 5 ? account++ : account">{{account == 5 ? '添加' : '下一步'}}</el-button>
		  </span>
		</el-dialog>
		
		<div style="margin-top: 20px; display: flex;flex-wrap: wrap;justify-content: space-around;">
			<el-card class="manager-card box-card" v-for="(manager,index) in managers" :key="index">
			  <div slot="header" class="clearfix">
				<span>{{manager.mname}}</span>
				<el-button @click="deleteManager(manager)" style="float: right; padding: 3px 0;color: red;" type="text" icon="el-icon-delete"></el-button>
			  </div>
			  <div style="display: flex;justify-content: start;">
				<div>
					<img src="../../../public/other.jpeg" :alt="manager.mname" :title="manager.mname" class="userFace">
				</div>
				<div style="font-size: 14px;margin-left: 20px;">
					<div><b>用户名</b>：{{manager.mname}}</div>
					<div><b>手机号码</b>：{{manager.mphone}}</div>
					<div><b>电子邮箱</b>：{{manager.memail}}</div>
					<div><b>出生日期</b>：{{manager.birth}}</div>
					<div><b>性别</b>：{{manager.gender == 1 ? '男' : '女'}}</div>
					<div><b>用户状态</b>：<el-switch
									  v-model="manager.enabled"
									  @change="updateEnabled(manager)"
									  active-text="启用"
									  inactive-text="禁用">
									</el-switch></div>
					<div><b>用户角色</b>：
						<el-tag type="success" size="small" style="margin-right: 5px;" v-for="(role,indexj) in manager.roles" :key="indexj">{{role.nameZh}}</el-tag>
						<el-popover
						    placement="right"
						    title="角色列表"
						    width="200"
							@show="showRoles(manager)"
							@hide="hideRoles(manager)"
						    trigger="click">
							<el-select v-model="selectRoles" 
								multiple 
								placeholder="请选择">
							    <el-option
							      v-for="(r,indexk) in allRoles"
							      :key="indexk"
							      :label="r.nameZh"
							      :value="r.id">
							    </el-option>
							  </el-select>
							<el-button slot="reference" icon="el-icon-more" type="text"></el-button>
						  </el-popover>
					</div>
				</div>
			  </div>
			</el-card>
		</div>
	</div>
</template>

<script>
	export default{
		name:"UserInfo",
		data(){
			return{
				keywords:'',
				managers:[],
				allRoles:[],
				selectRoles:[],
				manager:{},
				dialogVisible:false,
				account:0,
				roles:['管理员','操作员']
			}
		},
		mounted() {
			this.initManagers();
		},
		methods:{
			deleteManager(manager){
				 this.$confirm('此操作将删除“' + manager.mname + '”, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          this.deleteRequest("/manager/info/" + manager.mid).then(resp=>{
							  if(resp){
								  this.initManagers();
							  }
						  })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			doSearch(){
				this.initManagers();
			},
			initManagers(){
				this.getRequest("/manager/info/?keywords=" + this.keywords).then(resp=>{
					if(resp){
						this.managers = resp;
					}
				})
			},
			hideRoles(manager){
				let roles = manager.roles;
				let flag = false;
				if(roles.length != this.selectRoles.length){
					flag = true;
				}else{
					let temp = 0;
					for(let i = 0;i < roles.length;i++){
						for(let j = 0;j < this.selectRoles.length;j++){
							if(roles[i].id == this.selectRoles[j]){
								temp++;
								break;
							}
						}
					}
					if(temp != roles.length){
						console.log(temp + "," + roles.length);
						flag = true;
					}
				}
				if(flag){
					let url = '/manager/info/roles?mid=' + manager.mid;
					this.selectRoles.forEach(sr=>{
						url += '&rids=' + sr;
					});
					this.putRequest(url).then(resp=>{
						if(resp){
							this.initManagers();
						}
					});
				}
			},
			showRoles(manager){
				this.initAllRoles();
				let roles = manager.roles;
				this.selectRoles = [];
				roles.forEach(r=>{
					this.selectRoles.push(r.id);
				})
				
			},
			initAllRoles(){
				this.getRequest("/manager/info/roles/").then(resp=>{
					if(resp){
						this.allRoles = resp;
					}
				})
			},
			updateEnabled(manager){
				delete manager.roles;
				delete manager.userame;
				this.putRequest("/manager/info/",manager).then(resp=>{
					if(resp){
						this.initManagers();
					}
				})
			},
			doAddManager(){
				this.display = true;
			}
		}
	}
</script>

<style>
	.manager-card{
		width: 350px;
		margin-bottom: 30px;
	}
	.userFace{
		width: 72px;
		height: 72px;
		border-radius: 72px;
	}
</style>
