import { createApp } from 'vue'
import { createHamonicaRouter } from '../../router';
import App from './App.vue'

const app = createApp(App);
app.use(createHamonicaRouter())
.mount('#app')
