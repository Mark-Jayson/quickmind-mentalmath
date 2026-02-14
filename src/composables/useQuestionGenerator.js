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
