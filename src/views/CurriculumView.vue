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
import { ref } from 'vue'
import { Plus, Grid3X3, Brain, CheckCircle, Circle, ChevronRight } from 'lucide-vue-next'

const categories = ref([
  {
    key: 'addition',
    label: 'Addition Techniques',
    icon: Plus,
    items: [
      { id: 'left_to_right_addition', title: 'Left-to-Right Addition', description: 'Add numbers from left to right instead of right to left.', completed: false },
      { id: 'complement_addition', title: 'Complements & Carries', description: 'Use complements of 10 to simplify mental carries.', completed: false },
    ],
  },
  {
    key: 'multiplication',
    label: 'Multiplication Techniques',
    icon: Grid3X3,
    items: [
      { id: '2by1_multiplication', title: '2-Digit × 1-Digit', description: 'Break apart the 2-digit number and multiply left-to-right.', completed: false },
      { id: '3by1_multiplication', title: '3-Digit × 1-Digit', description: 'Extend left-to-right multiplication to 3-digit numbers.', completed: false },
      { id: 'squaring_numbers', title: 'Squaring Numbers', description: 'Use the difference-of-squares identity to square any 2-digit number.', completed: false },
      { id: '2by2_criss_cross', title: '2 × 2 Criss-Cross', description: 'The showpiece criss-cross method for multiplying 2-digit numbers.', completed: false },
    ],
  },
  {
    key: 'memory',
    label: 'Memory & Strategy',
    icon: Brain,
    items: [
      { id: 'phonetic_code', title: 'The Phonetic Code', description: 'Convert numbers to consonant sounds to create memorable words.', completed: false },
      { id: 'mental_workspace', title: 'Mental Workspace Management', description: 'Strategies for holding intermediate values during calculations.', completed: false },
    ],
  },
])
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
