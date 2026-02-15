<template>
  <div class="badge-award-overlay animate-fade-in">
    <div class="award-card">
      <div class="confetti-origin" ref="confettiOrigin" />
      
      <div class="award-header">
        <div class="shine-effect" />
        <h2>Badge Unlocked!</h2>
      </div>

      <div class="badge-display">
        <BadgeItem v-if="badge" v-bind="badge" size="xl" />
      </div>

      <div class="award-details">
        <h3>{{ badge?.name }}</h3>
        <p>{{ badge?.description }}</p>
        <div class="xp-reward" v-if="badge?.xp_reward">
          +{{ badge.xp_reward }} XP
        </div>
      </div>

      <div class="timer-bar">
        <div class="timer-fill" :style="{ animationDuration: '6s' }" />
      </div>

      <p class="redirect-msg">Continuing in a moment...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'
import BadgeItem from '@/components/common/BadgeItem.vue'

const props = defineProps({
  badge: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const confettiOrigin = ref(null)
let timerId = null

function fireConfetti() {
  const count = 200
  const defaults = {
    origin: { y: 0.7 }
  }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

onMounted(() => {
  // Fire confetti
  setTimeout(fireConfetti, 300)

  // Auto close after 6 seconds
  timerId = setTimeout(() => {
    emit('close')
  }, 6000)
})

onUnmounted(() => {
  if (timerId) clearTimeout(timerId)
})
</script>

<style scoped>
.badge-award-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s ease-out;
}

.award-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 24px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.award-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-plasma);
  margin-bottom: 2rem;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-display {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  transform: scale(1.5);
}

.award-details h3 {
  font-size: 1.5rem;
  color: var(--color-charcoal);
  margin-bottom: 0.5rem;
}

.award-details p {
  color: var(--color-subtext);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.xp-reward {
  display: inline-block;
  background: var(--color-plasma-soft);
  color: var(--color-plasma-dim);
  font-weight: 800;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
}

.timer-bar {
  margin-top: 2.5rem;
  height: 4px;
  background: var(--color-border-light);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.timer-fill {
  height: 100%;
  background: var(--color-plasma);
  width: 100%;
  transform-origin: left;
  animation: countDown 6s linear forwards;
}

.redirect-msg {
  font-size: 0.75rem;
  color: var(--color-subtext);
  font-weight: 500;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes countDown { from { transform: scaleX(1); } to { transform: scaleX(0); } }
</style>
