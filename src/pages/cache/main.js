import { createHamonicaApp } from '@/pages/app.js'
import CacheApp from '@/pages/cache/CacheApp.vue'


//createApp을 createHamonicaApp 재정의 한다.
createHamonicaApp({app: CacheApp})
