<template>
  <div :class="['qm-badge', `qm-badge--${variant}`, { 'qm-badge--earned': earned }]">
    <div class="badge-icon">
      <component :is="iconComponent" :size="size === 'lg' ? 24 : 16" />
    </div>
    <div v-if="showLabel" class="badge-info">
      <span class="badge-name">{{ name }}</span>
      <span v-if="description" class="badge-desc">{{ description }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

const props = defineProps({
  icon: { type: String, default: 'Award' },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  variant: { type: String, default: 'default' },
  earned: { type: Boolean, default: false },
  showLabel: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
})

const iconComponent = computed(() => icons[props.icon] || icons.Award)
</script>

<style scoped>
.qm-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.qm-badge:not(.qm-badge--earned) {
  opacity: 0.35;
  filter: grayscale(1);
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-subtext);
}

.qm-badge--earned .badge-icon {
  color: var(--color-plasma);
}

.qm-badge--gold .badge-icon {
  color: #D4A537;
}

.badge-name {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--color-charcoal);
}

.badge-desc {
  display: block;
  font-size: 0.68rem;
  color: var(--color-subtext);
  margin-top: 0.1rem;
}

.qm-badge--earned {
  border-color: rgba(107, 191, 142, 0.35);
  background: rgba(107, 191, 142, 0.05);
}
</style>
