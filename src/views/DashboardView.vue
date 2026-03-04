<template>
  <div class="dashboard-placeholder">
    <div class="placeholder-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    </div>
    <h1 class="placeholder-title">Dashboard</h1>
    <p class="placeholder-subtitle">建设中 / Under Construction</p>
    <div class="placeholder-role">
      <span class="role-badge" :class="authStore.user.role ?? undefined">
        {{ authStore.user.role === 'owner' ? '业主面板' : '运维面板' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<style scoped>
.dashboard-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon svg {
  width: 40px;
  height: 40px;
  color: #00ff88;
}

.placeholder-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.placeholder-subtitle {
  font-size: 15px;
  color: #999999;
  margin: 0;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.role-badge.owner {
  background: rgba(0, 255, 136, 0.12);
  color: #00ff88;
}

.role-badge.operator {
  background: rgba(255, 193, 7, 0.12);
  color: #ffc107;
}
</style>
