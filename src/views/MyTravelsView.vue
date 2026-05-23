<template>
  <div class="my-travels">
    <h1>My Travels</h1>
    <p class="subtitle">You have visited {{ store.visits.length }} countries</p>

    <div v-if="store.visits.length === 0" class="empty">
      <p>You haven't logged any visits yet.</p>
      <RouterLink to="/">Browse countries to get started!</RouterLink>
    </div>

    <div v-else class="visits-list">
      <div v-for="visit in store.visits" :key="visit._id" class="visit-card">
        <div class="visit-header">
          <h2>{{ getFlag(visit.country) }} {{ visit.country }}</h2>
          <div class="actions">
            <button class="btn-edit" @click="startEdit(visit)">✏️ Edit</button>
            <button class="btn-delete" @click="handleDelete(visit._id)">🗑️ Delete</button>
          </div>
        </div>
        <p class="visit-meta">Visited {{ visit.timesVisited }} time(s) · {{ formatDate(visit.dateVisited) }}</p>
        <div class="ratings">
          <span>⭐ Overall: {{ visit.overallRating }}/5</span>
          <span>💰 Cost: {{ visit.costRating }}/5</span>
          <span>🎉 Nightlife: {{ visit.nightlifeRating }}/5</span>
          <span>🏛️ Sightseeing: {{ visit.sightseeingRating }}/5</span>
        </div>
        <p v-if="visit.notes" class="notes">{{ visit.notes }}</p>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <h2>Edit — {{ editingVisit.country }}</h2>
        <p v-if="error" class="error">{{ error }}</p>

        <div class="form-group">
          <label>Times Visited</label>
          <input v-model.number="editForm.timesVisited" type="number" min="1" />
        </div>
        <div class="form-group">
          <label>Overall Rating (1-5)</label>
          <div class="stars">
            <span v-for="n in 5" :key="n" class="star"
              :class="{ active: editForm.overallRating >= n }"
              @click="editForm.overallRating = n">★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Cost Rating (1=cheap, 5=expensive)</label>
          <div class="stars">
            <span v-for="n in 5" :key="n" class="star"
              :class="{ active: editForm.costRating >= n }"
              @click="editForm.costRating = n">★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Nightlife Rating (1-5)</label>
          <div class="stars">
            <span v-for="n in 5" :key="n" class="star"
              :class="{ active: editForm.nightlifeRating >= n }"
              @click="editForm.nightlifeRating = n">★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Sightseeing Rating (1-5)</label>
          <div class="stars">
            <span v-for="n in 5" :key="n" class="star"
              :class="{ active: editForm.sightseeingRating >= n }"
              @click="editForm.sightseeingRating = n">★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Date Visited</label>
          <input v-model="editForm.dateVisited" type="date" />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea v-model="editForm.notes"></textarea>
        </div>
        <div class="modal-buttons">
          <button class="btn-primary" @click="handleUpdate">Save Changes</button>
          <button class="btn-secondary" @click="showEditModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWanderStore } from '../stores/useWanderStore'

const FLAGS = {
  'France': '🇫🇷', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Germany': '🇩🇪',
  'Portugal': '🇵🇹', 'Greece': '🇬🇷', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭', 'Austria': '🇦🇹', 'Czech Republic': '🇨🇿', 'Poland': '🇵🇱',
  'Hungary': '🇭🇺', 'Croatia': '🇭🇷', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
  'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'Ireland': '🇮🇪', 'Romania': '🇷🇴',
  'Bulgaria': '🇧🇬', 'Serbia': '🇷🇸', 'Slovenia': '🇸🇮', 'Slovakia': '🇸🇰',
  'Estonia': '🇪🇪', 'Latvia': '🇱🇻', 'Lithuania': '🇱🇹', 'Luxembourg': '🇱🇺',
  'Malta': '🇲🇹', 'Iceland': '🇮🇸', 'Albania': '🇦🇱', 'Montenegro': '🇲🇪',
  'Bosnia': '🇧🇦', 'North Macedonia': '🇲🇰', 'Moldova': '🇲🇩', 'Ukraine': '🇺🇦',
  'Turkey': '🇹🇷', 'Cyprus': '🇨🇾', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
}

export default {
  name: 'MyTravelsView',
  setup() {
    return { store: useWanderStore() }
  },
  data() {
    return {
      showEditModal: false,
      editingVisit: null,
      error: '',
      editForm: {}
    }
  },
  async mounted() {
    await this.store.fetchVisits()
  },
  methods: {
    getFlag(country) {
      return FLAGS[country] || '🌍'
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    startEdit(visit) {
      this.editingVisit = visit
      this.editForm = {
        timesVisited: visit.timesVisited,
        overallRating: visit.overallRating,
        costRating: visit.costRating,
        nightlifeRating: visit.nightlifeRating,
        sightseeingRating: visit.sightseeingRating,
        dateVisited: visit.dateVisited.split('T')[0],
        notes: visit.notes
      }
      this.showEditModal = true
    },
    async handleUpdate() {
      try {
        await this.store.updateVisit(this.editingVisit._id, this.editForm)
        this.showEditModal = false
      } catch (err) {
        this.error = err.message
      }
    },
    async handleDelete(id) {
      if (confirm('Are you sure you want to delete this visit?')) {
        await this.store.deleteVisit(id)
      }
    }
  }
}
</script>

<style scoped>
.my-travels { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
h1 { color: #2c3e50; margin-bottom: 0.5rem; }
.subtitle { color: #888; margin-bottom: 2rem; }
.empty { text-align: center; padding: 3rem; color: #888; }
.empty a { color: #2c3e50; font-weight: bold; }
.visits-list { display: flex; flex-direction: column; gap: 1rem; }
.visit-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 1.25rem;
}
.visit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.visit-header h2 { color: #2c3e50; font-size: 1.1rem; }
.actions { display: flex; gap: 0.5rem; }
.btn-edit {
  padding: 0.3rem 0.75rem;
  background: #f0f4ff;
  border: 1px solid #2c3e50;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-delete {
  padding: 0.3rem 0.75rem;
  background: #fff0f0;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #e74c3c;
}
.visit-meta { color: #888; font-size: 0.85rem; margin-bottom: 0.75rem; }
.ratings { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: #555; margin-bottom: 0.5rem; }
.notes { color: #777; font-size: 0.9rem; font-style: italic; }
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal {
  background: white; border-radius: 12px; padding: 2rem;
  width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
}
.modal h2 { color: #2c3e50; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; font-size: 0.85rem; color: #555; margin-bottom: 0.4rem; }
input, textarea {
  width: 100%; padding: 0.6rem 0.8rem;
  border: 1px solid #ddd; border-radius: 6px;
  font-size: 0.95rem; box-sizing: border-box;
}
textarea { height: 80px; resize: vertical; }
.stars { display: flex; gap: 0.25rem; }
.star { font-size: 1.8rem; cursor: pointer; color: #ddd; transition: color 0.1s; }
.star.active { color: #f5c518; }
.modal-buttons { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
.btn-primary {
  flex: 1; padding: 0.75rem; background: #2c3e50;
  color: white; border: none; border-radius: 6px; cursor: pointer;
}
.btn-secondary {
  flex: 1; padding: 0.75rem; background: white;
  color: #555; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;
}
.error { color: #e74c3c; font-size: 0.85rem; margin-bottom: 1rem; }
</style>