import { ref, computed, onUnmounted } from 'vue'

export function useTimer() {
    const elapsed = ref(0)
    const isRunning = ref(false)
    let intervalId = null
    let startedAt = null

    const formatted = computed(() => {
        const total = elapsed.value
        const mins = Math.floor(total / 60000)
        const secs = Math.floor((total % 60000) / 1000)
        const ms = Math.floor((total % 1000) / 10)
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`
    })

    const seconds = computed(() => (elapsed.value / 1000).toFixed(1))

    function start() {
        if (isRunning.value) return
        startedAt = Date.now() - elapsed.value
        isRunning.value = true
        intervalId = setInterval(() => {
            elapsed.value = Date.now() - startedAt
        }, 50)
    }

    function stop() {
        isRunning.value = false
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    function reset() {
        stop()
        elapsed.value = 0
        startedAt = null
    }

    function lap() {
        const current = elapsed.value
        return current
    }

    onUnmounted(() => {
        stop()
    })

    return { elapsed, isRunning, formatted, seconds, start, stop, reset, lap }
}
