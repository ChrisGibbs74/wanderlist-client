<template>
  <div class="leaderboard">
    <h1>🌍 Community Leaderboard</h1>
    <p class="subtitle">See which countries WanderList travellers love most</p>

    <div v-if="loading" class="loading">Loading leaderboard...</div>

    <div v-else-if="store.leaderboard" class="leaderboard-grid">
      <div class="leaderboard-section">
        <h2>🏆 Most Visited</h2>
        <div class="leaderboard-list">
          <div
            v-for="(country, index) in store.leaderboard.mostVisited"
            :key="country._id"
            class="leaderboard-item"
          >
            <span class="rank" :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }">
              {{ index + 1 }}
            </span>
            <span class="country-name">{{ country._id }}</span>
            <div class="stats">
              <span>{{ country.totalVisits }} visits</span>
              <span>⭐ {{ country.avgOverall.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="leaderboard-section">
        <h2>⭐ Highest Rated</h2>
        <div class="leaderboard-list">
          <div
            v-for="(country, index) in store.leaderboard.highestRated"
            :key="country._id"
            class="leaderboard-item"
          >
            <span class="rank" :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }">
              {{ index + 1 }}
            </span>
            <span class="country-name">{{ country._id }}</span>
            <div class="stats">
              <span>⭐ {{ country.avgOverall.toFixed(1) }}/5</span>
              <span>{{ country.totalVisits }} visits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWanderStore } from '../stores/useWanderStore'

export default {
  name: 'LeaderboardView',
  setup() {
    return { store: useWanderStore() }
  },
  data() {
    return { loading: true }
  },
  async mounted() {
    await this.store.fetchLeaderboard()
    this.loading = false
  }
}
</script>

<style scoped>
.leaderboard { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
h1 { color: #2c3e50; margin-bottom: 0.5rem; }
.subtitle { color: #888; margin-bottom: 2rem; }
.loading { text-align: center; color: #888; padding: 3rem; }
.leaderboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
@media (max-width: 600px) {
  .leaderboard-grid { grid-template-columns: 1fr; }
}
.leaderboard-section h2 { color: #2c3e50; margin-bottom: 1rem; }
.leaderboard-list { display: flex; flex-direction: column; gap: 0.5rem; }
.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
.rank {
  font-weight: bold;
  font-size: 1.1rem;
  color: #aaa;
  min-width: 24px;
}
.rank.gold { color: #f5c518; }
.rank.silver { color: #aaa; }
.rank.bronze { color: #cd7f32; }
.country-name { flex: 1; font-weight: bold; color: #2c3e50; }
.stats { display: flex; gap: 0.75rem; font-size: 0.85rem; color: #555; }
</style>