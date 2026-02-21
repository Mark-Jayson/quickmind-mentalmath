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

import { useMathlympicsStore } from '@/stores/mathlympics'

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()
    
    // Check if navigating away from an active Mathlympics game
    if (from.name === 'Mathlympics' && to.name !== 'Mathlympics') {
        const mathStore = useMathlympicsStore()
        if (mathStore.isPlaying && !mathStore.pendingNavigation) {
            mathStore.pendingNavigation = to
            return false // Abort navigation; the view's watcher will show the Quit overlay
        }
    }

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
