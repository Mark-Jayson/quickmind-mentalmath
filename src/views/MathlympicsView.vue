<template>
  <div class="mathlympics">
    <!-- IDLE / CONFIG STATE -->
    <div v-if="store.state === 'idle' || store.state === 'configuring'" class="config-page">
      <header class="config-header">
        <p class="config-tag">MATHLYMPICS</p>
        <h1>Ready to compete?</h1>
        <p class="config-subtitle">Select your category and set size, then hit start.</p>
        <hr class="plasma-line" />
      </header>

      <div class="config-grid">
        <div class="config-section">
          <h3 class="config-label">Category</h3>
          <div class="option-grid">
            <button
              v-for="cat in categoryOptions"
              :key="cat.id"
              :class="['option-card', { 'option-card--active': selectedCategory === cat.id }]"
              @click="selectedCategory = cat.id"
            >
              <span class="option-example">{{ cat.example }}</span>
              <span class="option-title">{{ cat.title }}</span>
              <span class="option-tag">{{ cat.tag }}</span>
            </button>
          </div>
        </div>

        <div class="config-section">
          <h3 class="config-label">Questions</h3>
          <div class="size-options">
            <button
              v-for="size in availableSizes"
              :key="size"
              :class="['size-btn', { 'size-btn--active': selectedSize === size }]"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>
      </div>

      <div class="config-start">
        <QmButton variant="primary" size="lg" @click="startGame">
          <component :is="Play" :size="18" />
          Start Challenge
        </QmButton>
      </div>
    </div>

    <!-- PLAYING STATE -->
    <div v-else-if="store.state === 'playing'" class="game-page">
      <div class="game-hud">
        <div class="hud-left">
          <span class="hud-category">{{ categoryLabel }}</span>
          <span class="hud-progress">{{ store.currentIndex + 1 }} / {{ store.questions.length }}</span>
        </div>
        <QmTimer :elapsed="timer.elapsed.value" :display="timer.formatted.value" />
        <button class="hud-quit" @click="quitGame">
          <component :is="X" :size="18" />
        </button>
      </div>

      <div class="game-progress-bar">
        <div class="game-progress-fill" :style="{ width: `${store.progress * 100}%` }" />
      </div>

      <div class="game-arena">
        <div class="question-container animate-fade-in" :key="store.currentIndex">
          <div class="question-number">#{{ store.currentIndex + 1 }}</div>
          <div class="question-display">{{ store.currentQuestion?.display }}</div>
        </div>

        <div v-if="selectedCategory === 'day_of_week'" class="day-options">
          <QmButton
            v-for="day in ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']"
            :key="day"
            variant="outline"
            class="day-btn"
            @click="submitAnswer(day)"
          >
            {{ day.slice(0, 3) }}
          </QmButton>
        </div>

        <form v-else @submit.prevent="() => submitAnswer()" class="answer-form">
          <input
            ref="answerInput"
            v-model="currentAnswer"
            type="number"
            class="answer-input"
            placeholder="?"
            autofocus
            @keydown.enter="() => submitAnswer()"
          />
          <QmButton type="submit" variant="primary" size="lg">
            <component :is="ArrowRight" :size="18" />
          </QmButton>
        </form>
      </div>
    </div>

    <!-- REVIEWING STATE -->
    <div v-else-if="store.state === 'reviewing'" class="review-page">
      <!-- ... existing review content ... -->
      <header class="review-header">
        <p class="review-tag">RESULTS</p>
        <h1 class="review-score">
          <span class="score-number">{{ store.score }}</span>
          <span class="score-slash">/</span>
          <span class="score-total">{{ store.questions.length }}</span>
        </h1>
        <div class="review-stats">
          <div class="review-stat">
            <span class="stat-label">Accuracy</span>
            <span class="stat-value" :class="{ 'stat-value--good': store.accuracy >= 0.8 }">{{ (store.accuracy * 100).toFixed(0) }}%</span>
          </div>
          <div class="review-stat">
            <span class="stat-label">Total Time</span>
            <span class="stat-value">{{ formatTime(store.totalTimeMs) }}</span>
          </div>
          <div class="review-stat">
            <span class="stat-label">Avg / Question</span>
            <span class="stat-value">{{ (store.avgTimeMs / 1000).toFixed(1) }}s</span>
          </div>
        </div>
        <hr class="plasma-line-center" />
      </header>

      <div class="results-list">
        <div
          v-for="(result, i) in store.results"
          :key="i"
          :class="['result-row', { 'result-row--correct': result.isCorrect, 'result-row--wrong': !result.isCorrect }]"
        >
          <span class="result-num">{{ i + 1 }}</span>
          <span class="result-question">{{ result.question }}</span>
          <span class="result-answer">
            <template v-if="result.isCorrect">
              <component :is="CheckCircle" :size="16" class="icon-correct" />
              {{ result.correctAnswer }}
            </template>
            <template v-else>
              <component :is="XCircle" :size="16" class="icon-wrong" />
              <span class="wrong-answer">{{ result.userAnswer }}</span>
              <span class="correct-answer">→ {{ result.correctAnswer }}</span>
            </template>
          </span>
          <span class="result-time">{{ (result.timeMs / 1000).toFixed(1) }}s</span>
        </div>
      </div>

      <div class="review-actions">
        <QmButton variant="primary" @click="playAgain">
          <component :is="RotateCcw" :size="16" />
          Play Again
        </QmButton>
        <QmButton variant="ghost" @click="backToConfig">
          Change Settings
        </QmButton>
      </div>

      <!-- Badge Overlay -->
      <BadgeAwardOverlay 
        v-if="showBadgeOverlay && newBadges.length > 0" 
        :badge="newBadges[currentBadgeIndex]" 
        :key="currentBadgeIndex"
        @close="closeOverlay" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onUnmounted, watch, computed } from 'vue'
import { useMathlympicsStore } from '@/stores/mathlympics'
import { useTimer } from '@/composables/useTimer'
import QmButton from '@/components/ui/QmButton.vue'
import QmTimer from '@/components/ui/QmTimer.vue'
import BadgeAwardOverlay from '@/components/features/BadgeAwardOverlay.vue'
import { Play, ArrowRight, X, CheckCircle, XCircle, RotateCcw } from 'lucide-vue-next'

const store = useMathlympicsStore()
const timer = useTimer()

const selectedCategory = ref('2x2')
const selectedSize = ref(10)
const currentAnswer = ref('')
const answerInput = ref(null)
const newBadges = ref([])
const showBadgeOverlay = ref(false)
const currentBadgeIndex = ref(0)

const categoryOptions = [
  { id: '2x1', title: '2 × 1 Digit', example: '47 × 8', tag: 'Beginner' },
  { id: '3x1', title: '3 × 1 Digit', example: '632 × 7', tag: 'Intermediate' },
  { id: '2x2', title: '2 × 2 Digit', example: '46 × 73', tag: 'Advanced' },
  { id: 'squaring', title: 'Squaring', example: '67²', tag: 'Specialist' },
  { id: 'multiples_11', title: 'Multiples of 11', example: '43 × 11', tag: 'Trick' },
  { id: 'day_of_week', title: 'Day of Week', example: 'Jan 1', tag: 'Calendar' },
]

const categoryLabels = { 
  '2x1': '2×1', 
  '3x1': '3×1', 
  '2x2': '2×2', 
  'squaring': 'Squaring',
  'multiples_11': '×11',
  'day_of_week': 'Calendar'
}
const categoryLabel = ref('')

const availableSizes = computed(() => {
  if (selectedCategory.value === 'multiples_11') return [20, 40]
  return [10, 20, 40]
})

// Watch for category change to reset invalid size
watch(selectedCategory, (newCat) => {
  if (newCat === 'multiples_11' && selectedSize.value === 10) {
    selectedSize.value = 20
  }
})

function startGame() {
  store.configure(selectedCategory.value, selectedSize.value)
  store.startGame()
  categoryLabel.value = categoryLabels[selectedCategory.value]
  timer.reset()
  timer.start()
  nextTick(() => answerInput.value?.focus())
}

function submitAnswer(val) {
  let answerToSubmit = val
  
  if (answerToSubmit === undefined) {
    // Input submission
    if (currentAnswer.value === '') return
    answerToSubmit = parseInt(currentAnswer.value, 10)
  }

  store.submitAnswer(answerToSubmit)
  currentAnswer.value = ''
  
  if (store.currentIndex >= store.questions.length) {
    timer.stop()
    handleSessionEnd()
  } else {
    // Only focus input if it exists (not for button mode)
    nextTick(() => {
       if (selectedCategory.value !== 'day_of_week') {
         answerInput.value?.focus()
       }
    })
  }
}

async function handleSessionEnd() {
  const result = await store.submitSession()
  if (result.new_badges && result.new_badges.length > 0) {
    newBadges.value = result.new_badges
    currentBadgeIndex.value = 0
    showBadgeOverlay.value = true
  }
}

function closeOverlay() {
  if (currentBadgeIndex.value < newBadges.value.length - 1) {
    // Show the next badge
    currentBadgeIndex.value++
  } else {
    // All badges shown, close overlay
    showBadgeOverlay.value = false
  }
}

function quitGame() { timer.stop(); store.reset() }
function playAgain() { store.startGame(); timer.reset(); timer.start(); nextTick(() => answerInput.value?.focus()) }
function backToConfig() { store.reset() }

function formatTime(ms) {
  const secs = Math.floor(ms / 1000)
  const mins = Math.floor(secs / 60)
  const rem = secs % 60
  return mins > 0 ? `${mins}m ${rem}s` : `${secs}s`
}

onUnmounted(() => { timer.stop() })
</script>

<style scoped>
/* Config Page */
.config-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.config-header { margin-bottom: 2.5rem; }

.config-tag, .review-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.5rem;
}

.config-header h1 { font-size: 2rem; margin-bottom: 0.4rem; }
.config-subtitle { color: var(--color-subtext); font-size: 0.95rem; }

.config-grid { margin-bottom: 2.5rem; }
.config-section { margin-bottom: 2rem; }

.config-label {
  font-family: var(--font-family-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-subtext);
  margin-bottom: 0.85rem;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.75rem;
}

.option-card {
  padding: 1.25rem;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.option-card:hover { border-color: rgba(107, 191, 142, 0.4); }

.option-card--active {
  border-color: var(--color-plasma);
  background: var(--color-plasma-soft);
}

.option-example {
  font-family: var(--font-family-serif);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-plasma-dim);
}

.option-title { font-size: 0.82rem; font-weight: 600; color: var(--color-charcoal); }

.option-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-subtext);
}

.size-options { display: flex; gap: 0.75rem; }

.size-btn {
  padding: 0.7rem 1.5rem;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  color: var(--color-charcoal);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-family-sans);
}

.size-btn:hover { border-color: rgba(107, 191, 142, 0.4); }

.size-btn--active {
  border-color: var(--color-plasma);
  background: var(--color-plasma-soft);
  color: var(--color-plasma-dim);
}

.config-start { text-align: center; }

/* Game Page */
.game-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-workshop-alt);
  padding-top: 0;
  margin-top: -64px;
}

.game-hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border-light);
}

.hud-left { display: flex; flex-direction: column; gap: 0.15rem; }

.hud-category {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-plasma);
}

.hud-progress {
  font-size: 0.82rem;
  color: var(--color-subtext);
  font-variant-numeric: tabular-nums;
}

.hud-quit {
  background: none;
  border: none;
  color: var(--color-subtext);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.hud-quit:hover { color: var(--color-error); }

.game-progress-bar { height: 3px; background: var(--color-border-light); }
.game-progress-fill { height: 100%; background: var(--color-plasma); transition: width 0.3s ease; }

.game-arena {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 2rem;
}

.question-container { text-align: center; }

.question-number {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-subtext);
  margin-bottom: 0.75rem;
}

.question-display {
  font-family: var(--font-family-serif);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  color: var(--color-charcoal);
}

.answer-form { display: flex; align-items: center; gap: 0.75rem; }

.answer-input {
  width: 200px;
  padding: 0.85rem 1.25rem;
  background: var(--color-workshop);
  border: 2px solid var(--color-border-light);
  border-radius: 10px;
  color: var(--color-charcoal);
  font-family: var(--font-family-sans);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
  -moz-appearance: textfield;
  -webkit-appearance: none;
  appearance: none;
}

.answer-input::-webkit-outer-spin-button,
.answer-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.answer-input:focus {
  border-color: var(--color-plasma);
  box-shadow: 0 0 0 3px rgba(107, 191, 142, 0.15);
}

/* Review Page */
.review-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.review-header { text-align: center; margin-bottom: 2.5rem; }

.review-score { font-size: 4rem; margin: 1rem 0; }
.score-number { color: var(--color-plasma-dim); font-weight: 900; }
.score-slash { color: var(--color-subtext); font-weight: 300; margin: 0 0.15em; }
.score-total { color: var(--color-subtext); font-weight: 400; }

.review-stats { display: flex; justify-content: center; gap: 2.5rem; margin-bottom: 1.5rem; }

.review-stat { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }

.stat-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-subtext);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-charcoal);
  font-variant-numeric: tabular-nums;
}

.stat-value--good { color: var(--color-success); }

.results-list { margin-bottom: 2rem; }

.result-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 0.88rem;
}

.result-num { width: 28px; font-size: 0.75rem; font-weight: 600; color: var(--color-subtext); font-variant-numeric: tabular-nums; }
.result-question { flex: 1; font-weight: 600; font-variant-numeric: tabular-nums; }
.result-answer { display: flex; align-items: center; gap: 0.4rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.icon-correct { color: var(--color-success); }
.icon-wrong { color: var(--color-error); }
.wrong-answer { color: var(--color-error); text-decoration: line-through; }
.correct-answer { color: var(--color-success); }
.result-time { width: 50px; text-align: right; font-size: 0.78rem; color: var(--color-subtext); font-variant-numeric: tabular-nums; }

.review-actions { display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }

@media (max-width: 768px) {
  .question-display { font-size: 3rem; }
  .review-stats { gap: 1.5rem; }
}

.day-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  max-width: 600px;
}
.day-btn {
  min-width: 60px;
  font-weight: 700;
}
</style>
