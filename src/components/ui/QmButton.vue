<template>
  <button
    :class="['qm-btn', `qm-btn--${variant}`, `qm-btn--${size}`, { 'qm-btn--loading': loading, 'qm-btn--block': block }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="qm-btn-spinner" />
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})
</script>

<style scoped>
.qm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-family-sans);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;
  border-radius: 6px;
}

.qm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qm-btn--sm { padding: 0.4rem 0.85rem; font-size: 0.7rem; }
.qm-btn--md { padding: 0.65rem 1.5rem; font-size: 0.78rem; }
.qm-btn--lg { padding: 0.85rem 2rem; font-size: 0.85rem; }

.qm-btn--primary {
  background: var(--color-charcoal);
  color: white;
}
.qm-btn--primary:hover:not(:disabled) {
  background: #2d2d2d;
  box-shadow: var(--shadow-elevation-2);
}

.qm-btn--ghost {
  background: transparent;
  color: var(--color-charcoal);
  border: 1px solid var(--color-border-light);
}
.qm-btn--ghost:hover:not(:disabled) {
  border-color: var(--color-workshop-dark);
  background: rgba(107, 191, 142, 0.06);
}

.qm-btn--outline {
  background: transparent;
  color: var(--color-plasma);
  border: 1px solid var(--color-plasma);
}
.qm-btn--outline:hover:not(:disabled) {
  background: rgba(107, 191, 142, 0.08);
}

.qm-btn--danger {
  background: var(--color-error);
  color: white;
}
.qm-btn--danger:hover:not(:disabled) {
  background: #ef5555;
}

.qm-btn--block {
  width: 100%;
}

.qm-btn--loading {
  position: relative;
  color: transparent;
}

.qm-btn-spinner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
