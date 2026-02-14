<template>
  <div class="dashboard-page">
    <header class="dash-header animate-fade-in-up">
      <div class="dash-welcome">
        <p class="dash-tag">DASHBOARD</p>
        <h1>Welcome back<template v-if="authStore.profile">, {{ authStore.profile.display_name || authStore.profile.username }}</template></h1>
        <hr class="plasma-line" />
      </div>
      <div class="dash-stats" v-if="authStore.profile">
        <div class="stat-card">
          <component :is="Zap" :size="18" class="stat-icon" />
          <div>
            <span class="stat-value">{{ authStore.profile.xp ?? 0 }}</span>
            <span class="stat-label">Total XP</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Quick Actions -->
    <section class="quick-actions animate-fade-in-up delay-200">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/mathlympics" class="action-card">
          <component :is="Timer" :size="24" class="action-icon" />
          <h3>Start Challenge</h3>
          <p>Timed mental math drill</p>
        </router-link>
        <router-link to="/curriculum" class="action-card">
          <component :is="BookOpen" :size="24" class="action-icon" />
          <h3>Continue Learning</h3>
          <p>Resume your curriculum</p>
        </router-link>
        <router-link to="/leaderboard" class="action-card">
          <component :is="Trophy" :size="24" class="action-icon" />
          <h3>Leaderboard</h3>
          <p>See top performers</p>
        </router-link>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="recent-section animate-fade-in-up delay-300">
      <div class="two-col">
        <div class="col">
          <h2 class="section-title">Recent Activity</h2>
          <div class="placeholder-card">
            <component :is="Activity" :size="20" class="placeholder-icon" />
            <p>Your recent sessions will appear here once you start playing.</p>
          </div>
        </div>
        <div class="col">
          <h2 class="section-title">Badges Earned</h2>
          <div class="placeholder-card">
            <component :is="Award" :size="20" class="placeholder-icon" />
            <p>Complete lessons and challenges to earn badges.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { Zap, Timer, BookOpen, Trophy, Activity, Award } from 'lucide-vue-next'

const authStore = useAuthStore()
</script>

<style scoped>
.dashboard-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.dash-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.5rem;
}

.dash-header h1 {
  font-size: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.5rem;
  background: var(--color-plasma-soft);
  border: 1px solid rgba(107, 191, 142, 0.25);
  border-radius: 10px;
}

.stat-icon {
  color: var(--color-plasma);
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-charcoal);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-subtext);
}

.section-title {
  font-family: var(--font-family-sans);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-subtext);
  margin-bottom: 1rem;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 2.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.action-card {
  padding: 1.5rem;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.action-card:hover {
  border-color: rgba(107, 191, 142, 0.4);
  box-shadow: var(--shadow-elevation-2);
  transform: translateY(-2px);
}

.action-icon {
  color: var(--color-plasma);
  margin-bottom: 1rem;
}

.action-card h3 {
  font-family: var(--font-family-sans);
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-charcoal);
}

.action-card p {
  font-size: 0.82rem;
  color: var(--color-subtext);
}

/* Recent Activity */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.placeholder-card {
  padding: 2rem;
  border: 1px dashed var(--color-border-light);
  border-radius: 10px;
  text-align: center;
}

.placeholder-icon {
  color: var(--color-subtext);
  opacity: 0.4;
  margin-bottom: 0.75rem;
}

.placeholder-card p {
  font-size: 0.82rem;
  color: var(--color-subtext);
}

@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
