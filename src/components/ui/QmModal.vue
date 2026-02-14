<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="qm-modal-overlay" @click.self="close">
        <div class="qm-modal" :class="`qm-modal--${size}`">
          <button v-if="closable" class="qm-modal-close" @click="close">
            <component :is="X" :size="20" />
          </button>
          <div v-if="$slots.header" class="qm-modal-header">
            <slot name="header" />
          </div>
          <div class="qm-modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="qm-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  closable: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  if (props.closable) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.qm-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 27, 35, 0.6);
  backdrop-filter: blur(8px);
  padding: 1rem;
}

.qm-modal {
  position: relative;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeInUp 0.3s ease-out;
  box-shadow: var(--shadow-elevation-4);
}

.qm-modal--sm { width: 100%; max-width: 400px; }
.qm-modal--md { width: 100%; max-width: 560px; }
.qm-modal--lg { width: 100%; max-width: 720px; }

.qm-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-subtext);
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
  z-index: 1;
}

.qm-modal-close:hover {
  color: var(--color-charcoal);
}

.qm-modal-header { padding: 1.5rem 1.5rem 0.5rem; }
.qm-modal-body { padding: 1.5rem; }
.qm-modal-footer { padding: 0.75rem 1.5rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
