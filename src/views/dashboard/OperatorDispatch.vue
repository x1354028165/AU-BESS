<template>
  <div class="operator-page">
    <!-- === 顶部指标卡片 === -->
    <section class="op-metric-cards">
      <div class="op-metric-card">
        <div class="op-metric-icon icon-charge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" />
            <line x1="23" y1="13" x2="23" y2="11" />
            <polyline points="11 6 7 12 13 12 9 18" />
          </svg>
        </div>
        <div class="op-metric-body">
          <span class="op-metric-label">Today Charge</span>
          <span class="op-metric-value">{{ totalCharge.toFixed(2) }}<small>MWh</small></span>
          <span class="op-metric-sub">Cost: ${{ Math.abs(totalChargeCost).toFixed(0) }}</span>
        </div>
      </div>

      <div class="op-metric-card">
        <div class="op-metric-icon icon-discharge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div class="op-metric-body">
          <span class="op-metric-label">Today Discharge</span>
          <span class="op-metric-value">{{ totalDischarge.toFixed(2) }}<small>MWh</small></span>
          <span class="op-metric-sub">Revenue: ${{ totalDischargeRevenue.toFixed(0) }}</span>
        </div>
      </div>

      <div class="op-metric-card">
        <div class="op-metric-icon" :class="netProfitTotal >= 0 ? 'icon-profit' : 'icon-loss'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div class="op-metric-body">
          <span class="op-metric-label">Net Profit</span>
          <span class="op-metric-value" :class="netProfitTotal >= 0 ? 'val-positive' : 'val-negative'">
            {{ netProfitTotal >= 0 ? '+' : '' }}${{ netProfitTotal.toFixed(0) }}
          </span>
          <span class="op-metric-sub" :class="vsYesterday >= 0 ? 'val-positive' : 'val-negative'">
            {{ vsYesterday >= 0 ? '▲' : '▼' }} {{ Math.abs(vsYesterday).toFixed(1) }}% vs Yesterday
          </span>
        </div>
      </div>
    </section>

    <!-- === Market 图表 === -->
    <section class="chart-section">
      <h2 class="chart-title">Market Overview — Price &amp; Demand (24h)</h2>
      <div ref="marketChartRef" class="chart-container"></div>
    </section>

    <!-- === Power & Profit 图表 === -->
    <section class="chart-section">
      <h2 class="chart-title">BESS Operations — Power &amp; Profit (24h)</h2>
      <div ref="powerProfitChartRef" class="chart-container"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getOperatorChartData } from '@/mock/dashboard'
import type { OperatorChartData } from '@/mock/dashboard'

// === 数据 ===
const chartData = ref<OperatorChartData>({ market: [], powerProfit: [] })

// === DOM refs ===
const marketChartRef = ref<HTMLElement | null>(null)
const powerProfitChartRef = ref<HTMLElement | null>(null)

// === ECharts 实例（shallowRef 避免 Vue 代理） ===
const marketChart = shallowRef<echarts.ECharts | null>(null)
const powerProfitChart = shallowRef<echarts.ECharts | null>(null)

// === 计算属性 ===
const totalCharge = computed(() =>
  chartData.value.powerProfit.reduce((sum, d) => sum + Math.abs(d.chargeEnergy), 0)
)
const totalChargeCost = computed(() =>
  chartData.value.powerProfit.reduce((sum, d) => sum + d.chargeCost, 0)
)
const totalDischarge = computed(() =>
  chartData.value.powerProfit.reduce((sum, d) => sum + d.dischargeEnergy, 0)
)
const totalDischargeRevenue = computed(() =>
  chartData.value.powerProfit.reduce((sum, d) => sum + d.dischargeRevenue, 0)
)
const netProfitTotal = computed(() =>
  chartData.value.powerProfit.reduce((sum, d) => sum + d.netProfit, 0)
)
const vsYesterday = computed(() => {
  // Mock: +12.5% vs yesterday
  return 12.5
})

// === Market 图表初始化 ===
function initMarketChart() {
  if (!marketChartRef.value) return
  marketChart.value = echarts.init(marketChartRef.value)

  const data = chartData.value.market
  const times = data.map(d => d.time)
  const historicalPrices = data.map(d => d.historicalPrice)
  const predictedPrices = data.map(d => d.predictedPrice)
  const demands = data.map(d => d.demand)
  const predictedDemands = data.map(d => d.predictedDemand)

  // 找当前时间索引（连接点）
  const currentIdx = data.findIndex(d => d.historicalPrice !== null && d.predictedPrice !== null)

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderColor: '#00ff88',
      borderWidth: 1,
      textStyle: { color: '#fff' },
      formatter(params: any) {
        let result = `<div style="font-weight:bold;margin-bottom:5px">${params[0].axisValue}</div>`
        params.forEach((p: any) => {
          if (p.value !== null && p.value !== undefined) {
            const isPriceSeries = p.seriesName.includes('Price')
            const val = isPriceSeries
              ? `$${typeof p.value === 'number' ? p.value.toFixed(2) : p.value}`
              : `${typeof p.value === 'number' ? p.value.toFixed(0) : p.value} MW`
            result += `<div>${p.marker} ${p.seriesName}: <strong>${val}</strong></div>`
          }
        })
        return result
      },
    },
    legend: {
      data: ['Historical Price', 'Predicted Price', 'Demand', 'Predicted Demand'],
      textStyle: { color: 'rgba(255,255,255,0.7)' },
      top: 10,
    },
    grid: {
      left: 60,
      right: 60,
      bottom: 40,
      top: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLine: { show: false },
      axisLabel: {
        color: 'rgba(255,255,255,0.7)',
        interval: 1,
        fontSize: 12,
      },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Price ($/MWh)',
        nameTextStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
        position: 'left',
        scale: true,
        axisLine: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.7)',
          formatter: '${value}',
        },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed', width: 1 },
        },
      },
      {
        type: 'value',
        name: 'Demand (MW)',
        nameTextStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
        position: 'right',
        scale: true,
        axisLine: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.7)',
          formatter: '{value} MW',
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Historical Price',
        type: 'line',
        data: historicalPrices,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#00ff88', width: 3 },
        itemStyle: { color: '#00ff88' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,255,136,0.3)' },
            { offset: 1, color: 'rgba(0,255,136,0.05)' },
          ]),
        },
        markLine: currentIdx >= 0 ? {
          symbol: 'none',
          silent: true,
          data: [
            {
              xAxis: currentIdx,
              lineStyle: { color: 'rgba(255,255,255,0.4)', type: 'dashed', width: 2 },
              label: { show: false },
            },
          ],
        } : undefined,
      },
      {
        name: 'Demand',
        type: 'line',
        yAxisIndex: 1,
        data: demands,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#ffd700', width: 2 },
        itemStyle: { color: '#ffd700' },
      },
      {
        name: 'Predicted Price',
        type: 'line',
        data: predictedPrices,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#00ff88', width: 2, type: 'dashed' },
        itemStyle: { color: '#00ff88' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,255,136,0.15)' },
            { offset: 1, color: 'rgba(0,255,136,0.02)' },
          ]),
        },
      },
      {
        name: 'Predicted Demand',
        type: 'line',
        yAxisIndex: 1,
        data: predictedDemands,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#ffd700', width: 2, type: 'dashed' },
        itemStyle: { color: '#ffd700' },
      },
    ],
  }

  marketChart.value.setOption(option)
}

// === Power & Profit 图表初始化 ===
function initPowerProfitChart() {
  if (!powerProfitChartRef.value) return
  powerProfitChart.value = echarts.init(powerProfitChartRef.value)

  const data = chartData.value.powerProfit
  const times = data.map(d => d.time)

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.92)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter(params: any) {
        const time = params[0].axisValue
        const lines = [`<b>${time}</b>`]
        params.forEach((p: any) => {
          if (p.value === null || p.value === undefined) return
          const isEnergy = p.seriesName.includes('MWh')
          let val: string
          if (isEnergy) {
            val = `${Math.abs(p.value).toFixed(2)} MWh`
          } else {
            val = `$${Math.abs(p.value).toFixed(0)}`
          }
          lines.push(`${p.marker} ${p.seriesName}: ${val}`)
        })
        return lines.join('<br>')
      },
    },
    legend: {
      data: ['Charge (MWh)', 'Discharge (MWh)', 'Charge Cost ($)', 'Discharge Revenue ($)', 'Net Profit ($)'],
      textStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
      top: 0,
      itemGap: 12,
      itemWidth: 14,
      itemHeight: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '14%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.6)', interval: 2 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'MWh',
        nameTextStyle: { color: 'rgba(255,255,255,0.6)' },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: 'rgba(255,255,255,0.6)' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      {
        type: 'value',
        name: 'AUD ($)',
        nameTextStyle: { color: 'rgba(255,255,255,0.6)' },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: 'rgba(255,255,255,0.6)', formatter: '${value}' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Charge (MWh)',
        type: 'bar',
        stack: 'energy',
        data: data.map(d => d.chargeEnergy),
        itemStyle: { color: 'rgba(0,255,136,0.7)', borderRadius: [0, 0, 3, 3] },
        barWidth: '35%',
      },
      {
        name: 'Discharge (MWh)',
        type: 'bar',
        stack: 'energy',
        data: data.map(d => d.dischargeEnergy),
        itemStyle: { color: 'rgba(255,193,7,0.8)', borderRadius: [3, 3, 0, 0] },
        barWidth: '35%',
      },
      {
        name: 'Charge Cost ($)',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.chargeCost),
        lineStyle: { width: 2, color: '#ff6b6b', type: 'dashed' },
        itemStyle: { color: '#ff6b6b' },
        symbol: 'none',
        smooth: true,
      },
      {
        name: 'Discharge Revenue ($)',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.dischargeRevenue),
        lineStyle: { width: 2, color: '#00ff88' },
        itemStyle: { color: '#00ff88' },
        symbol: 'none',
        smooth: true,
      },
      {
        name: 'Net Profit ($)',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.netProfit),
        lineStyle: { width: 3, color: '#ffd700' },
        itemStyle: { color: '#ffd700' },
        symbol: 'circle',
        symbolSize: 5,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255,215,0,0.15)' },
            { offset: 1, color: 'rgba(255,215,0,0)' },
          ]),
        },
      },
    ],
  }

  powerProfitChart.value.setOption(option)
}

// === resize handler ===
function handleResize() {
  marketChart.value?.resize()
  powerProfitChart.value?.resize()
}

// === 生命周期 ===
onMounted(() => {
  chartData.value = getOperatorChartData()
  initMarketChart()
  initPowerProfitChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  marketChart.value?.dispose()
  powerProfitChart.value?.dispose()
  marketChart.value = null
  powerProfitChart.value = null
})
</script>

<style scoped>
/* === 页面容器 === */
.operator-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: pageFadeIn 0.3s ease-out;
}

/* === 指标卡片 === */
.op-metric-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.op-metric-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.op-metric-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-elevated);
}

.op-metric-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.op-metric-icon svg {
  width: 22px;
  height: 22px;
}

.icon-charge {
  background: rgba(0, 255, 136, 0.12);
  color: #00ff88;
}

.icon-discharge {
  background: rgba(255, 193, 7, 0.12);
  color: #ffc107;
}

.icon-profit {
  background: rgba(0, 255, 136, 0.12);
  color: #00ff88;
}

.icon-loss {
  background: rgba(255, 71, 87, 0.12);
  color: #ff4757;
}

.op-metric-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.op-metric-label {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.op-metric-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  white-space: nowrap;
}

.op-metric-value small {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-tertiary);
  margin-left: 4px;
}

.op-metric-sub {
  font-size: 12px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.val-positive {
  color: #00ff88;
}

.val-negative {
  color: #ff4757;
}

/* === 图表区域 === */
.chart-section {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 20px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.chart-container {
  width: 100%;
  height: 400px;
}

/* === 响应式 === */
@media (max-width: 768px) {
  .op-metric-cards {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 300px;
  }
}
</style>
