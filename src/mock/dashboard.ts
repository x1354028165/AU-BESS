// ============================================
// AU-BESS v3 — Mock Data Layer
// 澳洲储能电站静态数据 + TypeScript类型定义
// ============================================

// === 类型定义 ===

export interface Station {
  id: string
  name: string
  region: string
  capacity: number       // MW
  power: number          // MW (正=充电, 负=放电)
  soc: number            // 0-100%
  commStatus: 'online' | 'offline'
  runStatus: 'charging' | 'discharging' | 'idle'
  runMode: string
  todayProfit: number    // AUD
  totalProfit: number    // AUD
  brand: string
  model: string
}

export interface DashboardSummary {
  totalCapacity: number  // MWh
  totalPower: number     // MW
  todayRevenue: number   // AUD
  avgSpotPrice: number   // $/MWh
  alertCount: number
  stationCount: number
  onlineCount: number
}

// === 7个真实澳洲储能电站 ===

export const allStations: Station[] = [
  {
    id: 'AU0001',
    name: 'Hornsdale Power Reserve',
    region: 'SA',
    capacity: 50,
    power: -38.5,
    soc: 72,
    commStatus: 'online',
    runStatus: 'discharging',
    runMode: 'FCAS响应',
    todayProfit: 42150.80,
    totalProfit: 3850000.00,
    brand: 'Tesla',
    model: 'Megapack 2',
  },
  {
    id: 'AU0003',
    name: 'Victorian Big Battery',
    region: 'VIC',
    capacity: 45,
    power: 32.0,
    soc: 45,
    commStatus: 'online',
    runStatus: 'charging',
    runMode: '套利模式',
    todayProfit: 28900.50,
    totalProfit: 2150000.00,
    brand: 'Tesla',
    model: 'Megapack 2',
  },
  {
    id: 'AU0004',
    name: 'Wandoan BESS',
    region: 'QLD',
    capacity: 40,
    power: -25.3,
    soc: 61,
    commStatus: 'online',
    runStatus: 'discharging',
    runMode: 'VPP调度',
    todayProfit: 18500.00,
    totalProfit: 1620000.00,
    brand: 'Fluence',
    model: 'Gridstack',
  },
  {
    id: 'AU0005',
    name: 'Torrens Island BESS',
    region: 'SA',
    capacity: 35,
    power: 0,
    soc: 88,
    commStatus: 'online',
    runStatus: 'idle',
    runMode: '备用待命',
    todayProfit: 8200.30,
    totalProfit: 980000.00,
    brand: 'BYD',
    model: 'Cube Pro',
  },
  {
    id: 'AU0006',
    name: 'Capital Battery',
    region: 'ACT',
    capacity: 20,
    power: 15.8,
    soc: 33,
    commStatus: 'online',
    runStatus: 'charging',
    runMode: '套利模式',
    todayProfit: 12750.00,
    totalProfit: 1050000.00,
    brand: 'Samsung SDI',
    model: 'E3-R',
  },
  {
    id: 'AU0007',
    name: 'Kwinana BESS',
    region: 'WA',
    capacity: 30,
    power: -22.1,
    soc: 54,
    commStatus: 'online',
    runStatus: 'discharging',
    runMode: 'FCAS响应',
    todayProfit: 31200.00,
    totalProfit: 2780000.00,
    brand: 'LG Energy',
    model: 'RESU Prime',
  },
  {
    id: 'AU0008',
    name: 'Broken Hill Solar Farm',
    region: 'NSW',
    capacity: 25,
    power: 0,
    soc: 21,
    commStatus: 'offline',
    runStatus: 'idle',
    runMode: '维护模式',
    todayProfit: -2100.00,
    totalProfit: 890000.00,
    brand: 'Fluence',
    model: 'Gridstack',
  },
]

// === 根据电站列表计算概览 ===

export function computeSummary(stations: Station[]): DashboardSummary {
  const onlineStations = stations.filter((s) => s.commStatus === 'online')

  const totalCapacity = stations.reduce((sum, s) => sum + s.capacity, 0)
  const totalPower = stations.reduce((sum, s) => sum + s.power, 0)
  const todayRevenue = stations.reduce((sum, s) => sum + s.todayProfit, 0)

  // 模拟各区域现货电价 $/MWh (AEMO 真实范围)
  const spotPrices: Record<string, number> = {
    NSW: 87.5,
    VIC: 72.3,
    QLD: 95.1,
    SA: 110.8,
    WA: 68.4,
    TAS: 55.2,
    ACT: 82.6,
  }

  // 用电站所在区域的价格加权平均
  const avgSpotPrice =
    stations.length > 0
      ? stations.reduce((sum, s) => sum + (spotPrices[s.region] ?? 80), 0) / stations.length
      : 0

  return {
    totalCapacity,
    totalPower: Math.round(totalPower * 10) / 10,
    todayRevenue: Math.round(todayRevenue * 100) / 100,
    avgSpotPrice: Math.round(avgSpotPrice * 10) / 10,
    alertCount: 3,
    stationCount: stations.length,
    onlineCount: onlineStations.length,
  }
}
