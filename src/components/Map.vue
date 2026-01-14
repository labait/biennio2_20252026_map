
<script setup>
import { ref, watch, computed } from 'vue'
import { GMapMap, GMapMarker, GMapInfoWindow } from 'vue3-google-map'

const props = defineProps({
  apiKey: String,
  items: Array
})

const infoWindowIdx = ref(null)
const center = ref({ lat: 45.5416, lng: 10.2118 }) // Brescia
const zoom = ref(12)

const fitBounds = () => {
  if (!props.items.length) return
  const bounds = new window.google.maps.LatLngBounds()
  props.items.forEach(item => {
    bounds.extend(new window.google.maps.LatLng(item.Latitude, item.Longitude))
  })
  const map = document.querySelector('.gmap-map')?.__vue__?.$mapObject
  if (map) {
    map.fitBounds(bounds)
  }
}

const openInfoWindow = idx => {
  infoWindowIdx.value = idx
}

watch(() => props.items, fitBounds)
</script>

<template>
  <GMapMap
    :center="center"
    :zoom="zoom"
    style="width: 100%; height: 500px"
    :options="{ mapTypeId: 'roadmap' }"
    @bounds_changed="fitBounds"
  >
    <GMapMarker
      v-for="(item, idx) in items"
      :key="idx"
      :position="{ lat: item.Latitude, lng: item.Longitude }"
      @click="openInfoWindow(idx)"
    />
    <GMapInfoWindow
      v-if="infoWindowIdx !== null"
      :options="{ pixelOffset: { width: 0, height: -30 } }"
      :position="{ lat: items[infoWindowIdx].Latitude, lng: items[infoWindowIdx].Longitude }"
      @closeclick="infoWindowIdx = null"
    >
      <div>{{ items[infoWindowIdx].Name }}</div>
    </GMapInfoWindow>
  </GMapMap>
</template>

