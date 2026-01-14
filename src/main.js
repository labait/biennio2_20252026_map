import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueGoogleMaps from 'vue3-google-map'

const app = createApp(App)
app.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyBdOS8kOcnVjCVpsIrqbVyyFmM2eB9n4FA',
	},
})
app.mount('#app')
