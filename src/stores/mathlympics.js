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
        if (!authStore.user) return

        const sessionData = {
            user_id: authStore.user.id,
            category: category.value,
            set_size: setSize.value,
            score: score.value,
            accuracy: accuracy.value,
            total_time_ms: totalTimeMs.value,
            avg_time_ms: avgTimeMs.value,
            detail: results.value,
        }

        const { error } = await supabase.from('mathlympics_sessions').insert(sessionData)
        if (error) {
            console.error('Failed to save session:', error)
            return
        }

        // Award base 2 XP for completing a session
        await awardXP(2)

        // Check for milestones and competitive badges
        await checkBadges()
        await checkTop3()
    }

    async function awardXP(amount) {
        if (!authStore.user) return
        const { data: profile } = await supabase.from('profiles').select('xp').eq('id', authStore.user.id).single()
        if (profile) {
            await supabase.from('profiles').update({ xp: (profile.xp || 0) + amount }).eq('id', authStore.user.id)
            await authStore.fetchProfile() // Sync UI
        }
    }

    async function checkTop3() {
        if (!authStore.user) return

        // Query top 3 for current category and size
        const { data: top3, error } = await supabase
            .from('mathlympics_sessions')
            .select('user_id')
            .eq('category', category.value)
            .eq('set_size', setSize.value)
            .order('accuracy', { ascending: false })
            .order('total_time_ms', { ascending: true })
            .limit(3)

        if (error || !top3) return

        const rank = top3.findIndex(s => s.user_id === authStore.user.id) + 1
        let badgeId = null
        if (rank === 1) badgeId = 'medal_gold'
        else if (rank === 2) badgeId = 'medal_silver'
        else if (rank === 3) badgeId = 'medal_bronze'

        if (badgeId) {
            const { error: badgeError } = await supabase.from('user_badges').insert({
                user_id: authStore.user.id,
                badge_id: badgeId
            })
            if (!badgeError) {
                await awardXP(200) // Top 3 reward
            }
        }
    }

    async function checkBadges() {
        if (!authStore.user) return
        const newBadges = []

        // First session check
        const { count } = await supabase.from('mathlympics_sessions').select('*', { count: 'exact', head: true }).eq('user_id', authStore.user.id)
        if (count === 1) newBadges.push('mathlympics_first_session')

        // Perfect scores (Mastery)
        if (accuracy.value === 1) {
            if (category.value === '2x1') newBadges.push('mathlympics_2x1_perfect')
            if (category.value === '3x1') newBadges.push('mathlympics_3x1_perfect')
            if (category.value === '2x2') newBadges.push('mathlympics_2x2_perfect')
            if (category.value === 'squaring') newBadges.push('mathlympics_squaring_perfect')
        }

        // Speed demon
        if (avgTimeMs.value < 5000) newBadges.push('mathlympics_speed_demon')

        // Marathon
        if (setSize.value === 40) newBadges.push('mathlympics_40_set')

        for (const badgeId of newBadges) {
            const { error } = await supabase.from('user_badges').insert({ user_id: authStore.user.id, badge_id: badgeId })
            if (!error) {
                // Award XP based on badge type
                if (badgeId.includes('perfect') || badgeId === 'mathlympics_first_session') {
                    await awardXP(10)
                } else if (badgeId === 'mathlympics_speed_demon' || badgeId === 'mathlympics_40_set') {
                    await awardXP(50)
                }
            }
        }
    }

    function submitAnswer(answer) {
        const now = Date.now()
        answers.value.push(answer)
        lapTimes.value.push(now - lapStart.value)
        lapStart.value = now
        currentIndex.value++

        if (currentIndex.value >= questions.value.length) {
            state.value = 'reviewing'
            saveSession()
        }
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
        reset,
    }
})
