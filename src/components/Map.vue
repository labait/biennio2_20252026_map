
<script setup>
import { info } from 'sass'
import { ref, watch, computed } from 'vue'
import { GoogleMap, AdvancedMarker, InfoWindow } from 'vue3-google-map'

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
  <GoogleMap
    api-key="AIzaSyBdOS8kOcnVjCVpsIrqbVyyFmM2eB9n4FA"
    map-id="map1"
    :center="center"
    :zoom="12"
    style="width: 100%; height: 100%"
  >

    <AdvancedMarker 
      v-for="(item, idx) in props.items" :key="idx" :options="{ position: { lat: item.Latitude, lng: item.Longitude } }">
      <InfoWindow>
        <div id="content">
          <div id="siteNotice"></div>
          <h1 class="font-bold text-lg mb-2">{{ item.title }}</h1>
          <div class="text-md max-w-60">
            {{ item.content }}
          </div>
        </div>
      </InfoWindow>
    </AdvancedMarker>/>
  </GoogleMap>
</template>

