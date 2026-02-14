import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useLeaderboardStore = defineStore('leaderboard', () => {
    const entries = ref([])
    const selectedCategory = ref('2x2')
    const selectedSetSize = ref(10)
    const loading = ref(false)

    async function fetchLeaderboard() {
        loading.value = true
        try {
            const { data, error } = await supabase
                .rpc('get_leaderboard', {
                    p_category: selectedCategory.value,
                    p_set_size: selectedSetSize.value,
                })
            if (error) throw error
            entries.value = data ?? []
        } catch (err) {
            console.error('Leaderboard fetch error:', err)
            // Fallback: direct query
            try {
                const { data, error } = await supabase
                    .from('mathlympics_sessions')
                    .select(`
            score,
            accuracy,
            total_time_ms,
            played_at,
            profiles!inner (username, display_name, avatar_url)
          `)
                    .eq('category', selectedCategory.value)
                    .eq('set_size', selectedSetSize.value)
                    .order('accuracy', { ascending: false })
                    .order('total_time_ms', { ascending: true })
                    .limit(100)

                if (error) throw error
                entries.value = (data ?? []).map((row, i) => ({
                    rank: i + 1,
                    username: row.profiles.username,
                    display_name: row.profiles.display_name,
                    avatar_url: row.profiles.avatar_url,
                    score: row.score,
                    accuracy: row.accuracy,
                    total_time_ms: row.total_time_ms,
                    played_at: row.played_at,
                }))
            } catch (fallbackErr) {
                console.error('Leaderboard fallback error:', fallbackErr)
            }
        } finally {
            loading.value = false
        }
    }

    function setFilters(category, setSize) {
        selectedCategory.value = category
        selectedSetSize.value = setSize
    }

    return { entries, selectedCategory, selectedSetSize, loading, fetchLeaderboard, setFilters }
})
