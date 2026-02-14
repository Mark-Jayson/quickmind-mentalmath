import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useProfileStore = defineStore('profile', () => {
    const profile = ref(null)
    const badges = ref([])
    const loading = ref(false)

    const xp = computed(() => profile.value?.xp ?? 0)

    async function fetchProfile(userId) {
        loading.value = true
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
            if (error) throw error
            profile.value = data
        } catch (err) {
            console.error('Profile fetch error:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchBadges(userId) {
        try {
            const { data, error } = await supabase
                .from('user_badges')
                .select(`
          earned_at,
          badges (*)
        `)
                .eq('user_id', userId)
                .order('earned_at', { ascending: false })
            if (error) throw error
            badges.value = data?.map(ub => ({ ...ub.badges, earned_at: ub.earned_at })) ?? []
        } catch (err) {
            console.error('Badge fetch error:', err)
        }
    }

    async function updateProfile(userId, updates) {
        loading.value = true
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single()
            if (error) throw error
            profile.value = data
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        } finally {
            loading.value = false
        }
    }

    return { profile, badges, loading, xp, fetchProfile, fetchBadges, updateProfile }
})
