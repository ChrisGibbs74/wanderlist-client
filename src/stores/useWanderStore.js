import { defineStore } from 'pinia'

export const useWanderStore = defineStore('wander', {
  state: () => ({
    token: localStorage.getItem('wanderlist_token') || null,
    userEmail: localStorage.getItem('wanderlist_email') || null,
    visits: [],
    leaderboard: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async register(email, password) {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      return data
    },

    async login(email, password) {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      this.token = data.token
      this.userEmail = data.email
      localStorage.setItem('wanderlist_token', data.token)
      localStorage.setItem('wanderlist_email', data.email)
      return data
    },

    logout() {
      this.token = null
      this.userEmail = null
      this.visits = []
      localStorage.removeItem('wanderlist_token')
      localStorage.removeItem('wanderlist_email')
    },

    async fetchVisits() {
      const response = await fetch('http://localhost:3001/api/visits', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      this.visits = data
    },

    async addVisit(visitData) {
      const response = await fetch('http://localhost:3001/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(visitData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      this.visits.unshift(data)
      return data
    },

    async updateVisit(id, visitData) {
      const response = await fetch(`http://localhost:3001/api/visits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(visitData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      const index = this.visits.findIndex(v => v._id === id)
      if (index !== -1) this.visits[index] = data
      return data
    },

    async deleteVisit(id) {
      const response = await fetch(`http://localhost:3001/api/visits/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.token}` }
      })
      if (!response.ok) throw new Error('Failed to delete visit')
      this.visits = this.visits.filter(v => v._id !== id)
    },

    async fetchLeaderboard() {
      const response = await fetch('http://localhost:3001/api/leaderboard')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      this.leaderboard = data
    }
  }
})