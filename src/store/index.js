import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../utils/api.js"
import '../utils/sockjs'
import '../utils/stomp'
// import SockJS from "../utils/sockjs"
// import Stomp from "../utils/stomp"

Vue.use(Vuex)

const now = new Date();

const store = new Vuex.Store({
	state:{
		routes:[],
		sessions:[],
		managers:[],
		currentSessionId: -1,
		filterKey:'',
		stomp: null
	},
	mutations:{
		initRoutes(state,data){
			state.routes = data;
		},
		changeCurrentSessionId (state,id) {
			state.currentSessionId = id;
		},
		addMessage (state,msg) {
			state.sessions[state.currentSessionId-1].messages.push({
				content:msg,
				date: new Date(),
				self:true
			})
		},
		INIT_DATA (state) {
			//浏览器本地的历史聊天记录可以在这里完成
			
		 //  let data = localStorage.getItem('vue-chat-session');
		 //  //console.log(data)
		 //  if (data) {
			// state.sessions = JSON.parse(data);
		 //  }
		},
		INIT_MANAGER(state,data){
			state.managers = data;
		}
	},
	actions:{
        connect(context) {
			console.log("连接webSocket")
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {
					console.log(msg.body);
                    context.commit('addMessage', receiveMsg);
                })
            }, error => {

            })
        },
		initData (context) {
			console.log("初始化数据");
		  context.commit('INIT_DATA')
		  getRequest("/chat/managers").then(resp=>{
			  if(resp){
				context.commit('INIT_MANAGER',resp);
			  }
		  })
		}
	}
})
store.watch(function (state) {
  return state.sessions
},function (val) {
  console.log('CHANGE: ', val);
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
  deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;
