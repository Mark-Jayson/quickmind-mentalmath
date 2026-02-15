export function useQuestionGenerator() {
    /**
     * Generate a random integer in [min, max], excluding multiples of 10.
     */
    function randInt(min, max) {
        let n
        do {
            n = Math.floor(Math.random() * (max - min + 1)) + min
        } while (n % 10 === 0)
        return n
    }

    const generators = {
        '2x1': () => {
            const a = randInt(10, 99)
            const b = randInt(2, 9)
            return { a, b, answer: a * b, display: `${a} × ${b}` }
        },
        '3x1': () => {
            const a = randInt(100, 999)
            const b = randInt(2, 9)
            return { a, b, answer: a * b, display: `${a} × ${b}` }
        },
        '2x2': () => {
            const a = randInt(10, 99)
            const b = randInt(10, 99)
            return { a, b, answer: a * b, display: `${a} × ${b}` }
        },
        'squaring': () => {
            const a = randInt(10, 99)
            return { a, b: a, answer: a * a, display: `${a}²` }
        },
        'day_of_week': () => {
            const start = new Date(1950, 0, 1)
            const end = new Date(2050, 11, 31)
            const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

            // Format date as "Jan 1, 2000" or similar readable format
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return {
                answer: days[date.getDay()],
                display: date.toLocaleDateString('en-US', options),
                isTextAnswer: true
            }
        },
        'addition': () => {
            const a = randInt(100, 999)
            const b = randInt(100, 999)
            return { a, b, answer: a + b, display: `${a} + ${b}` }
        },
        'phonetic_code': () => {
            // Mapping for phonetic code practice
            const map = {
                0: 'S, Z', 1: 'T, D', 2: 'N', 3: 'M', 4: 'R',
                5: 'L', 6: 'CH, SH, J', 7: 'K, G', 8: 'F, V', 9: 'P, B'
            }
            const digit = Math.floor(Math.random() * 10)
            return {
                answer: digit.toString(),
                display: `Which digit maps to: ${map[digit]}?`,
                isTextAnswer: true
            }
        },
        'multiples_11': () => {
            const a = randInt(10, 90)
            return { a, b: 11, answer: a * 11, display: `${a} × 11` }
        },
    }

    /**
     * Generate an array of questions for a given category and count.
     */
    function generate(category, count = 10) {
        const gen = generators[category]
        if (!gen) throw new Error(`Unknown category: ${category}`)
        return Array.from({ length: count }, () => gen())
    }

    return { generate, generators }
}
