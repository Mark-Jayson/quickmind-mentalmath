<!-- This is a sample comment. -->
<template>
  <transition name="overlay-fade" appear>
    <div class="quit-overlay" @click.self="$emit('continue')">
      <div class="quit-modal">
        <div class="quit-icon-wrap">
          <component :is="AlertTriangle" :size="32" class="quit-icon" />
        </div>
        <h2 class="quit-title">Quit this session?</h2>
        <p class="quit-desc">Your current progress will not be saved.</p>
        <div class="quit-actions">
          <button class="quit-btn quit-btn--danger" @click="$emit('quit')">
            <component :is="LogOut" :size="16" />
            Quit Session
          </button>
          <button class="quit-btn quit-btn--continue" @click="$emit('continue')">
            Continue
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { AlertTriangle, LogOut } from 'lucide-vue-next'

defineEmits(['quit', 'continue'])
</script>

<style scoped>
.quit-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
}

.quit-modal {
  background: var(--color-workshop, #fff);
  border: 1px solid var(--color-border-light, #e5e5e5);
  border-radius: 16px;
  padding: 2.5rem 2rem 2rem;
  max-width: 360px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: modal-pop 0.3s ease;
}

@keyframes modal-pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.quit-icon-wrap {
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: rgba(234, 88, 12, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.quit-icon {
  color: #ea580c;
}

.quit-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-charcoal, #1a1a1a);
  margin-bottom: 0.35rem;
}

.quit-desc {
  font-size: 0.82rem;
  color: var(--color-subtext, #777);
  margin-bottom: 1.5rem;
}

.quit-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.quit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quit-btn--danger {
  background: #ea580c;
  color: white;
}

.quit-btn--danger:hover {
  background: #c2410c;
}

.quit-btn--continue {
  background: transparent;
  border: 1px solid var(--color-border, #ddd);
  color: var(--color-charcoal, #1a1a1a);
}

.quit-btn--continue:hover {
  background: var(--color-workshop-alt, #f5f5f5);
}

/* Transition */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
