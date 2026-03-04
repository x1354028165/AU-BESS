<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-icon">
          <!-- Dashboard icon -->
          <svg v-if="item.meta?.icon === 'dashboard'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <!-- Default icon -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </span>
        <span v-show="!collapsed" class="nav-label">{{ item.meta?.title ?? '' }}</span>
      </router-link>
    </nav>

    <button class="collapse-btn" @click="toggleCollapse">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline v-if="collapsed" points="9 18 15 12 9 6"/>
        <polyline v-else points="15 18 9 12 15 6"/>
      </svg>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const collapsed = ref(false)

defineExpose({ collapsed })

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

// Expose toggle for parent to call
defineEmits<{}>()

const menuItems = computed(() => {
  const layoutRoute = router.getRoutes().find(r => r.name === 'layout')
  if (!layoutRoute?.children) return []

  return layoutRoute.children
    .filter(child => {
      // Only show routes with meta.title
      if (!child.meta?.title) return false
      // Only show routes the current role has access to
      const roles = child.meta?.roles as string[] | undefined
      if (roles && authStore.user.role && !roles.includes(authStore.user.role)) return false
      return true
    })
    .map(child => ({
      path: child.path.startsWith('/') ? child.path : `/${child.path}`,
      meta: child.meta as Record<string, unknown> | undefined
    }))
})

function isActive(path: string) {
  return route.path === path
}
</script>

<style scoped>
.app-sidebar {
  width: 220px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
}

.app-sidebar.collapsed {
  width: 64px;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}

.nav-item.active {
  color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  border-left: 3px solid #00ff88;
}

.nav-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 18px;
  height: 18px;
}

.nav-label {
  line-height: 1;
}

.collapse-btn {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.5);
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #00ff88;
}

.collapse-btn svg {
  width: 16px;
  height: 16px;
}
</style>
