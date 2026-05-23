<template>
  <div id="app">
    <nav class="navbar">
      <RouterLink to="/" class="nav-logo">🌍 WanderList</RouterLink>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        <RouterLink v-if="store.isLoggedIn" to="/my-travels">My Travels</RouterLink>
        <RouterLink v-if="!store.isLoggedIn" to="/login">Login</RouterLink>
        <RouterLink v-if="!store.isLoggedIn" to="/register">Register</RouterLink>
        <span v-if="store.isLoggedIn" class="user-email">{{ store.userEmail }}</span>
        <button v-if="store.isLoggedIn" class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script>
import { useWanderStore } from './stores/useWanderStore'

export default {
  name: 'App',
  setup() {
    return { store: useWanderStore() }
  },
  methods: {
    handleLogout() {
      this.store.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; background: #f5f5f0; color: #333; }
#app { min-height: 100vh; }
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #2c3e50;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-logo {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.nav-links a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.15s;
}
.nav-links a:hover { color: white; }
.nav-links a.router-link-active { color: white; font-weight: bold; }
.user-email { color: #aaa; font-size: 0.85rem; }
.logout-btn {
  background: transparent;
  border: 1px solid #aaa;
  color: #aaa;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: color 0.15s, border-color 0.15s;
}
.logout-btn:hover { color: white; border-color: white; }
main { padding: 1rem; }
</style>