<template>
  <header class="app-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="$emit('toggle-sidebar')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="header-brand">
        <img :src="logoPath" alt="Logo" class="header-logo">
      </div>
    </div>

    <div class="header-right">
      <!-- Alert Badge -->
      <div v-if="alertCount > 0" class="alert-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="badge-count">{{ alertCount }}</span>
      </div>

      <!-- Language Toggle -->
      <button class="header-action-btn" @click="$emit('toggle-lang')">
        <span class="lang-indicator">{{ lang === 'en' ? 'EN' : '中' }}</span>
      </button>

      <!-- User Info -->
      <div class="user-info">
        <div class="user-avatar">{{ avatarLetter }}</div>
        <div class="user-details">
          <span class="user-name">{{ user.name || 'User' }}</span>
          <span class="user-role-tag" :class="user.role ?? undefined">{{ roleLabel }}</span>
        </div>
      </div>

      <!-- Switch Role -->
      <button class="header-action-btn" @click="$emit('switch-role')" :title="lang === 'en' ? 'Switch Role' : '切换角色'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 3 21 3 21 8"/>
          <line x1="4" y1="20" x2="21" y2="3"/>
          <polyline points="21 16 21 21 16 21"/>
          <line x1="15" y1="15" x2="21" y2="21"/>
          <line x1="4" y1="4" x2="9" y2="9"/>
        </svg>
      </button>

      <!-- Logout -->
      <button class="header-action-btn logout-btn" @click="$emit('logout')" :title="lang === 'en' ? 'Sign Out' : '退出登录'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/stores/authStore'

const props = defineProps<{
  user: User
  lang: 'en' | 'zh'
  alertCount: number
}>()

defineEmits<{
  logout: []
  'switch-role': []
  'toggle-lang': []
  'toggle-sidebar': []
}>()

const logoPath = computed(() => `${import.meta.env.BASE_URL}v3/logo.png`)

const avatarLetter = computed(() => {
  const name = props.user.name || props.user.email || 'U'
  return name.charAt(0).toUpperCase()
})

const roleLabel = computed(() => {
  if (!props.user.role) return ''
  if (props.lang === 'en') {
    return props.user.role === 'owner' ? 'Owner' : 'Operator'
  }
  return props.user.role === 'owner' ? '业主' : '运维方'
})
</script>

<style scoped>
.app-header {
  height: 60px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px) saturate(1.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.sidebar-toggle svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.header-brand {
  display: flex;
  align-items: center;
}

.header-logo {
  height: 28px;
  object-fit: contain;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-badge {
  position: relative;
  padding: 6px;
  cursor: pointer;
}

.alert-badge svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.badge-count {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.header-action-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.7);
}

.header-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 255, 136, 0.3);
  color: #00ff88;
}

.header-action-btn svg {
  width: 18px;
  height: 18px;
}

.lang-indicator {
  font-size: 12px;
  font-weight: 600;
  color: #00ff88;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00ff88, #00aaff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 700;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

.user-role-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  line-height: 1.4;
  display: inline-block;
  width: fit-content;
}

.user-role-tag.owner {
  background: rgba(0, 255, 136, 0.15);
  color: #00ff88;
}

.user-role-tag.operator {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
}

.logout-btn:hover {
  border-color: rgba(255, 68, 68, 0.3);
  color: #ff4444;
}
</style>
