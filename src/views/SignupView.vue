<template>
  <div class="auth-page">
    <div class="auth-card animate-fade-in-up">
      <div class="auth-header">
        <p class="auth-tag">CREATE ACCOUNT</p>
        <h1>Get Started</h1>
        <hr class="plasma-line" />
      </div>

      <div v-if="success" class="success-msg">
        <p>✓ Account created! Check your email to confirm, then <router-link to="/login" class="auth-link">sign in</router-link>.</p>
      </div>

      <form v-else @submit.prevent="handleSignup" class="auth-form">
        <QmInput
          id="signup-username"
          v-model="username"
          label="Username"
          placeholder="mathlympian"
          :error="usernameError"
        />
        <QmInput
          id="signup-email"
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :error="emailError"
        />
        <QmInput
          id="signup-password"
          v-model="password"
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          :error="passwordError"
        />

        <p v-if="serverError" class="server-error">{{ serverError }}</p>

        <QmButton type="submit" variant="primary" block :loading="loading">Create Account</QmButton>
      </form>

      <p class="auth-footer">
        Already have an account?
        <router-link to="/login" class="auth-link">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import QmInput from '@/components/ui/QmInput.vue'
import QmButton from '@/components/ui/QmButton.vue'

const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const serverError = ref('')
const loading = ref(false)
const success = ref(false)

async function handleSignup() {
  usernameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  serverError.value = ''

  if (!username.value) { usernameError.value = 'Username is required'; return }
  if (!email.value) { emailError.value = 'Email is required'; return }
  if (password.value.length < 6) { passwordError.value = 'Must be at least 6 characters'; return }

  loading.value = true
  try {
    await authStore.signUp(email.value, password.value, username.value)
    success.value = true
  } catch (err) {
    serverError.value = err.message || 'Sign up failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: var(--color-workshop-alt);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: var(--shadow-elevation-3);
}

.auth-header { margin-bottom: 2rem; }

.auth-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.5rem;
}

.auth-header h1 { font-size: 1.75rem; }

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.success-msg {
  padding: 1.25rem;
  background: var(--color-plasma-soft);
  border: 1px solid rgba(107, 191, 142, 0.3);
  border-radius: 8px;
  font-size: 0.88rem;
  color: var(--color-plasma-dim);
  line-height: 1.6;
}

.server-error {
  font-size: 0.82rem;
  color: var(--color-error);
  text-align: center;
  padding: 0.6rem;
  background: rgba(248, 113, 113, 0.08);
  border-radius: 6px;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.82rem;
  color: var(--color-subtext);
}

.auth-link {
  color: var(--color-plasma);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover { text-decoration: underline; }
</style>
