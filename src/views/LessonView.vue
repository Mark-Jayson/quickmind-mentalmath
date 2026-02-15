<template>
  <div class="lesson-page">
    <header class="lesson-header">
      <router-link to="/curriculum" class="back-link">
        <component :is="ArrowLeft" :size="16" />
        Back to Curriculum
      </router-link>
      <p class="lesson-tag">LESSON</p>
      <h1>{{ lessonData.title }}</h1>
      <p class="lesson-desc">{{ lessonData.description }}</p>
      <hr class="plasma-line" />
    </header>

    <!-- Lesson Steps -->
    <div class="lesson-content">
      <div class="steps-nav">
        <button
          v-for="(step, i) in lessonData.steps"
          :key="i"
          :class="['step-tab', { 'step-tab--active': currentStep === i, 'step-tab--done': currentStep > i }]"
          @click="currentStep = i"
        >
          {{ i + 1 }}
        </button>
        <div class="step-progress" :style="{ width: `${((currentStep) / (lessonData.steps.length - 1)) * 100}%` }" />
      </div>

      <div class="step-content animate-fade-in" :key="currentStep">
        <h2>{{ lessonData.steps[currentStep].title }}</h2>
        <div v-html="lessonData.steps[currentStep].content" class="step-body" />

        <div v-if="lessonData.steps[currentStep].example" class="example-box">
          <div class="example-label">EXAMPLE</div>
          <div class="example-content" v-html="lessonData.steps[currentStep].example" />
        </div>
      </div>

      <div class="step-nav-buttons">
        <QmButton v-if="currentStep > 0" variant="ghost" @click="currentStep--">
          <component :is="ArrowLeft" :size="16" />
          Previous
        </QmButton>
        <div class="spacer" />
        <QmButton v-if="currentStep < lessonData.steps.length - 1" variant="primary" @click="currentStep++">
          Next
          <component :is="ArrowRight" :size="16" />
        </QmButton>
        <QmButton v-else variant="primary" @click="completeLesson">
          Complete Lesson
          <component :is="Check" :size="16" />
        </QmButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next'
import QmButton from '@/components/ui/QmButton.vue'

const route = useRoute()
const router = useRouter()
const currentStep = ref(0)

const lessonsDB = {
  left_to_right_addition: {
    title: 'Left-to-Right Addition',
    description: 'Add numbers from left to right instead of right to left.',
    steps: [
      { title: 'Why Left to Right?', content: '<p>In school, you learned to add from <strong>right to left</strong> — ones, tens, hundreds. But mathemagicians add from <strong>left to right</strong>, processing the most significant digits first.</p><p>This is faster because you start saying the answer immediately, and most of the time the leading digits don\'t change.</p>', example: '<p><strong>358 + 247</strong></p><p>Start with hundreds: 300 + 200 = <strong>500</strong></p><p>Add tens: 50 + 40 = 90 → <strong>590</strong></p><p>Add ones: 8 + 7 = 15 → <strong>605</strong></p>' },
      { title: 'The Running Total', content: '<p>Keep a <strong>running total</strong> in your head. Start with the leftmost column and keep adding the next column\'s sum to your running total.</p><p>The key insight: you\'re always working with a single number in your head, modifying it step by step.</p>', example: '<p><strong>672 + 495</strong></p><p>600 + 400 = <strong>1000</strong></p><p>70 + 90 = 160 → <strong>1160</strong></p><p>2 + 5 = 7 → <strong>1167</strong></p>' },
      { title: 'Handling Carries', content: '<p>What if adding a column causes the previous digit to change? This is called a <strong>carry</strong>.</p><p>When the sum of a column is 10 or more, you bump up the digit to the left by 1. With practice, you\'ll anticipate carries before they happen.</p>', example: '<p><strong>867 + 586</strong></p><p>800 + 500 = <strong>1300</strong></p><p>60 + 80 = 140 → <strong>1440</strong></p><p>7 + 6 = 13 → <strong>1453</strong></p>' },
    ],
  },
  complement_addition: {
    title: 'Complements & Carries',
    description: 'Use complements of 10 to simplify mental carries.',
    steps: [
      { title: 'What is a Complement?', content: '<p>The <strong>complement</strong> of a digit is what you add to get 10. Knowing complements instantly helps you handle carries more efficiently.</p>', example: '<p>Complements: 1↔9, 2↔8, 3↔7, 4↔6, 5↔5</p>' },
      { title: 'Using Complements', content: '<p>When a column sums to 10+, instead of carrying, think: "the ones digit is the complement\'s complement." This becomes instant with practice.</p>', example: '<p><strong>8 + 7 = 15</strong> — Complement of 7 = 3, so ones digit = 5, carry 1</p>' },
    ],
  },
  '2by1_multiplication': {
    title: '2-Digit × 1-Digit',
    description: 'Break apart the 2-digit number and multiply left-to-right.',
    steps: [
      { title: 'The Distributive Method', content: '<p>To multiply a 2-digit number by a 1-digit number, <strong>break the 2-digit number</strong> into tens and ones, multiply each part, and add.</p>', example: '<p><strong>47 × 8</strong></p><p>= (40 × 8) + (7 × 8) = 320 + 56 = <strong>376</strong></p>' },
      { title: 'Practice Approach', content: '<p>Say the first partial product, then add the second. Always multiply the <strong>tens digit first</strong>.</p>', example: '<p><strong>63 × 7</strong></p><p>60 × 7 = 420, 3 × 7 = 21, 420 + 21 = <strong>441</strong></p>' },
    ],
  },
  '3by1_multiplication': {
    title: '3-Digit × 1-Digit',
    description: 'Extend left-to-right multiplication to 3-digit numbers.',
    steps: [
      { title: 'Extending the Method', content: '<p>Same logic as 2×1 but with one more step. Break the 3-digit number into hundreds, tens, and ones.</p>', example: '<p><strong>632 × 7</strong></p><p>= 4200 + 210 + 14 = <strong>4424</strong></p>' },
    ],
  },
  squaring_numbers: {
    title: 'Squaring Numbers',
    description: 'Master the art of squaring any 2-digit number using the "Difference of Squares" magic.',
    steps: [
      { 
        title: 'The Magic Formula', 
        content: '<p>Squaring a number like 47² in your head seems hard, right? But 50 × 44 is much easier!</p><p>We use a simple algebraic trick: <strong>a² = (a + d)(a − d) + d²</strong>.</p><p>In plain English: Go up and down by the same distance (d) to reach a friendly round number, multiply those, and add the square of the distance.</p>', 
        example: '<p><strong>To find 12²:</strong></p><p>Go down 2 to reach <strong>10</strong>.</p><p>Go up 2 to reach <strong>14</strong>.</p><p>10 × 14 = 140.</p><p>Add 2² (4) → <strong>144</strong>.</p>' 
      },
      { 
        title: 'Strategy: Finding "d"', 
        content: '<p>The goal is to make the multiplication easy. Always choose a distance <strong>d</strong> that turns your number into a multiple of 10.</p><ul><li>If the number ends in 1-4, go <strong>down</strong> to the nearest 10.</li><li>If it ends in 6-9, go <strong>up</strong> to the nearest 10.</li></ul>', 
        example: '<p><strong>47²</strong>: Nearest ten is 50 (+3). So <strong>d = 3</strong>.</p><p><strong>32²</strong>: Nearest ten is 30 (-2). So <strong>d = 2</strong>.</p>' 
      },
      { 
        title: 'Walkthrough: 87²', 
        content: '<ol><li><strong>Nearest 10:</strong> 87 is close to 90. The distance <strong>d is 3</strong>.</li><li><strong>Up & Down:</strong><br>Up 3 → 90<br>Down 3 → 84</li><li><strong>Multiply:</strong> 90 × 84. Think "9 × 84" then add a 0.<br>(9×80=720) + (9×4=36) = 756 → <strong>7560</strong>.</li><li><strong>Add d²:</strong> 7560 + 3² (9) = <strong>7569</strong>.</li></ol>', 
        example: '<p><strong>298²</strong> (Near 300, d=2)</p><p>300 × 296 = 88,800</p><p>88,800 + 4 = <strong>88,804</strong></p>' 
      },
      { 
        title: 'Bonus: Squaring Numbers Ending in 5', 
        content: '<p>Numbers ending in 5 have their own super-fast trick!</p><ol><li>Take the first digit(s) <strong>N</strong>.</li><li>Multiply N by the next integer <strong>(N + 1)</strong>.</li><li>Append <strong>25</strong> to the end.</li></ol>', 
        example: '<p><strong>35²</strong>:</p><p>Start with 3. Next number is 4.</p><p>3 × 4 = <strong>12</strong>.</p><p>Attach 25 → <strong>1225</strong>.</p><hr><p><strong>65²</strong>: 6 × 7 = 42 → <strong>4225</strong>.</p>' 
      },
    ],
  },
  '2by2_criss_cross': {
    title: '2-Digit × 2-Digit (Criss-Cross)',
    description: 'The showpiece criss-cross method for multiplying any two 2-digit numbers.',
    steps: [
      { title: 'The Criss-Cross Method', content: '<p>For <strong>AB × CD</strong>:</p><ol><li><strong>Hundreds:</strong> A × C</li><li><strong>Cross:</strong> (A × D) + (B × C)</li><li><strong>Ones:</strong> B × D</li></ol><p>Combine them left-to-right, carrying as needed.</p>', example: '<p><strong>46 × 73</strong></p><p>28 → 2800, Cross: 54 → +540 = 3340, Ones: 18 → <strong>3358</strong></p>' },
    ],
  },
  phonetic_code: {
    title: 'The Phonetic Code',
    description: 'Convert numbers to consonant sounds to create memorable words.',
    steps: [
      { title: 'The Number-Sound Map', content: '<p>Each digit maps to consonant sounds: 0=S/Z, 1=T/D, 2=N, 3=M, 4=R, 5=L, 6=CH/SH/J, 7=K/G, 8=F/V, 9=P/B</p>', example: '<p><strong>87 = FoG</strong>, <strong>32 = MoN</strong></p>' },
    ],
  },
  mental_workspace: {
    title: 'Mental Workspace Management',
    description: 'Strategies for holding intermediate values during calculations.',
    steps: [
      { title: 'Chunking Strategy', content: '<p>Your working memory can hold about 4 chunks. Instead of remembering individual digits, remember <strong>partial products</strong> as complete numbers.</p>', example: '<p><strong>46 × 73</strong>: Hold "2800 → 3340 → 3358" not "4, 6, 7, 3, 28, 42, 12..."</p>' },
    ],
  },
  multiples_11: {
    title: 'Multiply by 11',
    description: 'Quickly multiply 2-digit numbers by 11 using the "Sandwich" method.',
    steps: [
      { title: 'The Sandwich Method', content: '<p>To multiply any 2-digit number by 11, simply <strong>add the two digits together</strong> and place the sum in the middle.</p><p>Think of it as pulling the two digits apart and sandwiching their sum between them.</p>', example: '<p><strong>35 × 11</strong></p><p>3 + 5 = 8</p><p>Result: <strong>385</strong></p>' },
      { title: 'Handling Carries', content: '<p>What if the sum is greater than 9? You simply <strong>carry the 1</strong> over to the left digit.</p><p>The right digit stays the same, the middle digit is the ones place of the sum, and the left digit increases by one.</p>', example: '<p><strong>85 × 11</strong></p><p>8 + 5 = 13 (Carry the 1)</p><p>8 + 1 = 9</p><p>Result: <strong>935</strong></p>' },
    ],
  },
  day_of_week: {
    title: 'Day of the Week',
    description: 'Determine the day of the week for any date using the Doomsday Algorithm.',
    steps: [
      { title: 'The Doomsday Concept', content: '<p>Every year has a specific day of the week called its <strong>Doomsday</strong>. Easy-to-remember dates (like 4/4, 6/6, 8/8, 10/10, 12/12) always fall on this same day.</p><p>Once you know the year\'s Doomsday, you can find any other date relative to it.</p>', example: '<p><strong>2026 Doomsday: Saturday</strong></p><p>Since 4/4 is a Doomsday, April 4, 2026 is a Saturday.</p>' },
      { title: 'Memorizing the Anchors', content: '<p>Memorize these date anchors that always fall on the Doomsday:</p><ul><li><strong>Even Months:</strong> 4/4, 6/6, 8/8, 10/10, 12/12</li><li><strong>"Work 9 to 5"</strong>: 5/9 and 9/5</li><li><strong>"7-11 Store"</strong>: 7/11 and 11/7</li><li><strong>Leap Years:</strong> Jan 4, Feb 29 (otherwise Jan 3, Feb 28)</li><li><strong>"Valentine\'s"</strong>: Feb 14 (or last day of Feb)</li></ul>', example: '<p>If Doomsday is Saturday:</p><p>August 8 (8/8) is Saturday.</p><p>December 12 (12/12) is Saturday.</p><p>July 11 (7/11) is Saturday.</p>' },
      { title: 'Finding the Day', content: '<p>To find the day for any date:</p><ol><li>Find the closest anchor date.</li><li>Calculate the difference in days.</li><li>Add (or subtract) that difference to the Doomsday.</li></ol>', example: '<p><strong>Find July 4, 2026 (Doomsday = Saturday)</strong></p><p>Closest anchor: <strong>July 11 (7/11)</strong> is a Saturday.</p><p>Difference: 4 is <strong>7 days before</strong> 11.</p><p>Saturday minus 7 days = <strong>Saturday</strong>.</p>' },
      { title: 'Century Codes', content: '<p>For other years, calculate the Doomsday:</p><p><strong>Century Code + Year + (Year/4)</strong></p><p>Codes: 1900s=Wednesday, 2000s=Tuesday, 2100s=Sunday</p>', example: '<p><strong>Doomsday 2026?</strong></p><p>Base: Tuesday (2000s)</p><p>Year: 26</p><p>Leap Years: 26/4 = 6</p><p>Sum: Tue + 26 + 6 = Tue + 32</p><p>32 mod 7 = 4</p><p>Tuesday + 4 days = <strong>Saturday</strong></p>' },
    ],
  },
}

const lessonData = computed(() => {
  return lessonsDB[route.params.id] || {
    title: 'Lesson Not Found',
    description: 'This lesson does not exist.',
    steps: [{ title: 'Not Found', content: '<p>Please go back to the curriculum.</p>' }],
  }
})

function completeLesson() {
  router.push('/curriculum')
}
</script>

<style scoped>
.lesson-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-subtext);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
  transition: color 0.2s;
}

.back-link:hover { color: var(--color-plasma); }

.lesson-header { margin-bottom: 2rem; }

.lesson-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.5rem;
}

.lesson-header h1 { font-size: 1.75rem; margin-bottom: 0.4rem; }
.lesson-desc { color: var(--color-subtext); font-size: 0.9rem; }

.steps-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border-light);
}

.step-tab {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-workshop-alt);
  border: 1px solid var(--color-border-light);
  border-radius: 50%;
  color: var(--color-subtext);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
}

.step-tab--active {
  background: var(--color-plasma);
  color: white;
  border-color: var(--color-plasma);
}

.step-tab--done {
  border-color: var(--color-success);
  color: var(--color-success);
}

.step-progress {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  background: var(--color-plasma);
  transition: width 0.3s ease;
}

.step-content { margin-bottom: 2rem; }

.step-content h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.step-body {
  font-size: 0.92rem;
  color: var(--color-subtext);
  line-height: 1.8;
}

.step-body :deep(p) { margin-bottom: 0.8rem; }
.step-body :deep(strong) { color: var(--color-charcoal); }
.step-body :deep(ol), .step-body :deep(ul) { padding-left: 1.5rem; margin-bottom: 0.8rem; }

.example-box {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: var(--color-plasma-soft);
  border: 1px solid rgba(107, 191, 142, 0.25);
  border-left: 3px solid var(--color-plasma);
  border-radius: 8px;
}

.example-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-plasma);
  margin-bottom: 0.65rem;
}

.example-content {
  font-size: 0.88rem;
  line-height: 1.8;
  color: var(--color-charcoal);
}

.example-content :deep(p) { margin-bottom: 0.4rem; }
.example-content :deep(strong) { color: var(--color-plasma-dim); }

.step-nav-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spacer { flex: 1; }
</style>
