import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('@/views/SignupView.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/curriculum',
        name: 'Curriculum',
        component: () => import('@/views/CurriculumView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/lessons/:id',
        name: 'Lesson',
        component: () => import('@/views/LessonView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/mathlympics',
        name: 'Mathlympics',
        component: () => import('@/views/MathlympicsView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: () => import('@/views/LeaderboardView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    // Wait for auth to initialize on first navigation
    if (!authStore.initialized) {
        await authStore.init()
    }

    if (to.meta.requiresAuth && !authStore.user) {
        return { name: 'Login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && authStore.user) {
        return { name: 'Dashboard' }
    }
})

export default router
