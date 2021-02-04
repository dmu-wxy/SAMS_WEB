<template>
	<div>
		<div class="permissionManaTool">
		  <el-input size="small" placeholder="请输入角色英文名称" v-model="role.name">
			<template slot="prepend">ROLE_</template>
		  </el-input>
		  <el-input size="small" placeholder="请输入角色中文名称" v-model="role.nameZh"></el-input>
		  <el-button type="primary" size="small" icon="el-icon-plus">添加角色</el-button>
		</div>
		<div style="margin-top: 10px;width: 600px;">
			<el-collapse accordion @change="change">
			  <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
				<el-card class="box-card">
				  <div slot="header" class="clearfix">
					<span>可访问资源</span>
					<el-button style="float: right; padding: 3px 0;color: red;"icon="el-icon-delete" type="text"></el-button>
				  </div>
				  <div>
					<el-tree show-checkbox node-key="id"
					 :default-checked-keys="selectedMenus"
					 :data="allMenus" :props="defaultProps"></el-tree>
					 <div style="display: flex;justify-content: flex-end;">
						 <el-button size="mini">取消修改</el-button>
						 <el-button size="mini" type="primary">确认修改</el-button>	 
					 </div>
				   </div> 
				</el-card>
			  </el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script>
	export default{
		name:"PermissMana",
		data(){
			return{
				role:{
					name:'',
					nameZh:''
				},
				roles:[],
				defaultProps: {
				  children: 'children',
				  label: 'name'
				},
				allMenus:[],
				selectedMenus:[]
			}
		},
		mounted(){
			this.initRoles();
		},
		methods:{
			change(rid){
				if(rid){
					this.initAllMenus();
					this.initSelectedMenus(rid);
				}
			},
			initSelectedMenus(rid){
				this.getRequest("/system/basic/permiss/mids/" + rid).then(resp=>{
					if(resp){
						this.selectedMenus = resp;
					}
				})
			},
			initAllMenus(){
				this.getRequest("/system/basic/permiss/menus").then(resp=>{
					if(resp){
						this.allMenus = resp;
					}
				})
			},
			initRoles(){
				this.getRequest("/system/basic/permiss/").then(resp=>{
					if(resp){
						this.roles = resp;
					}
				})
			}
		}
	}
</script>

<style>
	.permissionManaTool{
		display: flex;
		justify-content: flex-start;
	}
	.permissionManaTool .el-input{
		width: 300px;
		margin-right: 8px;
	}
</style>
