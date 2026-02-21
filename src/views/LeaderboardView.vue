<template>
  <div class="leaderboard-page">
    <header class="lb-header">
      <p class="lb-tag">LEADERBOARD</p>
      <h1>Top performers</h1>
      <p class="lb-subtitle">Rankings based on accuracy first, then speed.</p>
      <hr class="plasma-line" />
    </header>

    <div class="lb-filters">
      <div class="filter-group">
        <span class="filter-label">Category</span>
        <div class="filter-options">
          <button
            v-for="cat in categoryOptions"
            :key="cat.id"
            :class="['filter-btn', { 'filter-btn--active': selectedCategory === cat.id }]"
            @click="selectedCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">Set Size</span>
        <div class="filter-options">
          <button
            v-for="size in [10, 20, 40]"
            :key="size"
            :class="['filter-btn', { 'filter-btn--active': selectedSetSize === size }]"
            @click="selectedSetSize = size"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <div class="lb-table-container">
      <div v-if="loading" class="lb-loading">
        <div class="loading-spinner" />
        <p>Loading leaderboard...</p>
      </div>

      <div v-else-if="entries.length === 0" class="lb-empty">
        <component :is="Trophy" :size="40" class="empty-icon" />
        <h3>No entries yet</h3>
        <p>Be the first to compete in this category!</p>
        <router-link 
          :to="{ path: '/mathlympics', query: { autoStart: 'true', category: selectedCategory, setSize: selectedSetSize } }" 
          class="start-link"
        >
          Start a challenge →
        </router-link>
      </div>

      <table v-else class="lb-table">
        <thead>
          <tr>
            <th class="th-rank">#</th>
            <th class="th-player">Player</th>
            <th class="th-accuracy">Accuracy</th>
            <th class="th-time">Time</th>
            <th class="th-score">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in entries" :key="i" :class="{ 'tr-top': i < 3 }">
            <td class="td-rank">
              <span :class="['rank-badge', `rank-badge--${i + 1}`]">{{ i + 1 }}</span>
            </td>
            <td class="td-player">
              <div class="player-info">
                <div class="player-avatar">{{ (entry.username || entry.display_name || '?')[0].toUpperCase() }}</div>
                <div>
                  <span class="player-name">{{ entry.display_name || entry.username }}</span>
                  <span class="player-handle">@{{ entry.username }}</span>
                </div>
              </div>
            </td>
            <td class="td-accuracy">{{ (entry.accuracy * 100).toFixed(0) }}%</td>
            <td class="td-time">{{ formatTime(entry.total_time_ms) }}</td>
            <td class="td-score">{{ entry.score }}/{{ selectedSetSize }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Trophy } from 'lucide-vue-next'
import { useLeaderboardStore } from '@/stores/leaderboard'

const store = useLeaderboardStore()
const { entries, selectedCategory, selectedSetSize, loading } = storeToRefs(store)

const categoryOptions = [
  { id: '2x1', label: '2×1' },
  { id: '3x1', label: '3×1' },
  { id: '2x2', label: '2×2' },
  { id: 'squaring', label: 'Squaring' },
  { id: 'multiples_11', label: '×11' },
  { id: 'day_of_week', label: 'Calendar' },
]

function formatTime(ms) {
  if (!ms) return '-'
  const secs = Math.floor(ms / 1000)
  const mins = Math.floor(secs / 60)
  const rem = secs % 60
  return mins > 0 ? `${mins}m ${rem}s` : `${secs}s`
}

onMounted(() => {
  store.fetchLeaderboard()
})

watch([selectedCategory, selectedSetSize], () => {
  store.fetchLeaderboard()
})
</script>

<style scoped>
.leaderboard-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.lb-header { margin-bottom: 2rem; }

.lb-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-plasma);
  margin-bottom: 0.5rem;
}

.lb-header h1 { font-size: 2rem; margin-bottom: 0.4rem; }
.lb-subtitle { color: var(--color-subtext); font-size: 0.9rem; }

.lb-filters { display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }

.filter-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-subtext);
}

.filter-options { display: flex; gap: 0.35rem; }

.filter-btn {
  padding: 0.45rem 0.85rem;
  background: var(--color-workshop);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  color: var(--color-subtext);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-family-sans);
}

.filter-btn:hover { border-color: rgba(107, 191, 142, 0.4); color: var(--color-charcoal); }

.filter-btn--active {
  border-color: var(--color-plasma);
  color: var(--color-plasma-dim);
  background: var(--color-plasma-soft);
}

.lb-empty {
  text-align: center;
  padding: 4rem 2rem;
  border: 1px dashed var(--color-border-light);
  border-radius: 12px;
}

.empty-icon { color: var(--color-subtext); opacity: 0.3; margin-bottom: 1rem; }
.lb-empty h3 { font-size: 1.1rem; margin-bottom: 0.4rem; }
.lb-empty p { color: var(--color-subtext); font-size: 0.88rem; margin-bottom: 1.25rem; }

.start-link {
  color: var(--color-plasma);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
}

.start-link:hover { text-decoration: underline; }

.lb-table { width: 100%; border-collapse: collapse; }

.lb-table th {
  padding: 0.75rem 1rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-subtext);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.lb-table td {
  padding: 0.85rem 1rem;
  font-size: 0.88rem;
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: middle;
}

.th-rank, .td-rank { width: 50px; text-align: center; }
.th-accuracy, .td-accuracy { width: 100px; }
.th-time, .td-time { width: 100px; }
.th-score, .td-score { width: 80px; }

.tr-top td { background: var(--color-plasma-soft); }

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-subtext);
}

.rank-badge--1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #1a1a1a; }
.rank-badge--2 { background: linear-gradient(135deg, #C0C0C0, #A8A8A8); color: #1a1a1a; }
.rank-badge--3 { background: linear-gradient(135deg, #CD7F32, #B87333); color: white; }

.player-info { display: flex; align-items: center; gap: 0.65rem; }

.player-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-plasma-soft);
  color: var(--color-plasma-dim);
  font-weight: 700;
  font-size: 0.82rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.player-name { display: block; font-weight: 600; color: var(--color-charcoal); font-size: 0.88rem; }
.player-handle { display: block; font-size: 0.72rem; color: var(--color-subtext); }

.td-accuracy { font-weight: 700; font-variant-numeric: tabular-nums; color: var(--color-plasma-dim); }
.td-time, .td-score { font-variant-numeric: tabular-nums; color: var(--color-subtext); }

@media (max-width: 768px) {
  .lb-filters { flex-direction: column; gap: 1rem; }
  .th-score, .td-score { display: none; }
}

.lb-loading {
  text-align: center;
  padding: 4rem 2rem;
}

.lb-loading p {
  color: var(--color-subtext);
  font-size: 0.88rem;
  margin-top: 1rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-plasma);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
