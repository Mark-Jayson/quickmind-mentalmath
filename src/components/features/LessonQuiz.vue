<template>
  <div class="lesson-quiz">
    <div v-if="state === 'intro'" class="quiz-intro animate-fade-in">
      <div class="quiz-icon">
        <component :is="Zap" :size="32" />
      </div>
      <h3>Mastery Quiz</h3>
      <p>Prove your mastery of this lesson. You must answer <strong>10 questions</strong> with <strong>100% accuracy</strong> to earn your badge.</p>
      <QmButton variant="primary" block @click="startQuiz">Start Quiz</QmButton>
    </div>

    <div v-else-if="state === 'playing'" class="quiz-playing animate-fade-in">
      <div class="quiz-header">
        <span class="step-count">Question {{ currentIndex + 1 }}/10</span>
        <div class="mini-progress-bar">
          <div class="bar-fill" :style="{ width: `${(currentIndex / 10) * 100}%` }" />
        </div>
      </div>

      <div class="quiz-question">
        <div class="question-display">{{ currentQuestion.display }}</div>
        <input
          ref="answerInput"
          v-model="userAnswer"
          type="text"
          class="quiz-input"
          placeholder="Type answer..."
          @keyup.enter="submit"
        />
      </div>

      <QmButton variant="primary" block :disabled="!userAnswer" @click="submit">
        Submit Answer
      </QmButton>
    </div>

    <div v-else-if="state === 'failed'" class="quiz-result failed animate-fade-in">
      <div class="result-icon">
        <component :is="XCircle" :size="48" />
      </div>
      <h3>Almost there!</h3>
      <p>You got {{ score }}/10 correct. You need 10/10 for completion. Practice makes perfect!</p>
      <QmButton variant="primary" block @click="startQuiz">Try Again</QmButton>
    </div>

    <div v-else-if="state === 'passed'" class="quiz-result passed animate-fade-in">
      <div class="result-icon">
        <component :is="CheckCircle" :size="48" />
      </div>
      <h3>Mastery Certified!</h3>
      <p>Perfect score! You've successfully completed this lesson and earned 50 XP.</p>
      <QmButton variant="primary" block @click="$emit('complete', score)">Finish Lesson</QmButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useQuestionGenerator } from '@/composables/useQuestionGenerator'
import { Zap, CheckCircle, XCircle } from 'lucide-vue-next'
import QmButton from '@/components/ui/QmButton.vue'

const props = defineProps({
  lessonId: { type: String, required: true },
  category: { type: String, default: 'addition' }
})

const emit = defineEmits(['complete'])

const { generate } = useQuestionGenerator()
const state = ref('intro') // intro, playing, failed, passed
const questions = ref([])
const currentIndex = ref(0)
const userAnswer = ref('')
const score = ref(0)
const answerInput = ref(null)

const currentQuestion = computed(() => questions.value[currentIndex.value])

function startQuiz() {
  // Map lesson IDs to generator categories
  const catMap = {
    'left_to_right_addition': 'addition',
    'complement_addition': 'addition',
    '2by1_multiplication': '2x1',
    '3by1_multiplication': '3x1',
    'squaring_numbers': 'squaring',
    '2by2_criss_cross': '2x2',
    'phonetic_code': 'phonetic_code',
    'mental_workspace': '2x2', // Fallback for workspace drills
    'day_of_week': 'day_of_week',
    'multiples_11': 'multiples_11'
  }
  
  const genCat = catMap[props.lessonId] || props.category
  questions.value = generate(genCat, 10)
  currentIndex.value = 0
  score.value = 0
  userAnswer.value = ''
  state.value = 'playing'
  
  nextTick(() => {
    answerInput.value?.focus()
  })
}

function submit() {
  if (!userAnswer.value) return
  
  const isCorrect = userAnswer.value.toString().toLowerCase().trim() === currentQuestion.value.answer.toString().toLowerCase().trim()
  if (isCorrect) score.value++
  
  if (currentIndex.value < 9) {
    currentIndex.value++
    userAnswer.value = ''
    answerInput.value?.focus()
  } else {
    // End of quiz
    if (score.value === 10) {
      state.value = 'passed'
    } else {
      state.value = 'failed'
    }
  }
}
</script>

<style scoped>
.lesson-quiz {
  padding: 2.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  text-align: center;
  box-shadow: var(--shadow-elevation-2);
}

.quiz-icon {
  width: 64px;
  height: 64px;
  background: var(--color-plasma-soft);
  color: var(--color-plasma);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.quiz-intro h3, .quiz-result h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.quiz-intro p, .quiz-result p {
  color: var(--color-subtext);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.quiz-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.step-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-plasma);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.mini-progress-bar {
  height: 6px;
  background: var(--color-workshop-alt);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--color-plasma);
  transition: width 0.3s ease;
}

.quiz-question {
  margin-bottom: 2.5rem;
}

.question-display {
  font-family: var(--font-family-serif);
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-charcoal);
  margin-bottom: 2rem;
}

.quiz-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  text-align: center;
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  outline: none;
  transition: border-color 0.2s;
  font-family: var(--font-family-mono);
}

.quiz-input:focus {
  border-color: var(--color-plasma);
}

.result-icon {
  margin-bottom: 1.5rem;
}

.passed .result-icon { color: var(--color-success); }
.failed .result-icon { color: var(--color-error); }
</style>
