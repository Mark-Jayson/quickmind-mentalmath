<template>
  <div class="badges-overlay" @click.self="$emit('close')">
    <div class="overlay-content animate-fade-in-up">
      <header class="overlay-header">
        <div class="header-main">
          <h2>Badge Collection</h2>
          <p>Collect badges by finishing lessons, achieving perfect scores, and dominating the leaderboard.</p>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <component :is="X" :size="24" />
        </button>
      </header>
      <hr class="plasma-line" />

      <div class="badges-explorer">
        <div v-for="(group, category) in groupedBadges" :key="category" class="badge-category-section">
          <h3 class="category-title">{{ categoryLabels[category] }}</h3>
          <div class="explorer-grid">
            <div 
              v-for="badge in group" 
              :key="badge.id" 
              class="badge-info-card"
              :class="{ 'badge-info-card--unlocked': isUnlocked(badge.id) }"
            >
              <div class="card-badge-wrapper">
                <BadgeItem v-bind="badge" :count="1" />
                <div v-if="!isUnlocked(badge.id)" class="badge-lock">
                  <component :is="Lock" :size="12" />
                </div>
              </div>
              <div class="card-details">
                <h4>{{ badge.name }}</h4>
                <p>{{ badge.description }}</p>
                <div class="card-xp">+{{ badge.xp_reward }} XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { X, Lock } from 'lucide-vue-next'
import BadgeItem from './BadgeItem.vue'

const emit = defineEmits(['close'])
const profileStore = useProfileStore()

onMounted(() => {
  profileStore.fetchAllBadges()
})

const isUnlocked = (badgeId) => {
  return profileStore.badges.some(b => b.id === badgeId)
}

const categoryLabels = {
  lesson: 'Curriculum Mastery',
  mathlympics: 'Challenge Milestones',
  milestone: 'Grand Achievements'
}

const groupedBadges = computed(() => {
  const groups = {}
  profileStore.allBadges.forEach(badge => {
    const cat = badge.category || 'milestone'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(badge)
  })
  return groups
})
</script>

<style scoped>
.badges-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.overlay-content {
  background: var(--color-workshop);
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  border-radius: 20px;
  box-shadow: var(--shadow-elevation-4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.overlay-header {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-main h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.header-main p {
  color: var(--color-subtext);
  font-size: 0.9rem;
  line-height: 1.5;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-subtext);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--color-workshop);
  color: var(--color-charcoal);
}

.badges-explorer {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.category-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-plasma);
  margin-bottom: 1.5rem;
}

.explorer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.badge-info-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  background: var(--color-workshop-alt);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  transition: all 0.2s;
  opacity: 0.8;
  filter: grayscale(0.8);
}

.badge-info-card--unlocked {
  opacity: 1;
  filter: grayscale(0);
  border-color: var(--color-plasma-soft);
  background: var(--color-plasma-soft);
}

.card-badge-wrapper {
  position: relative;
  flex-shrink: 0;
}

.badge-lock {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--color-subtext);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-background);
}

.card-details h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: var(--color-charcoal);
}

.card-details p {
  font-size: 0.78rem;
  color: var(--color-subtext);
  line-height: 1.4;
  margin-bottom: 0.4rem;
}

.card-xp {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--color-plasma);
  letter-spacing: 0.05em;
}

@media (max-width: 640px) {
  .badges-overlay {
    padding: 0;
  }
  .overlay-content {
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
  .explorer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
