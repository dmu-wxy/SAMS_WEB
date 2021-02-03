<template>
	<div>
		<div>
			  <el-input
				size="small"
			    placeholder="添加角色_Zh"
			    prefix-icon="el-icon-plus"
			    v-model="role.nameZh"
				style="width: 200px;"
				@keydown.enter.native="addRole">
				</el-input>
				<el-input
					size="small"
				  placeholder="添加角色_En"
				  prefix-icon="el-icon-plus"
				  v-model="role.name"
				  style="width: 200px;margin-left: 8px;"
				  @keydown.enter.native="addRole">
			  </el-input>
			  <el-button icon="el-icon-plus" size="small" type="primary" style="margin-left: 8px;" @click="addRole">添加</el-button>
		</div>
		<div class="roleTable">
			<el-table
				size="small"
			    :data="roles"
			    border
				stripe
				@selection-change="handleSelectionChange"
			    style="width: 70%;">
				<el-table-column
					type="selection"
					width="55"
				></el-table-column>
			    <el-table-column
			      prop="id"
			      label="编号"
			      width="55">
			    </el-table-column>
			    <el-table-column
			      prop="nameZh"
			      label="角色_Zh"
			      width="120px">
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="角色_En"
				  >
			    </el-table-column>
				<el-table-column
					label="操作">
				<template slot-scope="scope">
				        <el-button
				          size="mini"
				          @click="showEditView(scope.$index, scope.row)">编辑</el-button>
				        <el-button
				          size="mini"
				          type="danger"
				          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				      </template>
				</el-table-column>
			  </el-table>
			  <el-button @click = "deleteMany" type="danger" size="small" style="margin-top: 10px;" :disabled="multipleSelection.length == 0">批量删除</el-button>
		</div>
		<el-dialog
		  title="修改角色"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <div>
			  <el-tag class="updateRoleLabel">角色_Zh</el-tag>
			  <el-input size="small" class="updateRoleInput" v-model="updateRole.nameZh"></el-input><br/>
			  <el-tag class="updateRoleLabel">角色_En</el-tag>
			  <el-input size="small" class="updateRoleInput" v-model="updateRole.name"></el-input>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
		    <el-button type="primary" @click="doUpdate" size="small">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		name:"DepMana",
		data(){
			return{
				role:{
					nameZh:'',
					name:''
				},
				updateRole:{
					id:'',
					name:'',
					nameZh:''
				},
				roles:[],
				dialogVisible:false,
				multipleSelection: []
			}
		},
		mounted() {
			this.initRoles();
		},
		methods:{
			deleteMany(){
				this.$confirm('确定删除这 '+ this.multipleSelection.length +' 个角色?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							let ids = '?';
							this.multipleSelection.forEach(item=>{
								ids += 'ids=' + item.id + '&';
							});
				          this.deleteRequest("/system/basic/role/" + ids).then(resp=>{
							  if(resp){
								  this.initRoles();
							  }
						  })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			showEditView(index,data){
				this.dialogVisible = true;
				this.updateRole.id = data.id;
				this.updateRole.name = data.name;
				this.updateRole.nameZh = data.nameZh;
			},
			doUpdate(){
				this.putRequest("/system/basic/role/",this.updateRole).then(resp=>{
					if(resp){
						this.initRoles();
						this.updateRole.name = '';
						this.updateRole.nameZh = '';
						this.dialogVisible = false;
					}
				})
			},
			handleDelete(index,data){
				this.$confirm('确定删除“' + data.nameZh + '”角色?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          this.deleteRequest("/system/basic/role/"+data.id).then(resp=>{
							  if(resp){
								  this.initRoles();
							  }
						  })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			addRole(){
				if(this.role.name && this.role.nameZh){
					this.postRequest("/system/basic/role/",this.role).then(resp=>{
						if(resp){
							this.initRoles();
							this.role.name = this.role.nameZh = '';
						}
					});
				}else{
					if(!this.role.nameZh){
						this.$message.error("角色_Zh未填写");
					}else if(!this.role.name){
						this.$message.error("角色_En未填写");
					}
				}
			},
			initRoles(){
				this.getRequest("/system/basic/role/").then(resp=>{
					if(resp){
						this.roles = resp;
					}
				})
			}
		}
	}
</script>

<style>
	.roleTable{
		margin-top: 10px;
	}
	.updateRoleLabel{
		margin-top: 10px;
	}
	.updateRoleInput{
		width: 200px;
		margin-top: 10px;
		margin-left: 8px;
	}
</style>
