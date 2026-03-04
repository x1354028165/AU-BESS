<template>
  <div class="map-page">
    <div class="map-header">
      <h2 class="map-title">{{ i18n.t('stationMap') }}</h2>
      <div class="map-legend">
        <span class="legend-item"><span class="legend-dot dot-online"></span>{{ i18n.t('online') }}</span>
        <span class="legend-item"><span class="legend-dot dot-maintenance"></span>{{ i18n.t('maintenance') }}</span>
        <span class="legend-item"><span class="legend-dot dot-offline"></span>{{ i18n.t('offline') }}</span>
      </div>
    </div>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useI18nStore } from '@/stores/i18nStore'

const i18n = useI18nStore()
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

interface Station {
  id: string
  name: string
  region: string
  lat: number
  lng: number
  capacity: string
  status: 'Online' | 'Maintenance' | 'Offline'
}

const stations: Station[] = [
  { id: 'HPR', name: 'Hornsdale Power Reserve', region: 'SA', lat: -32.5269, lng: 138.5148, capacity: '150MW/193.5MWh', status: 'Online' },
  { id: 'VBB', name: 'Victorian Big Battery', region: 'VIC', lat: -38.2065, lng: 144.3244, capacity: '300MW/450MWh', status: 'Online' },
  { id: 'QBES', name: 'Queensland BESS', region: 'QLD', lat: -27.4698, lng: 153.0251, capacity: '200MW/400MWh', status: 'Online' },
  { id: 'WBB', name: 'Waratah Super Battery', region: 'NSW', lat: -32.9283, lng: 151.7817, capacity: '850MW/1680MWh', status: 'Maintenance' },
  { id: 'ABB', name: 'Adelaide BESS', region: 'SA', lat: -34.9285, lng: 138.6007, capacity: '100MW/200MWh', status: 'Online' },
  { id: 'DBB', name: 'Darwin Battery', region: 'NT', lat: -12.4634, lng: 130.8456, capacity: '35MW/70MWh', status: 'Offline' },
  { id: 'PBB', name: 'Perth BESS', region: 'WA', lat: -31.9505, lng: 115.8605, capacity: '100MW/200MWh', status: 'Online' },
]

const statusColors: Record<string, string> = {
  Online: '#00ff88',
  Maintenance: '#ffaa00',
  Offline: '#ff4444',
}

function createMarkerIcon(status: string): L.DivIcon {
  const color = statusColors[status] || '#00ff88'
  return L.divIcon({
    className: 'custom-marker',
    html: `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill="${color}" fill-opacity="0.9"/>
      <circle cx="16" cy="15" r="7" fill="#000" fill-opacity="0.4"/>
      <circle cx="16" cy="15" r="4" fill="#fff"/>
    </svg>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

function createPopupContent(station: Station): string {
  const color = statusColors[station.status] || '#00ff88'
  const statusText = i18n.t(station.status.toLowerCase())
  return `
    <div class="station-popup">
      <div class="popup-name">${station.name} <span class="popup-region">(${station.region})</span></div>
      <div class="popup-row">
        <span class="popup-label">${i18n.t('capacity')}:</span>
        <span class="popup-value">${station.capacity}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">${i18n.t('status')}:</span>
        <span class="popup-status" style="color: ${color}">● ${statusText}</span>
      </div>
    </div>
  `
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: [-25.2744, 133.7751],
    zoom: 4,
    zoomControl: true,
    attributionControl: true,
  })

  const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  })

  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri',
    maxZoom: 18,
  })

  satelliteLayer.addTo(map)

  const baseMaps: Record<string, L.TileLayer> = {
    'Satellite': satelliteLayer,
    'Street': streetLayer,
  }
  L.control.layers(baseMaps, {}, { position: 'topleft' }).addTo(map)

  stations.forEach((station) => {
    if (!map) return
    const marker = L.marker([station.lat, station.lng], {
      icon: createMarkerIcon(station.status),
    }).addTo(map)

    marker.bindPopup(createPopupContent(station), {
      className: 'dark-popup',
      maxWidth: 280,
    })
  })
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px - 48px);
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.map-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.map-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-online {
  background: #00ff88;
}

.dot-maintenance {
  background: #ffaa00;
}

.dot-offline {
  background: #ff4444;
}

.map-container {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 400px;
}
</style>

<style>
/* Global Leaflet dark-theme overrides */
.map-container .leaflet-tile-pane {
  filter: brightness(0.85);
}

.leaflet-control-layers {
  background: rgba(0, 0, 0, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 8px !important;
  color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(12px);
}

.leaflet-control-layers-expanded {
  padding: 8px 12px !important;
}

.leaflet-control-layers label {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 13px;
}

.leaflet-control-zoom a {
  background: rgba(0, 0, 0, 0.85) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(12px);
}

.leaflet-control-zoom a:hover {
  background: rgba(0, 0, 0, 0.95) !important;
  color: #fff !important;
}

.leaflet-control-attribution {
  background: rgba(0, 0, 0, 0.6) !important;
  color: rgba(255, 255, 255, 0.4) !important;
  font-size: 10px !important;
}

.leaflet-control-attribution a {
  color: rgba(0, 255, 136, 0.6) !important;
}

.custom-marker {
  background: none !important;
  border: none !important;
}

.dark-popup .leaflet-popup-content-wrapper {
  background: rgba(10, 10, 10, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(16px);
}

.dark-popup .leaflet-popup-tip {
  background: rgba(10, 10, 10, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-top: none !important;
  border-left: none !important;
}

.dark-popup .leaflet-popup-close-button {
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 18px !important;
}

.dark-popup .leaflet-popup-close-button:hover {
  color: #fff !important;
}

.station-popup {
  padding: 4px 0;
}

.popup-name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  line-height: 1.3;
}

.popup-region {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
  font-size: 13px;
}

.popup-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  font-size: 13px;
}

.popup-label {
  color: rgba(255, 255, 255, 0.5);
}

.popup-value {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.popup-status {
  font-weight: 600;
  font-size: 13px;
}
</style>
