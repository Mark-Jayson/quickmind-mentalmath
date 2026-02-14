<template>
  <div class="qm-timer" :class="{ 'qm-timer--warning': isWarning, 'qm-timer--large': large }">
    <svg v-if="ring" class="timer-ring" :viewBox="`0 0 ${ringSize} ${ringSize}`">
      <circle class="timer-ring-bg" :cx="ringSize / 2" :cy="ringSize / 2" :r="radius" fill="none" :stroke-width="ringStroke" />
      <circle class="timer-ring-progress" :cx="ringSize / 2" :cy="ringSize / 2" :r="radius" fill="none" :stroke-width="ringStroke" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" :class="{ 'timer-ring-progress--warning': isWarning }" />
    </svg>
    <span class="timer-text">{{ display }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  elapsed: { type: Number, default: 0 },
  display: { type: String, default: '00:00.00' },
  ring: { type: Boolean, default: false },
  large: { type: Boolean, default: false },
  maxTime: { type: Number, default: 60000 },
  warningThreshold: { type: Number, default: 0.8 },
})

const ringSize = 120
const ringStroke = 4
const radius = (ringSize - ringStroke) / 2
const circumference = 2 * Math.PI * radius

const progress = computed(() => Math.min(props.elapsed / props.maxTime, 1))
const dashOffset = computed(() => circumference * (1 - progress.value))
const isWarning = computed(() => progress.value >= props.warningThreshold)
</script>

<style scoped>
.qm-timer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.timer-text {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-charcoal);
  letter-spacing: 0.05em;
}

.qm-timer--large .timer-text {
  font-size: 2rem;
  font-weight: 700;
}

.qm-timer--warning .timer-text {
  color: var(--color-error);
}

.timer-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-ring-bg {
  stroke: rgba(107, 191, 142, 0.15);
}

.timer-ring-progress {
  stroke: var(--color-plasma);
  transition: stroke-dashoffset 0.1s linear;
  stroke-linecap: butt;
}

.timer-ring-progress--warning {
  stroke: var(--color-error);
  animation: glow 1s ease-in-out infinite;
}
</style>
