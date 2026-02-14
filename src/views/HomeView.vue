<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <p class="hero-tag animate-fade-in-up">Mental Math Training Platform</p>
          <h1 class="hero-title animate-fade-in-up delay-100">
            Master<br />mental math.
          </h1>
          <p class="hero-subtitle animate-fade-in-up delay-200">
            Learn Arthur Benjamin's techniques for lightning-fast mental
            calculations. Interactive lessons, timed challenges, and global
            leaderboards.
          </p>
          <div class="hero-actions animate-fade-in-up delay-300">
            <router-link to="/signup">
              <QmButton variant="primary" size="lg">Get Started</QmButton>
            </router-link>
            <router-link to="/curriculum">
              <QmButton variant="ghost" size="lg">Explore Curriculum</QmButton>
            </router-link>
          </div>
        </div>
        <div class="hero-visual animate-fade-in-up delay-400">
          <div class="hero-card">
            <div class="hero-card-label">SAMPLE PROBLEM</div>
            <div class="hero-card-question">46 × 73</div>
            <div class="hero-card-steps">
              <div class="step-item"><span class="step-num">1</span> 40 × 73 = 2920</div>
              <div class="step-item"><span class="step-num">2</span> 6 × 73 = 438</div>
              <div class="step-item step-item--answer"><span class="step-num">→</span> 3,358</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-inner">
        <div class="section-header">
          <p class="section-tag">WHY QUICKMIND</p>
          <h2>Everything you need to<br />become a mental math expert</h2>
        </div>
        <div class="features-grid">
          <div v-for="(feature, i) in features" :key="i" class="feature-card">
            <div class="feature-icon">
              <component :is="feature.icon" :size="24" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <div class="categories-inner">
        <div class="section-header">
          <p class="section-tag">CATEGORIES</p>
          <h2>Challenge yourself across<br />four categories</h2>
        </div>
        <div class="category-grid">
          <div v-for="(cat, i) in categories" :key="i" class="category-card">
            <div class="cat-example">{{ cat.example }}</div>
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.desc }}</p>
            <span class="cat-level">{{ cat.level }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-inner">
        <h2>Ready to sharpen<br />your mind?</h2>
        <p>Start training today — it's free.</p>
        <router-link to="/signup">
          <QmButton variant="primary" size="lg">Create Account</QmButton>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import QmButton from '@/components/ui/QmButton.vue'
import { BookOpen, Timer, Trophy, Brain } from 'lucide-vue-next'

const features = [
  { icon: BookOpen, title: 'Interactive Lessons', desc: 'Step-by-step techniques from Arthur Benjamin\'s "Secrets of Mental Math" with worked examples and practice.' },
  { icon: Timer, title: 'Mathlympics Engine', desc: 'Timed challenges across 4 categories. Track your speed and accuracy as you improve.' },
  { icon: Trophy, title: 'Global Leaderboards', desc: 'Compete against other mental math enthusiasts. Climb the ranks by accuracy and speed.' },
  { icon: Brain, title: 'Memory Techniques', desc: 'Learn the phonetic code and workspace management strategies used by professionals.' },
]

const categories = [
  { name: '2 × 1 Digit', example: '47 × 8', desc: 'Multiply 2-digit numbers by 1-digit numbers at speed.', level: 'Beginner' },
  { name: '3 × 1 Digit', example: '632 × 7', desc: 'Extend the technique to 3-digit multipliers.', level: 'Intermediate' },
  { name: '2 × 2 Digit', example: '46 × 73', desc: 'The criss-cross method for any two 2-digit numbers.', level: 'Advanced' },
  { name: 'Squaring', example: '67²', desc: 'Square any 2-digit number using the a²−b² identity.', level: 'Specialist' },
]
</script>

<style scoped>
/* Hero */
.hero {
  padding: 5rem 1.5rem 4rem;
  background: linear-gradient(175deg, var(--color-workshop-alt) 0%, var(--color-workshop) 55%);
  position: relative;
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-tag {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-plasma-dim);
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(2.8rem, 5.5vw, 4.5rem);
  line-height: 1.05;
  margin-bottom: 1.25rem;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--color-subtext);
  max-width: 480px;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Hero Card */
.hero-card {
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-elevation-3);
}

.hero-card-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-subtext);
  margin-bottom: 0.75rem;
}

.hero-card-question {
  font-family: var(--font-family-serif);
  font-size: 2.75rem;
  font-weight: 800;
  color: var(--color-charcoal);
  margin-bottom: 1.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--color-subtext);
  border-bottom: 1px solid var(--color-border-light);
  font-variant-numeric: tabular-nums;
}

.step-item:last-child {
  border-bottom: none;
}

.step-item--answer {
  color: var(--color-plasma-dim);
  font-weight: 700;
  font-size: 1.2rem;
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-plasma-soft);
  color: var(--color-plasma-dim);
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Features */
.features {
  padding: 5rem 1.5rem;
}

.features-inner, .categories-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.75rem;
}

.section-header h2 {
  max-width: 520px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 2rem;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(107, 191, 142, 0.4);
  box-shadow: var(--shadow-elevation-2);
  transform: translateY(-3px);
}

.feature-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-plasma-soft);
  color: var(--color-plasma-dim);
  border-radius: 10px;
  margin-bottom: 1.25rem;
}

.feature-card h3 {
  font-family: var(--font-family-sans);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.85rem;
  color: var(--color-subtext);
  line-height: 1.7;
}

/* Categories */
.categories {
  padding: 5rem 1.5rem;
  background: var(--color-workshop-alt);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.category-card {
  padding: 2rem;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.category-card:hover {
  box-shadow: var(--shadow-elevation-2);
  transform: translateY(-3px);
}

.cat-example {
  font-family: var(--font-family-serif);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-plasma-dim);
  margin-bottom: 0.75rem;
}

.category-card h3 {
  font-family: var(--font-family-sans);
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.category-card p {
  font-size: 0.82rem;
  color: var(--color-subtext);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.cat-level {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-plasma);
  background: var(--color-plasma-soft);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
}

/* CTA */
.cta {
  padding: 5rem 1.5rem;
  text-align: center;
}

.cta-inner {
  max-width: 600px;
  margin: 0 auto;
}

.cta h2 {
  margin-bottom: 0.75rem;
}

.cta p {
  color: var(--color-subtext);
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-visual {
    order: -1;
  }

  .hero-card-question {
    font-size: 2rem;
  }

  .section-header h2 br {
    display: none;
  }
}
</style>
