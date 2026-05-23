<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Create Account</h1>
      <p class="subtitle">Start tracking your European adventures</p>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="your@email.com" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Min. 6 characters" />
      </div>
      <button class="btn-primary" @click="handleRegister">Create Account</button>
      <p class="switch-link">
        Already have an account?
        <RouterLink to="/login">Log in here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script>
import { useWanderStore } from '../stores/useWanderStore'

export default {
  name: 'RegisterView',
  setup() {
    return { store: useWanderStore() }
  },
  data() {
    return { email: '', password: '', error: '' }
  },
  methods: {
    async handleRegister() {
      try {
        await this.store.register(this.email, this.password)
        this.$router.push('/login')
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
h1 { color: #2c3e50; margin-bottom: 0.5rem; }
.subtitle { color: #888; margin-bottom: 1.5rem; font-size: 0.9rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; font-size: 0.85rem; color: #555; margin-bottom: 0.4rem; }
input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
}
.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
.btn-primary:hover { background: #1a252f; }
.error { color: #e74c3c; font-size: 0.85rem; margin-bottom: 1rem; }
.switch-link { text-align: center; margin-top: 1rem; font-size: 0.85rem; color: #888; }
.switch-link a { color: #2c3e50; font-weight: bold; }
</style>