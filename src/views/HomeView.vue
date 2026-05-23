<template>
  <div class="home">
    <div class="hero">
      <h1>🌍 WanderList</h1>
      <p>Track and rate every European country you visit</p>
    </div>

    <div class="search-bar">
      <input v-model="search" type="text" placeholder="🔍 Search countries..." />
    </div>

    <div class="countries-grid">
      <div
        v-for="country in filteredCountries"
        :key="country.name"
        class="country-card"
        :class="{ visited: isVisited(country.name) }"
        @click="selectCountry(country)"
      >
        <div class="card-header">
          <span class="flag">{{ country.flag }}</span>
          <span class="country-name">{{ country.name }}</span>
        </div>
        <div v-if="isVisited(country.name)" class="card-body">
          <p class="visited-badge">✓ Visited</p>
          <p class="rating">⭐ {{ getVisit(country.name).overallRating }}/5</p>
        </div>
        <div v-else class="card-body">
          <button class="log-btn">+ Log Visit</button>
        </div>
      </div>
    </div>

    <!-- Add Visit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <h2>{{ selectedCountry.flag }} {{ selectedCountry.name }}</h2>
        <p v-if="error" class="error">{{ error }}</p>

        <div class="form-group">
          <label>Times Visited</label>
          <input v-model.number="form.timesVisited" type="number" min="1" />
        </div>
        <div class="form-group">
          <label>Overall Rating (1-5)</label>
          <div class="stars">
            <span
              v-for="n in 5" :key="n"
              class="star"
              :class="{ active: form.overallRating >= n }"
              @click="form.overallRating = n"
            >★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Cost Rating (1=cheap, 5=expensive)</label>
          <div class="stars">
            <span
              v-for="n in 5" :key="n"
              class="star"
              :class="{ active: form.costRating >= n }"
              @click="form.costRating = n"
            >★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Nightlife Rating (1-5)</label>
          <div class="stars">
            <span
              v-for="n in 5" :key="n"
              class="star"
              :class="{ active: form.nightlifeRating >= n }"
              @click="form.nightlifeRating = n"
            >★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Sightseeing Rating (1-5)</label>
          <div class="stars">
            <span
              v-for="n in 5" :key="n"
              class="star"
              :class="{ active: form.sightseeingRating >= n }"
              @click="form.sightseeingRating = n"
            >★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Date Visited</label>
          <input v-model="form.dateVisited" type="date" />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea v-model="form.notes" placeholder="Write about your experience..."></textarea>
        </div>
        <div class="modal-buttons">
          <button class="btn-primary" @click="handleSubmit">Save Visit</button>
          <button class="btn-secondary" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWanderStore } from '../stores/useWanderStore'

const COUNTRIES = [
  { name: 'France', flag: '🇫🇷' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Romania', flag: '🇷🇴' },
  { name: 'Bulgaria', flag: '🇧🇬' },
  { name: 'Serbia', flag: '🇷🇸' },
  { name: 'Slovenia', flag: '🇸🇮' },
  { name: 'Slovakia', flag: '🇸🇰' },
  { name: 'Estonia', flag: '🇪🇪' },
  { name: 'Latvia', flag: '🇱🇻' },
  { name: 'Lithuania', flag: '🇱🇹' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'Albania', flag: '🇦🇱' },
  { name: 'Montenegro', flag: '🇲🇪' },
  { name: 'Bosnia', flag: '🇧🇦' },
  { name: 'North Macedonia', flag: '🇲🇰' },
  { name: 'Moldova', flag: '🇲🇩' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Cyprus', flag: '🇨🇾' },
]

export default {
  name: 'HomeView',
  setup() {
    return { store: useWanderStore() }
  },
  data() {
    return {
      search: '',
      showModal: false,
      selectedCountry: null,
      error: '',
      form: {
        timesVisited: 1,
        overallRating: 0,
        costRating: 0,
        nightlifeRating: 0,
        sightseeingRating: 0,
        dateVisited: '',
        notes: ''
      }
    }
  },
  computed: {
    filteredCountries() {
      return COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  async mounted() {
    if (this.store.isLoggedIn) {
      await this.store.fetchVisits()
    }
  },
  methods: {
    isVisited(name) {
      return this.store.visits.some(v => v.country === name)
    },
    getVisit(name) {
      return this.store.visits.find(v => v.country === name)
    },
    selectCountry(country) {
      if (!this.store.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      this.selectedCountry = country
      this.error = ''
      this.form = {
        timesVisited: 1,
        overallRating: 0,
        costRating: 0,
        nightlifeRating: 0,
        sightseeingRating: 0,
        dateVisited: '',
        notes: ''
      }
      this.showModal = true
    },
    async handleSubmit() {
      if (!this.form.overallRating || !this.form.costRating ||
          !this.form.nightlifeRating || !this.form.sightseeingRating ||
          !this.form.dateVisited) {
        this.error = 'Please fill in all fields and ratings'
        return
      }
      try {
        await this.store.addVisit({
          country: this.selectedCountry.name,
          ...this.form
        })
        this.showModal = false
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>

<style scoped>
.home { padding: 1.5rem; max-width: 1100px; margin: 0 auto; }
.hero { text-align: center; margin-bottom: 2rem; }
.hero h1 { font-size: 2.5rem; color: #2c3e50; margin-bottom: 0.5rem; }
.hero p { color: #888; font-size: 1.1rem; }
.search-bar { margin-bottom: 1.5rem; }
.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}
.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
.country-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.country-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.country-card.visited {
  border-color: #2c3e50;
  border-width: 2px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.flag { font-size: 1.5rem; }
.country-name { font-weight: bold; color: #2c3e50; font-size: 0.9rem; }
.visited-badge { color: #27ae60; font-size: 0.85rem; font-weight: bold; }
.rating { color: #555; font-size: 0.85rem; }
.log-btn {
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.85rem;
  width: 100%;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal h2 { color: #2c3e50; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; font-size: 0.85rem; color: #555; margin-bottom: 0.4rem; }
input, textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
}
textarea { height: 80px; resize: vertical; }
.stars { display: flex; gap: 0.25rem; }
.star { font-size: 1.8rem; cursor: pointer; color: #ddd; transition: color 0.1s; }
.star.active { color: #f5c518; }
.modal-buttons { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
.btn-primary {
  flex: 1;
  padding: 0.75rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  background: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}
.error { color: #e74c3c; font-size: 0.85rem; margin-bottom: 1rem; }
</style>