<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <div class="brand-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="var(--color-plasma)" />
            <text x="14" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="900" font-family="Montserrat, sans-serif">Q</text>
          </svg>
        </div>
        <span class="brand-text">QUICKMIND</span>
      </router-link>

      <!-- Desktop Nav Links -->
      <div class="navbar-links">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="nav-link" active-class="nav-link--active">
            <component :is="LayoutDashboard" :size="16" />
            Dashboard
          </router-link>
          <router-link to="/curriculum" class="nav-link" active-class="nav-link--active">
            <component :is="BookOpen" :size="16" />
            Curriculum
          </router-link>
          <router-link to="/mathlympics" class="nav-link" active-class="nav-link--active">
            <component :is="Timer" :size="16" />
            Mathlympics
          </router-link>
        </template>
        <router-link to="/leaderboard" class="nav-link" active-class="nav-link--active">
          <component :is="Trophy" :size="16" />
          Leaderboard
        </router-link>
      </div>

      <!-- Right side -->
      <div class="navbar-right">
        <template v-if="authStore.isAuthenticated">
          <div class="xp-badge" v-if="authStore.profile">
            <component :is="Zap" :size="14" class="xp-icon" />
            <span>{{ authStore.profile.xp ?? 0 }} XP</span>
          </div>
          <button @click="handleSignOut" class="nav-btn nav-btn--ghost">
            <component :is="LogOut" :size="16" />
            <span class="btn-label">Sign Out</span>
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-btn nav-btn--ghost">Sign In</router-link>
          <router-link to="/signup" class="nav-btn nav-btn--primary">Get Started</router-link>
        </template>

        <!-- Mobile menu toggle -->
        <button @click="mobileOpen = !mobileOpen" class="mobile-toggle">
          <component :is="mobileOpen ? X : Menu" :size="24" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition name="slide-down">
      <div v-if="mobileOpen" class="mobile-menu" @click="mobileOpen = false">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="mobile-link">Dashboard</router-link>
          <router-link to="/curriculum" class="mobile-link">Curriculum</router-link>
          <router-link to="/mathlympics" class="mobile-link">Mathlympics</router-link>
        </template>
        <router-link to="/leaderboard" class="mobile-link">Leaderboard</router-link>
        <div class="mobile-divider" />
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="mobile-link">Sign In</router-link>
          <router-link to="/signup" class="mobile-link mobile-link--primary">Get Started</router-link>
        </template>
        <template v-else>
          <button @click="handleSignOut" class="mobile-link">Sign Out</button>
        </template>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LayoutDashboard, BookOpen, Timer, Trophy, Zap, LogOut, Menu, X } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const mobileOpen = ref(false)

async function handleSignOut() {
  await authStore.signOut()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 64px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-light);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-charcoal);
}

.brand-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.brand-text {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--color-charcoal);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  text-decoration: none;
  color: var(--color-subtext);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: color 0.2s, background 0.2s;
  border-radius: 6px;
}

.nav-link:hover {
  color: var(--color-charcoal);
  background: rgba(107, 191, 142, 0.08);
}

.nav-link--active {
  color: var(--color-plasma);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.xp-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border: 1px solid rgba(107, 191, 142, 0.3);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-plasma-dim);
  letter-spacing: 0.05em;
}

.xp-icon {
  color: var(--color-plasma);
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  border-radius: 6px;
}

.nav-btn--ghost {
  background: transparent;
  color: var(--color-subtext);
  border: 1px solid var(--color-border-light);
}

.nav-btn--ghost:hover {
  color: var(--color-charcoal);
  border-color: var(--color-workshop-dark);
}

.nav-btn--primary {
  background: var(--color-charcoal);
  color: white;
}

.nav-btn--primary:hover {
  background: #2d2d2d;
}

.btn-label {
  display: inline;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-charcoal);
  cursor: pointer;
  padding: 0.25rem;
}

/* Mobile menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  background: var(--color-workshop);
  border-bottom: 1px solid var(--color-border-light);
  padding: 1rem 1.5rem;
}

.mobile-link {
  display: block;
  padding: 0.75rem 0;
  text-decoration: none;
  color: var(--color-subtext);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.mobile-link:hover {
  color: var(--color-charcoal);
}

.mobile-link--primary {
  color: var(--color-plasma);
}

.mobile-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 0.5rem 0;
}

/* Slide animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .btn-label {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }

  .xp-badge {
    display: none;
  }

  .nav-btn--ghost,
  .nav-btn--primary {
    display: none;
  }
}
</style>
