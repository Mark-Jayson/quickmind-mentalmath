import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useLessonsStore = defineStore('lessons', () => {
    const lessons = ref([])
    const progress = ref({})
    const loading = ref(false)

    const categories = computed(() => {
        const cats = {}
        for (const lesson of lessons.value) {
            if (!cats[lesson.category]) cats[lesson.category] = []
            cats[lesson.category].push(lesson)
        }
        return cats
    })

    const completedCount = computed(() => {
        return Object.values(progress.value).filter(p => p.completed).length
    })

    async function fetchLessons() {
        loading.value = true
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .order('sort_order', { ascending: true })
            if (error) throw error
            lessons.value = data ?? []
        } catch (err) {
            console.error('Lesson fetch error:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchProgress(userId) {
        try {
            const { data, error } = await supabase
                .from('user_lesson_progress')
                .select('*')
                .eq('user_id', userId)
            if (error) throw error
            const map = {}
            for (const p of data ?? []) {
                map[p.lesson_id] = p
            }
            progress.value = map
        } catch (err) {
            console.error('Progress fetch error:', err)
        }
    }

    async function markComplete(userId, lessonId, quizScore) {
        try {
            // Find lesson to get badge_id
            const lesson = lessons.value.find(l => l.id === lessonId)

            const { data, error } = await supabase
                .from('user_lesson_progress')
                .upsert({
                    user_id: userId,
                    lesson_id: lessonId,
                    completed: true,
                    quiz_score: quizScore,
                    completed_at: new Date().toISOString(),
                })
                .select()
                .single()
            if (error) throw error

            // Award Lesson Badge and 50 XP
            if (lesson && lesson.badge_id) {
                await supabase.from('user_badges').insert({
                    user_id: userId,
                    badge_id: lesson.badge_id
                })
            }

            // Award 50 XP
            const { data: profile } = await supabase.from('profiles').select('xp').eq('id', userId).single()
            if (profile) {
                await supabase.from('profiles').update({ xp: (profile.xp || 0) + 50 }).eq('id', userId)
            }

            progress.value[lessonId] = data
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    return { lessons, progress, loading, categories, completedCount, fetchLessons, fetchProgress, markComplete }
})
