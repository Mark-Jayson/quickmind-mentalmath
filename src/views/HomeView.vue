<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg-animate"></div>
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge animate-fade-in-up">
            <span class="pulse-dot"></span>
            v2.0 Now Available
          </div>
          <h1 class="hero-title animate-fade-in-up delay-100">
            Unlock your<br />
            <span class="text-gradient">super computer.</span>
          </h1>
          <p class="hero-subtitle animate-fade-in-up delay-200">
            Master the art of mental calculation. Learn advanced techniques, challenge your cognitive limits, and join a global community of mathletes.
          </p>
          <div class="hero-actions animate-fade-in-up delay-300">
            <router-link to="/signup">
              <QmButton variant="primary" size="lg" :icon="ArrowRight">Start Training Free</QmButton>
            </router-link>
            <router-link to="/mathlympics">
              <QmButton variant="outline" size="lg">Try a Challenge</QmButton>
            </router-link>
          </div>
          
          <div class="hero-social-proof animate-fade-in-up delay-400">
            <div class="avatars">
              <div class="avatar" style="background-image: url('https://i.pravatar.cc/100?img=1')"></div>
              <div class="avatar" style="background-image: url('https://i.pravatar.cc/100?img=2')"></div>
              <div class="avatar" style="background-image: url('https://i.pravatar.cc/100?img=3')"></div>
              <div class="avatar-count">+2k</div>
            </div>
            <p>Join <strong>2,000+</strong> minds training daily.</p>
          </div>
        </div>

        <div class="hero-visual animate-fade-in-up delay-400">
          <div class="hero-card glass-panel">
            <div class="hero-card-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div>
            </div>
            <div class="hero-card-content">
              <div class="problem-display">
                <span class="number">46</span>
                <span class="operator">×</span>
                <span class="number">73</span>
              </div>
              <div class="calculation-steps">
                <div class="calc-line line-1">
                  <span class="muted">40 × 73 =</span>
                  <span class="result">2,920</span>
                </div>
                <div class="calc-line line-2">
                  <span class="muted">6 × 73 =</span>
                  <span class="result">+ 438</span>
                </div>
                <div class="separator"></div>
                <div class="calc-line line-result">
                  <span class="final-answer">3,358</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Strip -->
    <div class="stats-strip">
      <div class="stats-inner">
        <div class="stat-item">
          <span class="stat-num">50+</span>
          <span class="stat-label">Interactive Lessons</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">12k+</span>
          <span class="stat-label">Challenges Solved</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">#1</span>
          <span class="stat-label">Mental Math Platform</span>
        </div>
      </div>
    </div>

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

    <!-- Gamification Section -->
    <section class="gamification">
      <div class="gamification-inner">
        <div class="gamification-content">
          <div class="section-header">
            <p class="section-tag">COMPETE & CLIMB</p>
            <h2>Rise through the ranks</h2>
            <p class="section-desc">
              Test your skills against the world's best mental calculators. Earn badges, track your streak, and see your name on the global leaderboard.
            </p>
          </div>
          <div class="gamification-stats">
            <div class="stat-box">
              <div class="stat-value">Platinum</div>
              <div class="stat-label">Current Rank</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">14 Day</div>
              <div class="stat-label">Streak</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">Top 5%</div>
              <div class="stat-label">Global Percentile</div>
            </div>
          </div>
          <router-link to="/signup">
            <QmButton variant="primary" :icon="Trophy">Join the Competition</QmButton>
          </router-link>
        </div>
        <div class="gamification-visual animate-fade-in-up">
          <div class="leaderboard-card glass-panel">
            <div class="lb-header">
              <span>Rank</span>
              <span>User</span>
              <span>XP</span>
            </div>
            <div class="lb-row top-1">
              <span class="lb-rank">1</span>
              <div class="lb-user">
                <div class="lb-avatar" style="background-color: #fca5a5">MJ</div>
                <span>MathWizard</span>
              </div>
              <span class="lb-xp">12,450</span>
            </div>
            <div class="lb-row top-2">
              <span class="lb-rank">2</span>
              <div class="lb-user">
                <div class="lb-avatar" style="background-color: #93c5fd">AL</div>
                <span>Alex_Calc</span>
              </div>
              <span class="lb-xp">11,200</span>
            </div>
            <div class="lb-row top-3">
              <span class="lb-rank">3</span>
              <div class="lb-user">
                <div class="lb-avatar" style="background-color: #86efac">SK</div>
                <span>SpeedKing</span>
              </div>
              <span class="lb-xp">10,890</span>
            </div>
            <div class="lb-row">
              <span class="lb-rank">4</span>
              <div class="lb-user">
                <div class="lb-avatar" style="background-color: #fdba74">YN</div>
                <span>YouNext</span>
              </div>
              <span class="lb-xp">9,450</span>
            </div>
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
import { BookOpen, Timer, Trophy, Brain, ArrowRight } from 'lucide-vue-next'

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
  padding: 8rem 1.5rem 6rem;
  background: var(--color-background);
  position: relative;
  overflow: hidden;
}

.hero-bg-animate {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(107, 191, 142, 0.15), transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.1), transparent 30%);
  animation: rotateBg 20s linear infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes rotateBg {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(107, 191, 142, 0.1);
  border: 1px solid rgba(107, 191, 142, 0.2);
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-plasma);
  margin-bottom: 1.5rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--color-plasma);
  border-radius: 50%;
  box-shadow: 0 0 0 rgba(107, 191, 142, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(107, 191, 142, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(107, 191, 142, 0); }
  100% { box-shadow: 0 0 0 0 rgba(107, 191, 142, 0); }
}

.hero-title {
  font-size: clamp(3.5rem, 6vw, 5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-plasma) 0%, #38bdf8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--color-subtext);
  max-width: 540px;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

/* Social Proof */
.hero-social-proof {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatars {
  display: flex;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-background);
  background-size: cover;
  margin-right: -10px;
}

.avatar-count {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-workshop);
  border: 2px solid var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-subtext);
  margin-left: -10px;
  z-index: 2;
}

.hero-social-proof p {
  font-size: 0.875rem;
  color: var(--color-subtext);
}

/* Hero Visual - Glass Card */
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  overflow: hidden;
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
}

.hero-visual:hover .glass-panel {
  transform: rotate(0deg) scale(1.02);
}

.hero-card-header {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.03);
  display: flex;
  gap: 0.5rem;
}

.dot { width: 10px; height: 10px; border-radius: 50%; }
.red { background: #fee2e2; border: 1px solid #fecaca; }
.yellow { background: #fef9c3; border: 1px solid #fde047; }
.green { background: #dcfce7; border: 1px solid #bbf7d0; }

.hero-card-content {
  padding: 2rem 2.5rem;
}

.problem-display {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 800;
  font-family: var(--font-family-serif);
  color: var(--color-charcoal);
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 1.5rem;
}

.operator { color: var(--color-plasma); }

.calculation-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: var(--font-family-mono);
  font-size: 1.1rem;
}

.calc-line {
  display: flex;
  justify-content: space-between;
  opacity: 0;
  animation: slideIn 0.5s forwards;
}

.line-1 { animation-delay: 0.8s; }
.line-2 { animation-delay: 1.6s; }
.line-result { animation-delay: 2.4s; font-weight: 700; font-size: 1.25rem; color: var(--color-plasma); }

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.muted { color: var(--color-subtext); }

.separator {
  height: 2px;
  background: var(--color-border);
  width: 100%;
  margin: 0.5rem 0;
  opacity: 0;
  animation: expandWidth 0.5s 2.2s forwards;
}

@keyframes expandWidth {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

/* Stats Strip */
.stats-strip {
  background: var(--color-workshop);
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  padding: 1.5rem 0;
}

.stats-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-plasma);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-subtext);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border-light);
}

/* Features */
.features {
  padding: 6rem 1.5rem;
  background: var(--color-workshop-alt);
}

.features-inner, .categories-inner, .gamification-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 1rem;
  text-transform: uppercase;
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(107, 191, 142, 0.1);
  border-radius: 20px;
}

.section-header h2 {
  max-width: 520px;
  margin: 0 auto;
  font-size: 2.25rem;
  margin-bottom: 1rem;
}

.section-desc {
  max-width: 600px;
  margin: 0 auto;
  color: var(--color-subtext);
  font-size: 1.05rem;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2.5rem;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  border-color: rgba(107, 191, 142, 0.4);
  box-shadow: 0 10px 30px -10px rgba(107, 191, 142, 0.15);
  transform: translateY(-5px);
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  color: var(--color-plasma);
  border-radius: 14px;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-elevation-1);
}

.feature-card h3 {
  font-family: var(--font-family-sans);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--color-subtext);
  line-height: 1.7;
}

/* Gamification */
.gamification {
  padding: 6rem 1.5rem;
  background: var(--color-background);
  overflow: hidden;
}

.gamification-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.gamification-content .section-header {
  text-align: left;
  margin-bottom: 2.5rem;
}

.gamification-content .section-header h2 {
  margin: 0;
  margin-bottom: 1rem;
}

.gamification-content .section-tag {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.gamification-content .section-desc {
  margin: 0;
}

.gamification-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-box {
  flex: 1;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-charcoal);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-subtext);
  text-transform: uppercase;
}

/* Leaderboard Preview */
.leaderboard-card {
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
}

.lb-header {
  display: grid;
  grid-template-columns: 40px 1fr 60px;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-subtext);
  text-transform: uppercase;
}

.lb-row {
  display: grid;
  grid-template-columns: 40px 1fr 60px;
  padding: 1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.03);
}

.lb-row:last-child {
  border-bottom: none;
}

.lb-rank {
  font-weight: 700;
  color: var(--color-subtext);
}

.top-1 .lb-rank { color: #eab308; } /* Gold */
.top-2 .lb-rank { color: #94a3b8; } /* Silver */
.top-3 .lb-rank { color: #d97706; } /* Bronze */

.lb-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: var(--color-charcoal);
}

.lb-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
}

.lb-xp {
  font-family: var(--font-family-mono);
  font-weight: 700;
  color: var(--color-plasma);
  text-align: right;
}

/* Categories */
.categories {
  padding: 6rem 1.5rem;
  background: var(--color-workshop-alt);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.category-card {
  padding: 2.5rem;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.category-card:hover {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.cat-example {
  font-family: var(--font-family-serif);
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-plasma-dim);
  margin-bottom: 1rem;
}

.category-card h3 {
  font-family: var(--font-family-sans);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.category-card p {
  font-size: 0.9rem;
  color: var(--color-subtext);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.cat-level {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-plasma);
  background: var(--color-plasma-soft);
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
}

/* CTA */
.cta {
  padding: 8rem 1.5rem;
  text-align: center;
  background-image: radial-gradient(var(--color-border-light) 1px, transparent 1px);
  background-size: 32px 32px;
}

.cta-inner {
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-workshop);
  padding: 4rem 2rem;
  border-radius: 24px;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.cta p {
  color: var(--color-subtext);
  margin-bottom: 2.5rem;
  font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 6rem 1.5rem 4rem;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  /* Visual appearing after text on mobile for better flow */
  .hero-visual {
    order: 0;
    margin-top: 1rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .glass-panel {
    transform: rotate(0deg);
  }

  .problem-display {
    font-size: 2.5rem;
  }

  /* Stats Strip Mobile */
  .stats-inner {
    flex-wrap: wrap;
    gap: 2rem;
  }

  .stat-item {
    flex: 1 1 140px;
  }

  .stat-divider {
    display: none;
  }

  .gamification-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .gamification-content .section-header {
    text-align: center;
  }

  .gamification-visual {
    order: -1;
  }
  
  .section-header h2 br {
    display: none;
  }
}

</style>
