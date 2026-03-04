<template>
  <div class="control-panel">
    <!-- Header: 标题 + Auto开关 -->
    <div class="panel-header">
      <h3 class="panel-title">{{ i18n.t('stationManagement') }}</h3>
      <div class="auto-toggle">
        <span class="auto-label">{{ i18n.t('auto') }}</span>
        <div
          class="toggle-switch"
          :class="{ active: isAutoMode }"
          @click="toggleAutoMode"
          role="switch"
          :aria-checked="isAutoMode"
        >
          <div class="toggle-knob"></div>
        </div>
      </div>
    </div>

    <!-- 电站选择器 -->
    <select v-model="selectedStationId" class="station-select">
      <option v-for="s in stations" :key="s.id" :value="s.id">
        {{ s.name }} ({{ s.region }})
      </option>
    </select>

    <!-- 中间区域：Charge按钮 | 电价圈 | Discharge按钮 -->
    <div class="control-center">
      <button
        class="action-btn charge-btn"
        :disabled="isAutoMode || currentStation.runStatus === 'charging'"
        @click="handleCharge"
      >
        {{ i18n.t('charge') }}
      </button>

      <!-- 电价圈（静态科技渐变圆，不做水波纹） -->
      <div class="price-circle" :class="priceCircleClass">
        <div class="price-value">
          ${{ currentStation.currentSpotPrice?.toFixed(2) ?? '--' }}
        </div>
        <div class="price-label">{{ i18n.t('spotPriceLabel') }}</div>
      </div>

      <button
        class="action-btn discharge-btn"
        :disabled="isAutoMode || currentStation.runStatus === 'discharging'"
        @click="handleDischarge"
      >
        {{ i18n.t('discharge') }}
      </button>
    </div>

    <!-- 电池SOC进度条 -->
    <div class="battery-row">
      <span class="battery-label">SOC</span>
      <div class="battery-container">
        <div class="battery-body">
          <div
            class="battery-fill"
            :style="{ width: currentStation.soc + '%' }"
            :class="socColorClass"
          ></div>
          <div class="battery-tick" style="left: 25%"></div>
          <div class="battery-tick" style="left: 50%"></div>
          <div class="battery-tick" style="left: 75%"></div>
          <span class="battery-text">{{ currentStation.soc }}%</span>
        </div>
        <div class="battery-terminal"></div>
      </div>
      <span class="status-badge" :class="'status-' + currentStation.runStatus">
        {{ i18n.t(currentStation.runStatus) }}
      </span>
    </div>

    <!-- 策略区 -->
    <div class="strategy-section">
      <div class="strategy-row">
        <span class="strategy-label">{{ i18n.t('strategy') }}</span>
        <select
          v-model="currentStrategy"
          class="strategy-select"
          :disabled="isAutoMode"
        >
          <option value="rule-based">Rule-based</option>
          <option value="ai-bidding">AI Bidding</option>
          <option value="manual">Manual</option>
        </select>
      </div>
      <div class="strategy-row">
        <span class="strategy-label">{{ i18n.t('runMode') }}</span>
        <span class="strategy-value">{{ i18n.tRunMode(currentStation.runMode) }}</span>
      </div>
    </div>

    <!-- === Settings区 === -->
    <div class="settings-section">
      <div class="settings-header">
        <h4 class="settings-title">{{ i18n.t('settings') }}</h4>
        <button class="settings-edit-btn" @click="toggleEditMode">
          {{ isEditMode ? i18n.t('save') : i18n.t('edit') }}
        </button>
      </div>

      <div class="settings-row">
        <span class="settings-label">{{ i18n.t('chargeStopSOC') }}</span>
        <div class="settings-value-wrap">
          <input
            v-if="isEditMode"
            v-model.number="chargeStopSOC"
            type="number"
            min="0"
            max="100"
            class="settings-input"
          />
          <span v-else class="settings-value">{{ chargeStopSOC }}%</span>
        </div>
      </div>

      <div class="settings-row">
        <span class="settings-label">{{ i18n.t('dischargeStopSOC') }}</span>
        <div class="settings-value-wrap">
          <input
            v-if="isEditMode"
            v-model.number="dischargeStopSOC"
            type="number"
            min="0"
            max="100"
            class="settings-input"
          />
          <span v-else class="settings-value">{{ dischargeStopSOC }}%</span>
        </div>
      </div>

      <div class="settings-row">
        <span class="settings-label">{{ i18n.t('autoCharge') }}</span>
        <div class="settings-value-wrap">
          <template v-if="isEditMode">
            <input v-model="autoChargeStart" type="time" class="settings-input time-input" />
            <span class="time-separator">-</span>
            <input v-model="autoChargeEnd" type="time" class="settings-input time-input" />
          </template>
          <span v-else class="settings-time-bar charge-time-bar">{{ autoChargeStart }} - {{ autoChargeEnd }}</span>
        </div>
      </div>

      <div class="settings-row">
        <span class="settings-label">{{ i18n.t('autoDischarge') }}</span>
        <div class="settings-value-wrap">
          <template v-if="isEditMode">
            <input v-model="autoDischargeStart" type="time" class="settings-input time-input" />
            <span class="time-separator">-</span>
            <input v-model="autoDischargeEnd" type="time" class="settings-input time-input" />
          </template>
          <span v-else class="settings-time-bar discharge-time-bar">{{ autoDischargeStart }} - {{ autoDischargeEnd }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18nStore } from '@/stores/i18nStore'
import { allStations } from '@/mock/dashboard'

const i18n = useI18nStore()

// === 区域现货电价 ($/MWh) — 来自AEMO真实范围 ===
const regionSpotPrices: Record<string, number> = {
  NSW: 87.50,
  VIC: 72.30,
  QLD: 95.10,
  SA: 110.80,
  WA: 68.40,
  TAS: 55.20,
  ACT: 82.60,
}

// === 构建带 currentSpotPrice 的电站数据 ===
const stations = allStations.map(s => ({
  ...s,
  currentSpotPrice: regionSpotPrices[s.region] ?? 80,
}))

// === 响应式状态 ===
const selectedStationId = ref(stations[0].id)
const isAutoMode = ref(true) // 默认Auto
const currentStrategy = ref('ai-bidding')

// 每个电站的可变运行状态（独立于base数据）
const stationStates = reactive<Record<string, { runStatus: string; soc: number }>>(
  Object.fromEntries(
    stations.map(s => [s.id, { runStatus: s.runStatus, soc: s.soc }])
  )
)

// === 计算属性 ===

interface CurrentStationView {
  id: string
  name: string
  region: string
  capacity: number
  power: number
  soc: number
  commStatus: string
  runStatus: string
  runMode: string
  todayProfit: number
  totalProfit: number
  brand: string
  model: string
  fcasEnabled: boolean
  currentSpotPrice: number
}

const currentStation = computed<CurrentStationView>(() => {
  const base = stations.find(s => s.id === selectedStationId.value) || stations[0]
  const state = stationStates[selectedStationId.value]
  return { ...base, ...state }
})

// 电价圈颜色根据价格变化
const priceCircleClass = computed(() => {
  const price = currentStation.value.currentSpotPrice
  if (price > 100) return 'price-high'       // 红色系 - 高价
  if (price > 0) return 'price-normal'        // 蓝色系 - 正常
  return 'price-negative'                      // 绿色系 - 负电价
})

// SOC颜色
const socColorClass = computed(() => {
  const soc = currentStation.value.soc
  if (soc >= 60) return 'soc-high'
  if (soc >= 30) return 'soc-mid'
  return 'soc-low'
})

// === 状态机交互 ===

function toggleAutoMode() {
  isAutoMode.value = !isAutoMode.value
  if (isAutoMode.value) {
    currentStrategy.value = 'ai-bidding'
  }
}

function handleCharge() {
  if (isAutoMode.value) return
  const state = stationStates[selectedStationId.value]
  if (!state) return

  if (state.runStatus === 'charging') {
    // 再次点击 = 停止
    state.runStatus = 'idle'
  } else if (state.runStatus === 'discharging') {
    // 正在放电时不能直接切充电（参考v2逻辑）
    return
  } else {
    state.runStatus = 'charging'
  }
}

function handleDischarge() {
  if (isAutoMode.value) return
  const state = stationStates[selectedStationId.value]
  if (!state) return

  if (state.runStatus === 'discharging') {
    // 再次点击 = 停止
    state.runStatus = 'idle'
  } else if (state.runStatus === 'charging') {
    // 正在充电时不能直接切放电（参考v2逻辑）
    return
  } else {
    state.runStatus = 'discharging'
  }
}

// === Settings区 ===
const isEditMode = ref(false)
const chargeStopSOC = ref(75)
const dischargeStopSOC = ref(30)
const autoChargeStart = ref('09:00')
const autoChargeEnd = ref('13:00')
const autoDischargeStart = ref('17:00')
const autoDischargeEnd = ref('21:00')

function toggleEditMode() {
  isEditMode.value = !isEditMode.value
}
</script>

<style scoped>
/* === 控制面板容器 === */
.control-panel {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* === Header === */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.auto-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auto-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Toggle Switch */
.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  position: relative;
  transition: background var(--transition-fast);
}

.toggle-switch.active {
  background: var(--color-primary);
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform var(--transition-fast);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.toggle-switch.active .toggle-knob {
  transform: translateX(20px);
}

/* === 电站选择器 === */
.station-select {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font-sans);
  outline: none;
  cursor: pointer;
  transition: border-color var(--transition-fast);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.station-select:focus {
  border-color: var(--border-focus);
  background-color: var(--bg-input-focus);
}

.station-select option {
  background: #1a1a1a;
  color: #fff;
}

/* === 控制中心（Charge | 电价圈 | Discharge） === */
.control-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 8px 0;
}

/* Action Buttons */
.action-btn {
  padding: 12px 28px;
  border: none;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 110px;
}

.charge-btn {
  background: var(--color-primary);
  color: #000;
  box-shadow: 0 2px 12px rgba(0, 255, 136, 0.25);
}

.charge-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.35);
  transform: translateY(-1px);
}

.discharge-btn {
  background: #ffd700;
  color: #000;
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.25);
}

.discharge-btn:hover:not(:disabled) {
  background: #ffcc00;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.35);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* === 电价圈 === */
.price-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-normal);
}

.price-circle.price-high {
  background: radial-gradient(circle, #ff4757, #c0392b);
  box-shadow: 0 0 30px rgba(255, 71, 87, 0.4), 0 0 60px rgba(255, 71, 87, 0.15);
}

.price-circle.price-normal {
  background: radial-gradient(circle, #4a90e2, #2c5aa0);
  box-shadow: 0 0 30px rgba(74, 144, 226, 0.4), 0 0 60px rgba(74, 144, 226, 0.15);
}

.price-circle.price-negative {
  background: radial-gradient(circle, #00cc6a, #00ff88);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.15);
}

.price-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-mono);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.price-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
  text-align: center;
  line-height: 1.2;
}

/* === 电池SOC === */
.battery-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.battery-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 32px;
  font-family: var(--font-mono);
}

.battery-container {
  display: flex;
  align-items: center;
  flex: 1;
}

.battery-body {
  width: 100%;
  max-width: 200px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.battery-fill {
  height: 100%;
  border-radius: 4px;
  transition: width var(--transition-normal), background var(--transition-normal);
}

.battery-fill.soc-high {
  background: linear-gradient(90deg, var(--color-primary), #00cc6a);
}

.battery-fill.soc-mid {
  background: linear-gradient(90deg, #ffd700, #ffaa00);
}

.battery-fill.soc-low {
  background: linear-gradient(90deg, #ff4757, #ff6b6b);
}

.battery-tick {
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
}

.battery-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-mono);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.battery-terminal {
  width: 6px;
  height: 14px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 0 3px 3px 0;
  margin-left: 2px;
  flex-shrink: 0;
}

/* Status Badge */
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.status-charging {
  background: rgba(0, 255, 136, 0.15);
  color: var(--color-primary);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.status-discharging {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-idle {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* === 策略区 === */
.strategy-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-default);
}

.strategy-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.strategy-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.strategy-select {
  padding: 6px 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font-sans);
  outline: none;
  cursor: pointer;
  transition: border-color var(--transition-fast);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
}

.strategy-select:focus {
  border-color: var(--border-focus);
}

.strategy-select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.strategy-select option {
  background: #1a1a1a;
  color: #fff;
}

.strategy-value {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}

/* === 响应式 === */
@media (max-width: 768px) {
  .control-center {
    flex-direction: column;
    gap: 16px;
  }

  .action-btn {
    width: 100%;
    max-width: 200px;
  }

  .price-circle {
    width: 120px;
    height: 120px;
  }

  .price-value {
    font-size: 18px;
  }

  .battery-body {
    max-width: 150px;
  }
}

/* === Settings区 === */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--border-default);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.settings-edit-btn {
  padding: 4px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-default);
  background: transparent;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.settings-edit-btn:hover {
  background: var(--color-primary-dim);
  border-color: var(--color-primary);
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.settings-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.settings-value-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.settings-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.settings-input {
  width: 64px;
  padding: 4px 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font-mono);
  outline: none;
  text-align: center;
}

.settings-input.time-input {
  width: 88px;
}

.time-separator {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0 2px;
}

.settings-time-bar {
  display: inline-block;
  padding: 3px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
}

.charge-time-bar {
  background: rgba(0, 255, 136, 0.12);
  color: var(--color-primary);
  border: 1px solid rgba(0, 255, 136, 0.25);
}

.discharge-time-bar {
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.25);
}
</style>
