<template>
  <div class="qm-input-wrapper">
    <label v-if="label" :for="id" class="qm-input-label">{{ label }}</label>
    <div class="qm-input-container">
      <slot name="prefix" />
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['qm-input', { 'qm-input--error': error, 'qm-input--large': large }]"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
      />
      <slot name="suffix" />
    </div>
    <p v-if="error" class="qm-input-error">{{ error }}</p>
    <p v-else-if="hint" class="qm-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2, 9)}` },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  large: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.qm-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.qm-input-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-subtext);
}

.qm-input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.qm-input {
  width: 100%;
  padding: 0.7rem 1rem;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  color: var(--color-charcoal);
  font-family: var(--font-family-sans);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.qm-input::placeholder {
  color: var(--color-subtext);
  opacity: 0.6;
}

.qm-input:focus {
  border-color: var(--color-plasma);
  box-shadow: 0 0 0 3px rgba(107, 191, 142, 0.15);
}

.qm-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qm-input--error {
  border-color: var(--color-error);
}

.qm-input--error:focus {
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.15);
}

.qm-input--large {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  padding: 1rem;
  letter-spacing: 0.05em;
}

.qm-input-error {
  font-size: 0.75rem;
  color: var(--color-error);
}

.qm-input-hint {
  font-size: 0.75rem;
  color: var(--color-subtext);
}
</style>
