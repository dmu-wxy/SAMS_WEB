<template>
  <div id="list">
  	<ul style="padding-left: 0px;">
  		<li v-for="item in managers" :class="{ active: currentSession?item.mname === currentSession.mname:false }" v-on:click="changeCurrentSession(item)"><!--   :class="[item.id === currentSessionId ? 'active':'']" -->
  			<el-badge :is-dot="isDot[manager.mname + '#' + item.mname]"><img class="avatar" :src="item.face" :alt="item.mname"></el-badge>
  			<p class="name">{{item.mname}}</p>
  		</li>
  	</ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'list',
  data () {
    return {
      manager:JSON.parse(window.sessionStorage.getItem("manager"))
    }
  },
  computed: mapState([
  'managers',
  'isDot',
  'currentSession'
	]),
  methods:{
  	changeCurrentSession (currentSession) {
  		this.$store.commit('changeCurrentSession',currentSession)
  	}
  }
}
</script>

<style lang="scss" scoped>
#list {
	li {
		padding: 16px 15px;
		border-bottom: 1px solid #292C33;
		cursor: pointer;
		list-style: none;
		&:hover {
			background-color: rgba(255, 255, 255, 0.03);
		}
	}
  li.active {/*注意这个是.不是冒号:*/
			background-color: rgba(255, 255, 255, 0.1);
	}
	.avatar {
		border-radius: 2px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
	.name {
		display: inline-block;
		margin-left: 15px;
		margin-top: 0px;
		margin-bottom: 0px;
	}
}
</style>
