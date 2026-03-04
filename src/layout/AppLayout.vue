<template>
  <div class="app-layout">
    <AppSidebar ref="sidebarRef" />
    <div class="layout-main">
      <AppHeader
        :user="authStore.user"
        :lang="currentLang"
        :alert-count="0"
        @logout="handleLogout"
        @switch-role="handleSwitchRole"
        @toggle-lang="toggleLang"
        @toggle-sidebar="toggleSidebar"
      />
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()

const currentLang = ref<'en' | 'zh'>('en')
const sidebarRef = ref<InstanceType<typeof AppSidebar> | null>(null)

function toggleLang() {
  currentLang.value = currentLang.value === 'en' ? 'zh' : 'en'
}

function toggleSidebar() {
  if (sidebarRef.value) {
    sidebarRef.value.collapsed = !sidebarRef.value.collapsed
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function handleSwitchRole() {
  authStore.setRole(null)
  router.push('/role-select')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #000000;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.layout-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
