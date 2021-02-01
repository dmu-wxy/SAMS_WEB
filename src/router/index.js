import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import test1 from '../views/test1.vue'
import test2 from '../views/test2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
	hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
	hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
	children:[
		{
			  path: '/test1',
			  name: 'test1',
			  component: test1
		},
		{
			  path: '/test2',
			  name: 'test2',
			  component: test2
		}
	]
  }
]

const router = new VueRouter({
  routes
})

export default router
