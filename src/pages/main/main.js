import { createHamonicaApp } from '@/pages/app.js'
import MainApp from '@/pages/main/MainApp.vue'


//createApp을 createHamonicaApp 재정의 한다.
createHamonicaApp({app: MainApp})
