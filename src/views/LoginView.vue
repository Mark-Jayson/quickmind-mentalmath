<template>
  <div class="auth-page">
    <div class="auth-card animate-fade-in-up">
      <div class="auth-header">
        <p class="auth-tag">WELCOME BACK</p>
        <h1>Sign In</h1>
        <hr class="plasma-line" />
      </div>

      <div class="social-login">
        <QmButton variant="outline" block :loading="loading" @click="handleGoogleLogin">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="social-icon" />
          Sign in with Google
        </QmButton>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <QmInput
          id="login-email"
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :error="emailError"
        />
        <QmInput
          id="login-password"
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          :error="passwordError"
        />

        <p v-if="serverError" class="server-error">{{ serverError }}</p>

        <QmButton type="submit" variant="primary" block :loading="loading">Sign In</QmButton>
      </form>

      <p class="auth-footer">
        Don't have an account?
        <router-link to="/signup" class="auth-link">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import QmInput from '@/components/ui/QmInput.vue'
import QmButton from '@/components/ui/QmButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const serverError = ref('')
const loading = ref(false)

async function handleLogin() {
  emailError.value = ''
  passwordError.value = ''
  serverError.value = ''

  if (!email.value) { emailError.value = 'Email is required'; return }
  if (!password.value) { passwordError.value = 'Password is required'; return }

  loading.value = true
  try {
    const { error } = await authStore.signIn(email.value, password.value)
    if (error) throw error
    
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (err) {
    serverError.value = err.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  serverError.value = ''
  loading.value = true
  try {
    const { error } = await authStore.signInWithOAuth()
    if (error) throw error
    // Redirect happens automatically by Supabase
  } catch (err) {
    serverError.value = err.message || 'Google sign in failed'
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

.auth-header {
  margin-bottom: 2rem;
}

.auth-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.5rem;
}

.auth-header h1 {
  font-size: 1.75rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.auth-link:hover {
  text-decoration: underline;
}

.social-login {
  margin-bottom: 1.5rem;
}

.social-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: var(--color-subtext);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border-light);
}

.divider::before {
  margin-right: 1em;
}

.divider::after {
  margin-left: 1em;
}
</style>
