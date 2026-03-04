<template>
    <!-- Background Layer with VPP Elements -->
    <div class="background-layer">
        <!-- Grid Pattern -->
        <div class="grid-pattern"></div>
        
        <!-- VPP Elements -->
        <div class="vpp-elements">
            <!-- Solar Panel -->
            <div class="vpp-element solar-panel">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <rect x="10" y="30" width="80" height="50" rx="2" stroke-width="2"/>
                    <line x1="10" y1="45" x2="90" y2="45" stroke-width="1.5"/>
                    <line x1="10" y1="60" x2="90" y2="60" stroke-width="1.5"/>
                    <line x1="30" y1="30" x2="30" y2="80" stroke-width="1.5"/>
                    <line x1="50" y1="30" x2="50" y2="80" stroke-width="1.5"/>
                    <line x1="70" y1="30" x2="70" y2="80" stroke-width="1.5"/>
                </svg>
            </div>
            
            <!-- Wind Turbine -->
            <div class="vpp-element wind-turbine">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <line x1="50" y1="40" x2="50" y2="85" stroke-width="3"/>
                    <circle cx="50" cy="40" r="3" fill="currentColor"/>
                    <path class="turbine-blade" d="M50 40 L50 15 Q48 10 45 12 Q42 14 45 20 L50 40" stroke-width="2" fill="currentColor" opacity="0.3"/>
                    <path class="turbine-blade" d="M50 40 L70 50 Q75 52 73 55 Q71 58 65 55 L50 40" stroke-width="2" fill="currentColor" opacity="0.3"/>
                    <path class="turbine-blade" d="M50 40 L30 50 Q25 52 27 55 Q29 58 35 55 L50 40" stroke-width="2" fill="currentColor" opacity="0.3"/>
                </svg>
            </div>
            
            <!-- Battery -->
            <div class="vpp-element battery">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <rect x="25" y="20" width="50" height="60" rx="4" stroke-width="2"/>
                    <rect x="35" y="12" width="30" height="8" rx="2" stroke-width="2" fill="currentColor" opacity="0.3"/>
                    <rect x="35" y="30" width="30" height="10" fill="currentColor" opacity="0.5" class="battery-level"/>
                    <rect x="35" y="45" width="30" height="10" fill="currentColor" opacity="0.5" class="battery-level"/>
                    <rect x="35" y="60" width="30" height="10" fill="currentColor" opacity="0.5" class="battery-level"/>
                </svg>
            </div>
            
            <!-- Energy Grid -->
            <div class="vpp-element energy-grid">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <circle cx="50" cy="50" r="30" stroke-width="2" stroke-dasharray="5 5" opacity="0.3"/>
                    <circle cx="50" cy="50" r="20" stroke-width="2" stroke-dasharray="3 3" opacity="0.5"/>
                    <circle cx="50" cy="50" r="10" stroke-width="2" opacity="0.7"/>
                    <circle cx="50" cy="50" r="3" fill="currentColor" class="pulse"/>
                </svg>
            </div>
            
            <!-- Smart Home -->
            <div class="vpp-element smart-home">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <path d="M50 15 L20 40 L20 75 L80 75 L80 40 Z" stroke-width="2"/>
                    <path d="M35 75 L35 55 L65 55 L65 75" stroke-width="2"/>
                    <rect x="40" y="40" width="8" height="8" stroke-width="1.5"/>
                    <rect x="52" y="40" width="8" height="8" stroke-width="1.5"/>
                    <circle cx="50" cy="65" r="3" fill="currentColor" class="pulse"/>
                </svg>
            </div>
            
            <!-- EV Charging Station -->
            <div class="vpp-element ev-station">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <rect x="30" y="40" width="40" height="50" rx="4" stroke-width="2"/>
                    <rect x="40" y="30" width="20" height="10" rx="2" stroke-width="2"/>
                    <path d="M45 55 L55 55 L50 65 L55 65 L45 75 L50 65 L45 65 Z" stroke-width="1.5" fill="currentColor" opacity="0.5"/>
                    <line x1="70" y1="60" x2="85" y2="60" stroke-width="2"/>
                    <circle cx="85" cy="60" r="8" stroke-width="2"/>
                </svg>
            </div>
            
            <!-- Data Center -->
            <div class="vpp-element data-center">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <rect x="25" y="20" width="50" height="60" rx="2" stroke-width="2"/>
                    <rect x="30" y="25" width="40" height="8" rx="1" stroke-width="1.5" class="server-rack"/>
                    <rect x="30" y="36" width="40" height="8" rx="1" stroke-width="1.5" class="server-rack"/>
                    <rect x="30" y="47" width="40" height="8" rx="1" stroke-width="1.5" class="server-rack"/>
                    <rect x="30" y="58" width="40" height="8" rx="1" stroke-width="1.5" class="server-rack"/>
                    <rect x="30" y="69" width="40" height="8" rx="1" stroke-width="1.5" class="server-rack"/>
                    <circle cx="35" cy="29" r="1.5" fill="currentColor" class="blink"/>
                    <circle cx="35" cy="40" r="1.5" fill="currentColor" class="blink" style="animation-delay: 0.2s"/>
                    <circle cx="35" cy="51" r="1.5" fill="currentColor" class="blink" style="animation-delay: 0.4s"/>
                </svg>
            </div>
            
            <!-- Power Transmission Tower -->
            <div class="vpp-element transmission-tower">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <path d="M40 85 L45 60 L35 40 L45 20 L50 10 L55 20 L65 40 L55 60 L60 85" stroke-width="2"/>
                    <line x1="35" y1="40" x2="65" y2="40" stroke-width="2"/>
                    <line x1="45" y1="20" x2="55" y2="20" stroke-width="2"/>
                    <line x1="10" y1="30" x2="35" y2="40" stroke-width="1.5" class="power-line"/>
                    <line x1="65" y1="40" x2="90" y2="30" stroke-width="1.5" class="power-line"/>
                </svg>
            </div>
        </div>
        
        <!-- Energy Particles -->
        <div class="energy-particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
        </div>
        
        <!-- Connection Lines -->
        <svg class="connection-network" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:rgba(0,255,136,0);stop-opacity:1" />
                    <stop offset="50%" style="stop-color:rgba(0,255,136,0.3);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgba(0,255,136,0);stop-opacity:1" />
                </linearGradient>
            </defs>
            <path class="energy-flow" d="M20,30 Q50,40 80,20" stroke="url(#lineGradient)" stroke-width="0.2" fill="none"/>
            <path class="energy-flow" d="M10,60 Q40,50 70,70" stroke="url(#lineGradient)" stroke-width="0.2" fill="none" style="animation-delay: 1s"/>
            <path class="energy-flow" d="M30,80 Q60,70 90,85" stroke="url(#lineGradient)" stroke-width="0.2" fill="none" style="animation-delay: 2s"/>
        </svg>
    </div>

    <!-- Language Switcher -->
    <div class="language-switcher">
        <button class="lang-btn" id="langSwitcher" @click="toggleLanguage">
            <span class="lang-text" :class="{ active: currentLang === 'en' }">EN</span>
            <span class="lang-separator">|</span>
            <span class="lang-text" :class="{ active: currentLang === 'zh' }">中文</span>
        </button>
    </div>

    <!-- Main Container -->
    <div class="main-container">
        <div class="content-wrapper">
            <!-- Left VPP Content -->
            <div class="vpp-content">
                <div class="vpp-brand-group">
                    <img :src="logoPath" alt="VPP" class="logo">
                    <div class="vpp-text-group">
                        <h1 class="vpp-title" >{{ t.vppTitle }}</h1>
                        <p class="vpp-subtitle" >{{ t.vppSubtitle }}</p>
                    </div>
                </div>
            </div>

            <!-- Right Login Panel -->
            <div class="login-panel glass-panel">
                <!-- Auth Container -->
                <div class="auth-container">
                    <!-- Login Form -->
                    <div v-show="currentForm === 'login'" id="loginForm" class="auth-section active">
                        <h2 class="auth-title" >{{ t.signIn }}</h2>
                        
                        <form @submit.prevent="handleLogin" class="auth-form">
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.username }}</span>
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    v-model="loginForm.email" 
                                    type="text" 
                                    id="loginEmail" 
                                    :placeholder="t.usernamePlaceholder"
                                    required 
                                    value="admin@xuheng.com"
                                >
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.password }}</span>
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    v-model="loginForm.password" 
                                    type="password" 
                                    id="loginPassword" 
                                    :placeholder="t.passwordPlaceholder"
                                    required 
                                    value="xuheng123"
                                >
                            </div>
                            
                            <!-- Math Captcha (disabled) -->
                            <div class="form-group" style="display: none;">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.captcha }}</span>
                                    <span class="required">*</span>
                                </label>
                                <div class="captcha-container">
                                    <input type="text" id="loginCaptchaAnswer" class="captcha-input" :placeholder="t.captchaPlaceholder">
                                    <div class="captcha-question" id="loginCaptchaQuestion" title="Click to refresh"></div>
                                </div>
                            </div>
                            
                            <div class="form-links">
                                <a href="#" @click.prevent="switchForm('forgot')" class="link" id="forgotLink" >{{ t.forgotPassword }}</a>
                                <a href="#" @click.prevent="switchForm('register')" class="link" id="registerLink" >{{ t.userRegister }}</a>
                            </div>
                            
                            <button type="submit" class="submit-btn" >{{ t.submitLogin }}</button>
                        </form>
                        
                    </div>

                    <!-- Register Form -->
                    <div v-show="currentForm === 'register'" id="registerForm" class="auth-section">
                        <h2 class="auth-title" >{{ t.createAccount }}</h2>
                        
                        <form @submit.prevent="handleRegister" class="auth-form">
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.account }}</span>
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    v-model="registerForm.account" 
                                    type="text" 
                                    id="registerAccount" 
                                    :placeholder="t.accountPlaceholder"
                                    required
                                >
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.email }}</span>
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    v-model="registerForm.email" 
                                    type="email" 
                                    id="registerEmail" 
                                    :placeholder="t.emailPlaceholder"
                                    required
                                >
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.password }}</span>
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    v-model="registerForm.password" 
                                    type="password" 
                                    id="registerPassword" 
                                    :placeholder="t.passwordPlaceholder"
                                    required
                                >
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.confirmPassword }}</span>
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    v-model="registerForm.confirmPassword" 
                                    type="password" 
                                    id="confirmPassword" 
                                    :placeholder="t.confirmPasswordPlaceholder"
                                    required
                                >
                            </div>
                            
                            <!-- Math Captcha -->
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.captcha }}</span>
                                    <span class="required">*</span>
                                </label>
                                <div class="captcha-container">
                                    <input type="text" id="registerCaptchaAnswer" class="captcha-input" :placeholder="t.captchaPlaceholder" required>
                                    <div class="captcha-question" id="registerCaptchaQuestion" title="Click to refresh"></div>
                                </div>
                            </div>
                            
                            <div class="form-links">
                                <a href="#" @click.prevent="switchForm('login')" class="link back-to-login" >{{ t.backToLogin }}</a>
                            </div>
                            
                            <button type="submit" class="submit-btn" >{{ t.submitRegister }}</button>
                        </form>
                    </div>

                    <!-- Forgot Password Form -->
                    <div v-show="currentForm === 'forgot'" id="forgotForm" class="auth-section">
                        <h2 class="auth-title" data-i18n="forgotPassword">Forgot Password</h2>
                        
                        <form @submit.prevent="handleForgotPassword" class="auth-form">
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.email }}</span>
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    v-model="forgotForm.email" 
                                    type="email" 
                                    id="resetEmail" 
                                    :placeholder="t.emailPlaceholder"
                                    required
                                >
                            </div>
                            
                            <!-- Math Captcha -->
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-text" >{{ t.captcha }}</span>
                                    <span class="required">*</span>
                                </label>
                                <div class="captcha-container">
                                    <input type="text" id="forgotCaptchaAnswer" class="captcha-input" :placeholder="t.captchaPlaceholder" required>
                                    <div class="captcha-question" id="forgotCaptchaQuestion" title="Click to refresh"></div>
                                </div>
                            </div>
                            
                            <div class="form-links">
                                <a href="#" @click.prevent="switchForm('login')" class="link back-to-login" >{{ t.backToLogin }}</a>
                            </div>
                            
                            <button type="submit" class="submit-btn" >{{ t.sendResetLink }}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="footer-content">
            <span >{{ t.companyInfo }}</span>
            <span class="separator">|</span>
            <span >{{ t.contactPhone }}</span>
            <span class="separator">|</span>
            <span >{{ t.recordNumber }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// 语言切换
const currentLang = ref<'en' | 'zh'>('en')

// 当前表单
const currentForm = ref('login')

// Logo路径
const logoPath = computed(() => '/v3/logo.png')

// 翻译数据
const translations = {
    en: {
        vppTitle: "Australia Energy Storage",
        vppSubtitle: "Australia's Clean Energy Storage Solution",
        signIn: "Sign In",
        createAccount: "Create Account",
        userRegister: "User Register",
        username: "Username/Email",
        password: "Password",
        account: "Account",
        email: "Email",
        confirmPassword: "Confirm Password",
        captcha: "Verification Code",
        forgotPassword: "Forgot password?",
        backToLogin: "Back to login",
        submitLogin: "Login",
        submitRegister: "Submit",
        sendResetLink: "Send Reset Link",
        usernamePlaceholder: "Please enter username/email",
        passwordPlaceholder: "Please enter password",
        accountPlaceholder: "Please enter account",
        emailPlaceholder: "Please enter email",
        confirmPasswordPlaceholder: "Please confirm password",
        captchaPlaceholder: "Answer",
        companyInfo: "System Copyright Owner: Xuheng Electronics (Shenzhen) Co., Ltd.",
        contactPhone: "Website Record: Guangdong ICP No. 2021169764",
        recordNumber: "Contact: xuheng@alwayscontrol.com.cn",
        loginSuccess: "Login successful!"
    },
    zh: {
        vppTitle: "澳洲储能电站",
        vppSubtitle: "澳洲清洁能源储存解决方案",
        signIn: "登录",
        createAccount: "创建账户",
        userRegister: "用户注册",
        username: "用户名/邮箱",
        password: "密码",
        account: "账号",
        email: "邮箱",
        confirmPassword: "确认密码",
        captcha: "验证码",
        forgotPassword: "忘记密码",
        backToLogin: "返回登录",
        submitLogin: "登录",
        submitRegister: "提交",
        sendResetLink: "发送重置链接",
        usernamePlaceholder: "请输入用户名/邮箱",
        passwordPlaceholder: "请输入密码",
        accountPlaceholder: "请输入账号",
        emailPlaceholder: "请输入邮箱",
        confirmPasswordPlaceholder: "请确认密码",
        captchaPlaceholder: "答案",
        companyInfo: "系统版权所有者：旭衡电子（深圳）有限公司",
        contactPhone: "网站备案信息：粤ICP备2021169764号",
        recordNumber: "联系方式：xuheng@alwayscontrol.com.cn",
        loginSuccess: "登录成功！"
    }
}

// 计算属性：当前语言的翻译（Vue响应式，不再操作DOM）
const t = computed(() => translations[currentLang.value])

// 表单数据
const loginForm = reactive({
    email: 'admin@xuheng.com',
    password: 'xuheng123'
})

const registerForm = reactive({
    account: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const forgotForm = reactive({
    email: ''
})

// 切换语言
const toggleLanguage = () => {
    currentLang.value = currentLang.value === 'en' ? 'zh' : 'en'
}

// 切换表单
const switchForm = (formName: string) => {
    currentForm.value = formName
}

// 登录 → 真实路由跳转
const handleLogin = () => {
    authStore.login(loginForm.email)
    router.push('/role-select')
}

// 注册
const handleRegister = () => {
    setTimeout(() => switchForm('login'), 2000)
}

// 忘记密码
const handleForgotPassword = () => {
    setTimeout(() => switchForm('login'), 3000)
}
</script>

<!-- 原版CSS样式 - 1:1还原v2 -->
<style>
@import '@/assets/vpp-login.css';
</style>