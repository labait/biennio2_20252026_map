
<script setup>
import { ref, watch } from 'vue'
import { GoogleMap, AdvancedMarker, InfoWindow } from 'vue3-google-map'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const center = ref({ lat: 45.5416, lng: 10.2118 }) // Brescia

const fitBounds = () => {
  if (!props.items.length) return
  const bounds = new window.google.maps.LatLngBounds()
  props.items.forEach(item => {
    bounds.extend(new window.google.maps.LatLng(item.latitude, item.longitude))
  })
  const map = document.querySelector('.gmap-map')?.__vue__?.$mapObject
  if (map) {
    map.fitBounds(bounds)
  }
}

watch(() => props.items, fitBounds, { deep: true })
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
      v-for="(item, idx) in props.items"
      :key="item.id || idx"
      :options="{ position: { lat: Number(item.latitude), lng: Number(item.longitude) } }"
    >
      <InfoWindow>
        <div id="content">
          <div id="siteNotice"></div>
          <h1 class="font-bold text-lg mb-2">{{ item.name || item.title || 'Item' }}</h1>
          <div class="text-md max-w-60">
            {{ item.content || '' }}
          </div>
        </div>
      </InfoWindow>
    </AdvancedMarker>
  </GoogleMap>
</template>

