<template>
  <header class="app-header">
    <!-- Left: Logo -->
    <div class="header-logo">
      <img :src="logoPath" alt="X ENERGI" class="logo-img">
    </div>

    <!-- Center: Horizontal Nav -->
    <nav class="header-nav">
      <router-link
        v-for="item in visibleRoutes"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ active: isActive(item.path) }"
      >
        {{ item.title }}
      </router-link>
    </nav>

    <!-- Right: Language + Role + User + Logout -->
    <div class="header-actions">
      <span class="lang-btn" @click="$emit('toggle-lang')">{{ lang === 'en' ? 'EN' : '中' }}</span>
      <span class="role-badge" @click="$emit('switch-role')">{{ roleLabel }} 🔄</span>
      <div class="user-avatar">{{ avatarLetter }}</div>
      <button class="logout-btn" @click="$emit('logout')" :title="lang === 'en' ? 'Sign Out' : '退出登录'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logout-icon">
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
import { useRoute, useRouter } from 'vue-router'
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
}>()

const route = useRoute()
const router = useRouter()

const logoPath = computed(() => `${import.meta.env.BASE_URL}logo.png`)

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

// Derive visible routes from router config — single source of truth
const visibleRoutes = computed(() => {
  const layoutRoute = router.getRoutes().find(r => r.name === 'layout')
  if (!layoutRoute?.children) return []

  return layoutRoute.children
    .filter(child => {
      if (!child.meta?.title) return false
      const roles = child.meta?.roles as string[] | undefined
      if (roles && props.user.role && !roles.includes(props.user.role)) return false
      return true
    })
    .map(child => ({
      path: child.path.startsWith('/') ? child.path : `/${child.path}`,
      title: child.meta?.title as string,
    }))
})

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<style scoped>
.app-header {
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #0a0a0a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

/* === Logo === */
.header-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-img {
  height: 45px;
  object-fit: contain;
}

/* === Center Nav === */
.header-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.nav-link.active {
  color: #00ff88;
  border-bottom-color: #00ff88;
}

/* === Right Actions === */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.lang-btn {
  font-size: 12px;
  font-weight: 600;
  color: #00ff88;
  cursor: pointer;
  padding: 4px 10px;
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 6px;
  transition: all 0.2s;
  user-select: none;
}

.lang-btn:hover {
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.4);
}

.role-badge {
  font-size: 12px;
  font-weight: 600;
  color: #00ff88;
  padding: 4px 12px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  white-space: nowrap;
}

.role-badge:hover {
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.5);
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
  flex-shrink: 0;
}

.logout-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.5);
}

.logout-btn:hover {
  border-color: rgba(255, 68, 68, 0.3);
  color: #ff4444;
  background: rgba(255, 68, 68, 0.08);
}

.logout-icon {
  width: 18px;
  height: 18px;
}
</style>
