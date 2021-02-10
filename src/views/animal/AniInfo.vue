<template>
	<div>
		<div style="display: flex;justify-content: space-between;">
			<div>
				<el-input clearable @clear="initAnimal()" @keydown.enter.native="initAnimal()" v-model="keywords" style="width: 300px; margin-right: 10px;" placeholder="输入动物名字进行搜索" prefix-icon="el-icon-search" size="small"></el-input>
				<el-button @click="initAnimal()" icon="el-icon-search" type="primary" size="small">搜索</el-button>
				<el-button type="primary" size="small">
					<i class="fa fa-angle-double-down" aria-hidden="true"></i>
					<span style="margin-left: 10px;">高级搜索</span>
				</el-button>
			</div>
			<div>
				<el-button size="small" type="success">
					<i class="fa fa-level-down" aria-hidden="true"></i>
					导入数据</el-button>
				<el-button size="small" type="success" @click="exportData">
					<i class="fa fa-level-up" aria-hidden="true"></i>					
					导出数据</el-button>
				<el-button size="small" type="primary" icon="el-icon-plus" @click="showAddAnimalView">添加动物</el-button>
			</div>
		</div>
		<div style="margin-top: 10px;">
			<el-table
				v-loading="loading"
				element-loading-text="加载中..."
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			      :data="animals"
				  border
				  stripe
			      style="width: 100%"
				  height="400"
				  size="small">
				  <el-table-column
					type="selection"
					width="55px">
				  </el-table-column>
			      <el-table-column
			        prop="aname"
			        label="名字"
					fixed
			        width="90px">
			      </el-table-column>
			      <el-table-column
			        prop="breed"
			        label="品种"
			        width="150px">
			      </el-table-column>
			      <el-table-column
			        prop="p_addr"
			        label="位置"
					width="180px">
			      </el-table-column>
				  <el-table-column
				    label="性别"
					prop="gender"
					width="55px">
				  </el-table-column>
				  <el-table-column
				    prop="birth"
				    label="出生日期"
					width="150px">
				  </el-table-column>
				  <el-table-column
					fixed="right"
					align="left"
				    label="操作">
					<template slot-scope="scope">
						<el-button style="padding:3px" size="small" @click="showEditAnimalView(scope.row)" >编辑</el-button>
						<el-button style="padding:3px" size="small" type="primary">查看完整信息</el-button>
						<el-button style="padding:3px" size="small" type="danger" @click="deleteAnimal(scope.row)">删除</el-button>
					</template>
				  </el-table-column>
			    </el-table>
				<div style="display: flex;justify-content: flex-end; margin-top: 10px;">
					<el-pagination
					  background
					  @current-change = "currentChange"
					  @size-change ="sizeChange"
					  layout="sizes, prev, pager, next, jumper, ->, total, slot"
					  :total="total">
					</el-pagination>
				</div>
		</div>
		<el-dialog
		  :title="title"
		  :visible.sync="dialogVisible"
		  width="60%">
		  <div>
			  <el-form :model="animal" :rules="rules" ref="animalForm">
				  <el-row>
					  <el-col :span="8">
						  <el-form-item label="名字:" prop="aname">
							  <el-input style="width: 180px;" size="small" placeholder="请输入流浪动物的名字" prefix-icon="el-icon-edit" v-model="animal.aname"></el-input>
						  </el-form-item>
					  </el-col>
					  <el-col :span="6">
						  <el-form-item label="性别:" prop="gender">
							  <el-radio-group v-model="animal.gender">
								  <el-radio label="公" style="margin-right: 20px;">公</el-radio>
								  <el-radio label="母" style="margin-left: 0px;">母</el-radio>
							  </el-radio-group>
						  </el-form-item>
					  </el-col>
					  <el-col :span="10">
						  <el-form-item label="出生日期:" prop="birth">
							  <el-date-picker
								v-model="animal.birth"
								size="small"
								type="date"
								value-format="yyyy-MM-dd"
								style="10px"
								placeholder="选择日期">
							  </el-date-picker>
						  </el-form-item>
					  </el-col>
				  </el-row>
				  <el-row>
					  <el-col :span="8">
						  <!-- todo: 需要下拉框选择品种 -->
						  <el-form-item label="品种:" prop="breed">
							  <el-input style="width: 180px;" size="small" placeholder="请输入流浪动物的品种" prefix-icon="el-icon-edit" v-model="animal.breed"></el-input>
						  </el-form-item>
					  </el-col>
					  <el-col :span="12">
						  <el-form-item label="位置:" prop="p_addr">
							  <el-input style="width: 80%;" size="small" placeholder="请输入流浪动物的位置" prefix-icon="el-icon-edit" v-model="animal.p_addr"></el-input>
						  </el-form-item>
					  </el-col>
				  </el-row>
			  </el-form>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="doAddAnimal">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
	    name: "AniInfo",
		data(){
			return{
				title:'',
				animals: [],
				loading: false,
				total:0,
				page:1,
				size:10,
				keywords:'',
				animal:{
					aname:'',
					gender:'',
					birth:'',
					breed:'',
					p_addr:''
				},
				dialogVisible:false,
				rules:{
					aname: [{required: true, message: '请输入名字', trigger: 'blur'}],
					gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
					birth: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
					breed: [{required: true, message: '请输入品种', trigger: 'blur'}],
					p_addr: [{required: true, message: '请输入位置', trigger: 'blur'}]
				}
			}
		},
		mounted() {
			this.initAnimal();
		},
		methods:{
			exportData(){
				window.open('/animal/info/export','_parent');
			},
			emptyAnimal(){
				this.animal = {
					aid:'',
					aname:'',
					gender:'',
					birth:'',
					breed:'',
					p_addr:''
				};
				console.log("清除数据成功");
			},
			deleteAnimal(animal){
				 this.$confirm('此操作将删除“' + animal.aname + '”, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          this.deleteRequest("/animal/info/"+animal.aid).then(resp=>{
							  if(resp){
								  this.initAnimal();
							  }
						  })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			showAddAnimalView(){
				this.emptyAnimal();
				this.title = '添加动物';
				this.dialogVisible = true;
			},
			showEditAnimalView(animal){
				this.title = '编辑信息';
				this.animal = animal;
				this.dialogVisible = true;
			},
			sizeChange(currentSize){
				this.size = currentSize;
				this.initAnimal();
			},
			currentChange(currentPage){
				this.page = currentPage;
				this.initAnimal();
			},
			initAnimal(){
				this.loading = true;
				this.getRequest("/animal/info/?page=" + this.page + "&size=" + this.size + "&keywords=" + this.keywords).then(resp=>{
					this.loading = false;
					if(resp){
						this.animals = resp.data;
						this.total = resp.total;
					}
				})
			},
			doAddAnimal(){
				if(this.animal.aid){
					this.$refs['animalForm'].validate(valid=>{
						if(valid){
							this.putRequest("/animal/info/",this.animal).then(resp=>{
								if(resp){
									this.dialogVisible = false;
									this.initAnimal();
								}
							});
						}
					})
					
				}else{
					this.$refs['animalForm'].validate(valid=>{
						if(valid){
							this.postRequest("/animal/info/",this.animal).then(resp=>{
								if(resp){
									this.dialogVisible = false;
									this.initAnimal();
								}
							});
						}
					})
				}
				this.emptyAnimal();
			}
		}
	}
</script>

<style>
	
</style>
