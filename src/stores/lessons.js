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
            progress.value[lessonId] = data
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    return { lessons, progress, loading, categories, completedCount, fetchLessons, fetchProgress, markComplete }
})
