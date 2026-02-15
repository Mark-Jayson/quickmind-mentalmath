<template>
  <div class="curriculum-page">
    <header class="cur-header animate-fade-in-up">
      <p class="cur-tag">CURRICULUM</p>
      <h1>Master the techniques</h1>
      <p class="cur-subtitle">Step-by-step lessons based on Arthur Benjamin's methods.</p>
      <hr class="plasma-line" />
    </header>

    <!-- Categories -->
    <div v-for="(category, i) in categories" :key="category.key" class="category-section animate-fade-in-up" :style="{ animationDelay: `${0.1 + i * 0.1}s` }">
      <h2 class="category-title">
        <component :is="category.icon" :size="18" class="cat-icon" />
        {{ category.label }}
      </h2>
      <div class="lessons-list">
        <router-link
          v-for="lesson in category.items"
          :key="lesson.id"
          :to="`/lessons/${lesson.id}`"
          class="lesson-card"
        >
          <div class="lesson-status">
            <div :class="['status-dot', { 'status-dot--done': lesson.completed }]">
              <component :is="lesson.completed ? CheckCircle : Circle" :size="16" />
            </div>
          </div>
          <div class="lesson-info">
            <h3>{{ lesson.title }}</h3>
            <p>{{ lesson.description }}</p>
          </div>
          <div class="lesson-arrow">
            <component :is="ChevronRight" :size="18" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useLessonsStore } from '@/stores/lessons'
import { useAuthStore } from '@/stores/auth'
import { Plus, Grid3X3, Brain, Calendar, CheckCircle, Circle, ChevronRight } from 'lucide-vue-next'

const store = useLessonsStore()
const authStore = useAuthStore()

const categoryConfig = {
  addition: { label: 'Addition Techniques', icon: Plus },
  multiplication: { label: 'Multiplication Techniques', icon: Grid3X3 },
  memory: { label: 'Memory & Strategy', icon: Brain },
  calendar: { label: 'Calendar Secrets', icon: Calendar },
}

const categories = computed(() => {
  const result = []
  // Define custom sort order for categories
  const order = ['addition', 'multiplication', 'memory', 'calendar']
  
  for (const key of order) {
    if (store.categories[key]) {
      const config = categoryConfig[key] || { label: key, icon: Circle }
      result.push({
        key,
        label: config.label,
        icon: config.icon,
        items: store.categories[key].map(l => ({
          ...l,
          completed: store.progress[l.id]?.completed || false
        }))
      })
    }
  }
  
  // Add any other categories not in the explicit order
  Object.keys(store.categories).forEach(key => {
    if (!order.includes(key)) {
      result.push({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        icon: Circle,
        items: store.categories[key].map(l => ({ ...l, completed: store.progress[l.id]?.completed || false }))
      })
    }
  })
  
  return result
})

onMounted(async () => {
    await store.fetchLessons()
    if (authStore.user) {
        await store.fetchProgress(authStore.user.id)
    }
})
</script>

<style scoped>
.curriculum-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.cur-header { margin-bottom: 2.5rem; }

.cur-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.5rem;
}

.cur-header h1 { font-size: 2rem; margin-bottom: 0.4rem; }

.cur-subtitle { color: var(--color-subtext); font-size: 0.95rem; }

.category-section {
  margin-bottom: 2.5rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-family-sans);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-subtext);
  margin-bottom: 1rem;
}

.cat-icon {
  color: var(--color-plasma);
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lesson-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
}

.lesson-card:hover {
  border-color: rgba(107, 191, 142, 0.4);
  box-shadow: var(--shadow-elevation-1);
  transform: translateX(4px);
}

.status-dot {
  color: var(--color-subtext);
  opacity: 0.4;
}

.status-dot--done {
  color: var(--color-plasma);
  opacity: 1;
}

.lesson-info {
  flex: 1;
}

.lesson-info h3 {
  font-family: var(--font-family-sans);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-charcoal);
  margin-bottom: 0.15rem;
}

.lesson-info p {
  font-size: 0.78rem;
  color: var(--color-subtext);
}

.lesson-arrow {
  color: var(--color-subtext);
  opacity: 0.3;
  transition: all 0.2s;
}

.lesson-card:hover .lesson-arrow {
  opacity: 1;
  color: var(--color-plasma);
}
</style>
