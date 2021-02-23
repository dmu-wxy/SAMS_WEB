<template>
	<div>
		<div>
			<div style="display: flex;justify-content: space-between;">
				<div>
					<el-input :disabled="advancedSearchDisabled" clearable @clear="initMoney()" @keydown.enter.native="initMoney()" v-model="keywords" style="width: 300px; margin-right: 10px;" placeholder="输入操作员名字进行搜索" prefix-icon="el-icon-search" size="small"></el-input>
					<el-button :disabled="advancedSearchDisabled" @click="initMoney()" icon="el-icon-search" type="primary" size="small">搜索</el-button>
					<el-button @click="advancedSearchDisabled = !advancedSearchDisabled" type="primary" size="small">
						<i :class="advancedSearchDisabled ? 'fa fa-angle-double-up': 'fa fa-angle-double-down'" aria-hidden="true"></i>
						<span style="margin-left: 10px;">高级搜索</span>
					</el-button>
				</div>
				<div>
					<el-upload
						style="display: inline-flex;margin-right: 10px;"
						:show-file-list="false"
						:before-upload="beforeUpload"
						:on-success="onSuccess"
						:on-error="onError"
						:disabled="importDataBtnDisabled"
						action="">
						<el-button :disabled="importDataBtnDisabled" size="small" type="success" :icon="importDataBtnIcon">
							{{importDataBtnText}}</el-button>
					</el-upload>
					<el-button size="small" type="success" @click="" icon="el-icon-download">
						导出数据</el-button>
					<el-button size="small" type="primary" icon="el-icon-plus" @click="showAddMoneyView">添加资金记录</el-button>
				</div>
			</div>
			<transition name="slide-fade">
			<div v-show="advancedSearchDisabled" style="border: 1px solid #409EFF; border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0;">
				<el-row>
					<el-col :span="10">
						日期区间：
						<el-date-picker
							  size="small"
						      v-model="advancedSearchValue.date"
							  value-format="yyyy-MM-dd"
						      type="daterange"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
					</el-col>
					<el-col :span="7" style="margin-top: 5px;">
						收入/支出：
						<el-radio-group v-model="advancedSearchValue.io">
						  <el-radio label="收入">收入</el-radio>
						  <el-radio label="支出">支出</el-radio>
						</el-radio-group>
					</el-col>
					<el-col style="text-align: right;" :span="6">
						<el-button size="small" >取消</el-button>
						<el-button @click="initMoney('advanced')" size="small" icon="el-icon-search" type="primary">搜索</el-button>
					</el-col>
				</el-row>
			</div>
			</transition>
		</div>
		<div style="margin-top: 10px;">
			<el-table
				v-loading="loading"
				element-loading-text="加载中..."
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			      :data="monies"
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
			        prop="amount"
			        label="金额"
					fixed
			        width="90px">
			      </el-table-column>
			      <el-table-column
			        prop="io"
			        label="收入/支出"
			        width="150px">
			      </el-table-column>
			      <el-table-column
			        prop="type"
			        label="类型"
					width="180px">
			      </el-table-column>
				  <el-table-column
				    prop="mname"
				    label="操作员"
				  	width="180px">
				  </el-table-column>
				  <el-table-column
				    label="状态"
					prop="status"
					width="55px">
				  </el-table-column>
				  <el-table-column
				    prop="date"
				    label="时间"
					width="150px">
				  </el-table-column>
				  <el-table-column
				    prop="info"
				    label="备注"
					width="150px">
				  </el-table-column>
				  <el-table-column
					fixed="right"
					align="left"
				    label="操作">
					<template slot-scope="scope">
						<el-button style="padding:3px" size="small" @click="showEditMoneyView(scope.row)" >编辑</el-button>
						<el-button style="padding:3px" size="small" type="danger" @click="deleteMoney(scope.row)">删除</el-button>
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
			  <el-steps :space="200" :active="1" finish-status="success">
			    <el-step title="已完成"></el-step>
			    <el-step title="进行中"></el-step>
			    <el-step title="步骤 3"></el-step>
			  </el-steps>
			  <el-form :model="money" :rules="rules" ref="animalForm">
				  <el-row>
					  <el-col :span="8">
						  <el-form-item label="金额" prop="amount">
							  <el-input style="width: 180px;" size="small" placeholder="请输入金额" prefix-icon="el-icon-edit" v-model="money.amount"></el-input>
						  </el-form-item>
					  </el-col>
					  <el-col :span="6">
						  <el-form-item label="收入/支出:" prop="io">
							  <el-radio-group v-model="money.io">
								  <el-radio label="收入" style="margin-right: 20px;">收入</el-radio>
								  <el-radio label="支出" style="margin-left: 0px;">支出</el-radio>
							  </el-radio-group>
						  </el-form-item>
					  </el-col>
					  <el-col :span="10">
						  <el-form-item label="时间:" prop="date">
							  <el-date-picker
								v-model="money.date"
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
						  <el-form-item label="类型:" prop="type">
							  <el-input style="width: 180px;" size="small" placeholder="请输入类型" prefix-icon="el-icon-edit" v-model="money.type"></el-input>
						  </el-form-item>
					  </el-col>
					  <el-col :span="12">
						  <el-form-item label="备注:" prop="info">
							  <el-input style="width: 80%;" size="small" placeholder="请输入备注" prefix-icon="el-icon-edit" v-model="money.info"></el-input>
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
	export default{
		name:"MonInfo",
		data(){
			return{
				advancedSearchDisabled:false,
				monies:[],
				total:0,
				importDataBtnText: '导入数据',
				importDataBtnIcon: 'el-icon-upload2',
				importDataBtnDisabled: false,
				advancedSearchValue:{},
				title:'添加记录',
				dialogVisible:false,
				money:{},
				keywords:'',
				loading:false,
				rules:{
					// aname: [{required: true, message: '请输入名字', trigger: 'blur'}]
				}
			}
		},
		mounted() {
			this.initMoney();
		},
		methods:{
			beforeUpload(){
				this.importDataBtnText = '正在导入';
				this.importDataBtnIcon = 'el-icon-loading';
				this.importDataBtnDisabled = true;
			},
			onSuccess(response, file, fileList){
				this.importDataBtnText = '导入数据';
				this.importDataBtnIcon = 'el-icon-upload2';
				this.importDataBtnDisabled = false;
				this.initAnimal();
			},
			onError(err, file, fileList){
				this.importDataBtnText = '导入数据';
				this.importDataBtnIcon = 'el-icon-upload2';
				this.importDataBtnDisabled = false;
			},
			sizeChange(currentSize){
				this.size = currentSize;
				this.initAnimal();
			},
			currentChange(currentPage){
				this.page = currentPage;
				this.initAnimal();
			},
			initMoney(advanced){
				if(!advanced){
					this.getRequest("/money/info/").then(resp=>{
						if(resp){
							console.log(resp.data)
							this.monies = resp.data;
							this.total = resp.total;
						}
					})
				}
			},
			showAddMoneyView(){
				this.dialogVisible = true;
				this.title = '添加资金流记录';
			},
			showEditMoneyView(data){
				
			},
			deleteMoney(data){
				
			},
			doAddAnimal(){
				
			}
		}
	}
</script>

<style>
	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	.slide-fade-enter-active {
	  transition: all .3s ease;
	}
	.slide-fade-leave-active {
	  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active for below version 2.1.8 */ {
	  transform: translateX(10px);
	  opacity: 0;
	}
</style>
