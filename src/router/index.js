import { createRouter, createWebHashHistory } from 'vue-router'
import { useWanderStore } from '../stores/useWanderStore'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MyTravelsView from '../views/MyTravelsView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/my-travels', name: 'my-travels', component: MyTravelsView, meta: { requiresAuth: true } },
  { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const store = useWanderStore()
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router