import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const profile = ref(null)
    const loading = ref(false)
    const initialized = ref(false)

    const isAuthenticated = computed(() => !!user.value)

    async function init() {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            user.value = session?.user ?? null
            if (user.value) {
                await fetchProfile()
            }
        } catch (err) {
            console.error('Auth init error:', err)
        } finally {
            initialized.value = true
        }

        supabase.auth.onAuthStateChange((_event, session) => {
            user.value = session?.user ?? null
            if (user.value) {
                fetchProfile()
            } else {
                profile.value = null
            }
        })
    }

    async function fetchProfile() {
        if (!user.value) return
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.value.id)
                .single()

            if (error) throw error
            profile.value = data
        } catch (err) {
            console.error('Profile fetch error:', err)
        }
    }

    async function signUp(email, password, username) {
        loading.value = true
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                    emailRedirectTo: window.location.origin
                }
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        } finally {
            loading.value = false
        }
    }

    async function signIn(email, password) {
        loading.value = true
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error

            // Explicitly set user state immediately to avoid race conditions with router guards
            if (data.session) {
                user.value = data.session.user
                await fetchProfile()
            }

            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        } finally {
            loading.value = false
        }
    }

    async function signOut() {
        loading.value = true
        try {
            await supabase.auth.signOut()
            user.value = null
            profile.value = null
        } catch (error) {
            console.error('Sign out error:', error)
        } finally {
            loading.value = false
        }
    }

    async function signInWithOAuth() {
        loading.value = true
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        profile,
        loading,
        initialized,
        isAuthenticated,
        init,
        fetchProfile,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
    }
})
