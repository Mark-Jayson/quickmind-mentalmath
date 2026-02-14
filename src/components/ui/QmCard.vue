<template>
  <div :class="['qm-card', `qm-card--${variant}`, { 'qm-card--hoverable': hoverable }]">
    <div v-if="$slots.header" class="qm-card-header">
      <slot name="header" />
      <hr class="plasma-line" />
    </div>
    <div class="qm-card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="qm-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'light' },
  hoverable: { type: Boolean, default: false },
})
</script>

<style scoped>
.qm-card {
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.qm-card--light {
  background: var(--color-workshop);
  color: var(--color-charcoal);
}

.qm-card--dark {
  background: var(--color-void);
  color: var(--color-workshop);
}

.qm-card--hoverable:hover {
  border-color: rgba(107, 191, 142, 0.4);
  box-shadow: var(--shadow-elevation-2);
  transform: translateY(-2px);
}

.qm-card-header {
  padding: 1.25rem 1.5rem 0;
}

.qm-card-body {
  padding: 1.25rem 1.5rem;
}

.qm-card-footer {
  padding: 0 1.5rem 1.25rem;
  border-top: 1px solid var(--color-border-light);
  padding-top: 1rem;
}
</style>
