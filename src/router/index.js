import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../components/DashboardPage.vue'
import AdminPanel from '../components/AdminPanel.vue'
import LoginPage from '../components/LoginPage.vue'
import { checkAuthStatus } from '../utils/authGuard'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuthStatus()
    if (isAuthenticated) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router