<template>
    <div>
        <el-tabs type="card">
          <el-tab-pane label="角色管理(废弃)"><RoleMana></RoleMana></el-tab-pane>
          <el-tab-pane label="权限组"><PermissMana></PermissMana></el-tab-pane>
		  <el-tab-pane label="学校管理">学校管理</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
	import RoleMana from "../../components/sys/basic/RoleMana.vue";
	import PermissMana from "../../components/sys/basic/PermissMana.vue";
	
    export default{
		name:"SysBasic",
		data(){
			return {
			}
		},
		components:{
			RoleMana,
			PermissMana
		}
	}
</script>

<style scoped>

</style>