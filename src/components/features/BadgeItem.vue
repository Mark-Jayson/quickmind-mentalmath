<template>
  <div :class="['badge-item', `badge--${category}`, { 'badge--stacked': count > 1 }]">
    <div class="badge-icon-wrapper">
      <component :is="iconComponent" :size="20" class="badge-icon" />
      <div v-if="count > 1" class="badge-count">x{{ count }}</div>
    </div>
    <div class="badge-tooltip">
      <div class="tooltip-name">{{ name }}</div>
      <div class="tooltip-desc">{{ description }}</div>
      <div v-if="xp" class="tooltip-xp">+{{ xp }} XP</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  name: String,
  description: String,
  icon: String, // Icon name from Lucide
  category: String, // lesson, mathlympics, milestone
  count: { type: Number, default: 1 },
  xp: Number
})

const iconComponent = computed(() => {
  return LucideIcons[props.icon] || LucideIcons.Award
})
</script>

<style scoped>
.badge-item {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-background);
  border: 2px solid var(--color-border-light);
  cursor: help;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.badge-item:hover {
  transform: scale(1.1) translateY(-5px);
  border-color: var(--color-plasma);
  box-shadow: 0 10px 20px -10px rgba(107, 191, 142, 0.3);
  z-index: 10;
}

.badge-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-icon {
  color: var(--color-subtext);
  transition: color 0.3s;
}

.badge-item:hover .badge-icon {
  color: var(--color-plasma);
}

.badge-count {
  position: absolute;
  top: -12px;
  right: -12px;
  background: var(--color-plasma);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  border: 2px solid var(--color-background);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Category Styles */
.badge--lesson { border-color: rgba(56, 189, 248, 0.2); }
.badge--lesson:hover { border-color: #38bdf8; }
.badge--lesson .badge-icon { color: #38bdf8; }

.badge--mathlympics { border-color: rgba(245, 158, 11, 0.2); }
.badge--mathlympics:hover { border-color: #f59e0b; }
.badge--mathlympics .badge-icon { color: #f59e0b; }

.badge--milestone { border-color: rgba(139, 92, 246, 0.2); }
.badge--milestone:hover { border-color: #8b5cf6; }
.badge--milestone .badge-icon { color: #8b5cf6; }

/* Special Medals */
.badge-item[class*="medal"] {
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
}

/* Tooltip */
.badge-tooltip {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  width: 180px;
  padding: 0.75rem;
  background: var(--color-charcoal);
  color: white;
  border-radius: 8px;
  font-size: 0.75rem;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 20;
  text-align: center;
  box-shadow: var(--shadow-elevation-3);
}

.badge-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-charcoal);
}

.badge-item:hover .badge-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.tooltip-name {
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-plasma);
}

.tooltip-desc {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin-bottom: 0.4rem;
}

.tooltip-xp {
  font-weight: 800;
  color: #fbbf24;
  font-size: 0.65rem;
}
</style>
