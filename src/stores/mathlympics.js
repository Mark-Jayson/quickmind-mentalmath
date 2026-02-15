import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useQuestionGenerator } from '@/composables/useQuestionGenerator'

export const useMathlympicsStore = defineStore('mathlympics', () => {
    const authStore = useAuthStore()
    // State machine: idle → configuring → playing → reviewing
    const state = ref('idle')
    const category = ref('2x2')
    const setSize = ref(10)
    const questions = ref([])
    const answers = ref([])
    const lapTimes = ref([])
    const currentIndex = ref(0)
    const startTime = ref(null)
    const lapStart = ref(null)

    const { generate } = useQuestionGenerator()

    const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
    const isComplete = computed(() => currentIndex.value >= questions.value.length && questions.value.length > 0)
    const progress = computed(() => questions.value.length > 0 ? currentIndex.value / questions.value.length : 0)

    const score = computed(() => {
        let s = 0
        for (let i = 0; i < answers.value.length; i++) {
            if (answers.value[i] === questions.value[i]?.answer) s++
        }
        return s
    })

    const accuracy = computed(() => {
        if (answers.value.length === 0) return 0
        return score.value / answers.value.length
    })

    const totalTimeMs = computed(() => {
        return lapTimes.value.reduce((sum, t) => sum + t, 0)
    })

    const avgTimeMs = computed(() => {
        if (lapTimes.value.length === 0) return 0
        return Math.round(totalTimeMs.value / lapTimes.value.length)
    })

    const results = computed(() => {
        return questions.value.map((q, i) => ({
            question: q.display,
            correctAnswer: q.answer,
            userAnswer: answers.value[i] ?? null,
            isCorrect: answers.value[i] === q.answer,
            timeMs: lapTimes.value[i] ?? 0,
        }))
    })

    function configure(cat, size) {
        category.value = cat
        setSize.value = size
        state.value = 'configuring'
    }

    function startGame() {
        questions.value = generate(category.value, setSize.value)
        answers.value = []
        lapTimes.value = []
        currentIndex.value = 0
        startTime.value = Date.now()
        lapStart.value = Date.now()
        state.value = 'playing'
    }

    async function saveSession() {
        if (!authStore.user) return { new_badges: [] }

        const sessionData = {
            category: category.value,
            set_size: setSize.value,
            score: score.value,
            accuracy: accuracy.value,
            total_time_ms: totalTimeMs.value,
            avg_time_ms: avgTimeMs.value,
            detail: results.value,
        }

        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const response = await fetch('/api/mathlympics/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sessionData)
            })

            if (!response.ok) throw new Error('Failed to submit session')
            
            const result = await response.json()
            
            // Sync profile XP
            await authStore.fetchProfile()
            
            return { new_badges: result.new_badges || [] }
        } catch (error) {
            console.error('Session submit error:', error)
            return { new_badges: [] }
        }
    }

    function submitAnswer(answer) {
        const now = Date.now()
        answers.value.push(answer)
        lapTimes.value.push(now - lapStart.value)
        lapStart.value = now
        currentIndex.value++
    }

    async function submitSession() {
        if (currentIndex.value >= questions.value.length) {
            state.value = 'reviewing'
            return await saveSession()
        }
        return { new_badges: [] }
    }

    function submitAnswer(answer) {
        const now = Date.now()
        answers.value.push(answer)
        lapTimes.value.push(now - lapStart.value)
        lapStart.value = now
        currentIndex.value++
        
        // State update derived from submitSession check in view or separate watcher?
        // Actually, let's keep it simple. The view should check isComplete.
    }

    function reset() {
        state.value = 'idle'
        questions.value = []
        answers.value = []
        lapTimes.value = []
        currentIndex.value = 0
        startTime.value = null
        lapStart.value = null
    }

    return {
        state,
        category,
        setSize,
        questions,
        answers,
        lapTimes,
        currentIndex,
        currentQuestion,
        isComplete,
        progress,
        score,
        accuracy,
        totalTimeMs,
        avgTimeMs,
        results,
        configure,
        startGame,
        submitAnswer,
        submitSession,
        reset,
    }
})
