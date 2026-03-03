import { defineStore } from 'pinia'

export interface User {
  userName?: string
  userEmail?: string
  [key: string]: any
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 与localStorage键名100%一致
    userName: null as string | null,
    userEmail: null as string | null,
    isLoggedIn: false,
    currentUser: null as User | null,
    role: null as string | null,
  }),
  
  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.userName,
    getUserInfo: (state) => ({
      userName: state.userName,
      userEmail: state.userEmail,
      role: state.role
    })
  },
  
  actions: {
    // 初始化时从localStorage读取状态
    initFromLocalStorage() {
      const userName = localStorage.getItem('userName')
      const userEmail = localStorage.getItem('userEmail')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const role = localStorage.getItem('role')
      const currentUser = localStorage.getItem('currentUser')
      
      if (userName && userEmail && isLoggedIn === 'true') {
        this.userName = userName
        this.userEmail = userEmail
        this.isLoggedIn = true
        this.role = role
        if (currentUser) {
          this.currentUser = JSON.parse(currentUser)
        }
      }
    },
    
    // 登录
    login(email: string) {
      // 简化登录逻辑，与原vpp-login.js保持一致
      this.userName = 'Admin User'
      this.userEmail = email || 'admin@xuheng.com'
      this.isLoggedIn = true
      
      // 同步到localStorage保持兼容
      localStorage.setItem('userName', this.userName)
      localStorage.setItem('userEmail', this.userEmail)
      localStorage.setItem('isLoggedIn', 'true')
    },
    
    // 注销
    logout() {
      this.userName = null
      this.userEmail = null
      this.isLoggedIn = false
      this.role = null
      this.currentUser = null
      
      // 清除localStorage
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('role')
      localStorage.removeItem('currentUser')
    },
    
    // 设置角色
    setRole(role: string) {
      this.role = role
      localStorage.setItem('role', role)
    }
  }
})