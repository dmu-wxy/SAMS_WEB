import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';

import {postRequest} from './utils/api.js'
import {postKeyValueRequest} from './utils/api.js'
import {getRequest} from './utils/api.js'
import {putRequest} from './utils/api.js'
import {deleteRequest} from './utils/api.js'
import {initMenu} from './utils/menus.js'

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false

Vue.use(ElementUI);

//路由导航守卫
router.beforeEach((to,from,next)=>{
	if(to.path == '/'){
		//如果去login页，放行
		next();
	}else{
		//否则判断是否登录
		if(window.sessionStorage.getItem("manager")){
			//如果登录了，加载菜单
			initMenu(router,store);
			next();
		}else{
			//如果没登录，跳转到登录页面,登录后到之前输入的url
			next('/?redirect=' + to.path);
		}
	}
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
