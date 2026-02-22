<template>
  <div class="dashboard-page">
    <header class="dash-header animate-fade-in-up">
      <div class="dash-welcome">
        <p class="dash-tag">DASHBOARD</p>
        <div class="welcome-row">
          <h1>Welcome back<template v-if="authStore.profile">, {{ authStore.profile.display_name || authStore.profile.username }}</template></h1>
          <button v-if="!isEditing" class="edit-profile-btn" @click="startEditing">
            <component :is="User" :size="14" />
            Edit Name
          </button>
        </div>
        
        <div v-if="isEditing" class="edit-name-form">
          <input 
            v-model="editedName" 
            class="name-input" 
            placeholder="Your Full Name" 
            @keyup.enter="saveProfile"
          />
          <div class="edit-actions">
            <button class="save-btn" @click="saveProfile" :disabled="profileStore.loading">Save</button>
            <button class="cancel-btn" @click="isEditing = false">Cancel</button>
          </div>
        </div>
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

    <!-- Recent Activity & Badges -->
    <section class="recent-section animate-fade-in-up delay-300">
      <div class="two-col">
        <div class="col">
          <h2 class="section-title">Recent Activity</h2>
          <div v-if="recentSessions.length === 0" class="placeholder-card">
            <component :is="Activity" :size="20" class="placeholder-icon" />
            <p>Your recent sessions will appear here once you start playing.</p>
          </div>
          <div v-else class="activity-list">
            <div v-for="session in recentSessions" :key="session.id" class="activity-item">
              <div class="activity-main">
                <span class="activity-cat">{{ session.category }}</span>
                <span class="activity-acc">{{ Math.round(session.accuracy * 100) }}%</span>
              </div>
              <div class="activity-meta">
                <span>{{ session.score }} answers</span> • <span>{{ Math.round(session.avg_time_ms / 1000) }}s avg</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="section-header-flex">
            <h2 class="section-title">Badges Earned</h2>
            <button class="learn-badges-btn" @click="showBadgesOverlay = true">
              <component :is="Info" :size="14" />
              Learn about Badges
            </button>
          </div>
          <div v-if="groupedBadges.length === 0" class="placeholder-card">
            <component :is="Award" :size="20" class="placeholder-icon" />
            <p>Complete lessons and challenges to earn badges.</p>
          </div>
          <div v-else class="badges-grid">
            <div v-for="badge in groupedBadges" :key="badge.id" class="badge-card">
              <BadgeItem v-bind="badge" />
              <span class="badge-name">{{ badge.name }}</span>
              <template v-if="badge.categories && badge.categories.length">
                <span v-for="(cat, idx) in badge.categories" :key="idx" class="badge-subtitle">{{ cat }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Overlays -->
    <BadgesOverlay v-if="showBadgesOverlay" @close="showBadgesOverlay = false" />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { supabase } from '@/lib/supabase'
import { Zap, Timer, BookOpen, Trophy, Activity, Award, Info, User } from 'lucide-vue-next'
import BadgeItem from '@/components/features/BadgeItem.vue'
import BadgesOverlay from '@/components/features/BadgesOverlay.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const recentSessions = ref([])
const showBadgesOverlay = ref(false)

const isEditing = ref(false)
const editedName = ref('')

function startEditing() {
  editedName.value = authStore.profile?.display_name || ''
  isEditing.value = true
}

async function saveProfile() {
  if (!editedName.value) return
  const { error } = await profileStore.updateProfile(authStore.user.id, {
    display_name: editedName.value
  })
  if (!error) {
    await authStore.fetchProfile() // Sync auth store
    isEditing.value = false
  }
}

onMounted(async () => {
  if (authStore.user) {
    profileStore.fetchBadges(authStore.user.id)
    fetchRecentSessions()
  }
})

async function fetchRecentSessions() {
  const { data } = await supabase
    .from('mathlympics_sessions')
    .select('*')
    .eq('user_id', authStore.user.id)
    .order('played_at', { ascending: false })
    .limit(5)
  recentSessions.value = data || []
}

const categoryLabels = {
  '2x1': '2×1 Digit',
  '3x1': '3×1 Digit',
  '2x2': '2×2 Digit',
  'squaring': 'Squaring',
  'multiples_11': 'Multiples of 11',
  'day_of_week': 'Day of Week',
}

const groupedBadges = computed(() => {
  const groups = {}
  profileStore.badges.forEach(badge => {
    if (!groups[badge.id]) {
      groups[badge.id] = { ...badge, count: 0, categories: [] }
    }
    groups[badge.id].count++

    if (['medal_gold', 'medal_silver', 'medal_bronze'].includes(badge.id) && badge.metadata?.category) {
      const catLabel = categoryLabels[badge.metadata.category] || badge.metadata.category
      if (!groups[badge.id].categories.includes(catLabel)) {
        groups[badge.id].categories.push(catLabel)
      }
    }
  })
  return Object.values(groups)
})
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
  margin: 0;
}

.welcome-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.edit-profile-btn {
  background: none;
  border: 1px solid var(--color-border-light);
  color: var(--color-subtext);
  font-size: 0.72rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.edit-profile-btn:hover {
  background: var(--color-workshop-alt);
  color: var(--color-charcoal);
  border-color: var(--color-border);
}

.edit-name-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 300px;
}

.name-input {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  font-size: 0.88rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-btn, .cancel-btn {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.save-btn {
  background: var(--color-plasma);
  color: #1a1a1a;
  border: none;
}

.cancel-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-subtext);
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
  margin-bottom: 0;
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.learn-badges-btn {
  background: none;
  border: none;
  color: var(--color-plasma);
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.learn-badges-btn:hover {
  background: var(--color-plasma-soft);
  color: var(--color-plasma-dim);
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

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  padding: 0.5rem;
}

.badge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
}

.badge-name {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-charcoal);
  line-height: 1.2;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.badge-subtitle {
  font-size: 0.58rem;
  font-weight: 500;
  color: var(--color-subtext);
  line-height: 1.1;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  padding: 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  transition: all 0.2s;
}

.activity-item:hover {
  border-color: var(--color-plasma);
  background: var(--color-plasma-soft);
}

.activity-main {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.activity-cat {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-charcoal);
  text-transform: uppercase;
}

.activity-acc {
  font-weight: 800;
  color: var(--color-plasma);
  font-size: 0.85rem;
}

.activity-meta {
  font-size: 0.75rem;
  color: var(--color-subtext);
}

@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
