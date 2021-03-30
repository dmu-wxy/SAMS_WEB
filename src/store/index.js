import Vue from 'vue'
import Vuex from 'vuex'
import { Notification } from 'element-ui';
import {getRequest} from "../utils/api.js"
import '../utils/stomp'
import SockJS from 'sockjs-client'

Vue.use(Vuex)

const now = new Date();

const store = new Vuex.Store({
	state:{
		routes:[],
		sessions:{},
		managers:[],
		currentSession: null,
		currentManager: JSON.parse(window.sessionStorage.getItem("manager")),
		filterKey:'',
		stomp: null,
		isDot:{}
	},
	mutations:{
		INIT_CURRENT_MANAGER(state,manager){
			state.currentManager = manager;
		},
		initRoutes(state,data){
			state.routes = data;
		},
		changeCurrentSession (state,currentSession) {
			Vue.set(state.isDot,state.currentManager.mname + '#' + currentSession.mname,false);
			state.currentSession = currentSession;
		},
		addMessage (state,msg) {
			let mss = state.sessions[state.currentManager.mname + '#' + msg.to];
			if(!mss){
				// state.sessions[state.currentManager.mname + '#' + msg.to] = [];
				Vue.set(state.sessions, state.currentManager.mname + '#' + msg.to, []);
			}
			state.sessions[state.currentManager.mname + '#' + msg.to].push({
				content:msg.content,
				date: new Date(),
				self: !msg.notSelf
			})
		},
		INIT_DATA (state) {
			//浏览器本地的历史聊天记录可以在这里完成
			
		  let data = localStorage.getItem('vue-chat-session');
		  if (data) {
			state.sessions = JSON.parse(data);
		  }
		},
		INIT_MANAGER(state,data){
			state.managers = data;
		}
	},
	actions:{
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {
					let receiveMsg = JSON.parse(msg.body);
					if(!context.state.currentSession || receiveMsg.from != context.state.currentSession.mname){
						Notification.info({
							title: '【' + receiveMsg.fromNickName + '】发来一条消息',
							message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0,10) + '...' : receiveMsg.content,
							position: 'bottom-right'
						});
						Vue.set(context.state.isDot,context.state.currentManager.mname + '#' + receiveMsg.from,true);
					}
					receiveMsg.notSelf = true;
					receiveMsg.to = receiveMsg.from;
					context.commit('addMessage',receiveMsg)
                })
            }, error => {
				console.log(">>>>>>>>>>>>>>>>>>" + context.state)
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
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
  deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;
