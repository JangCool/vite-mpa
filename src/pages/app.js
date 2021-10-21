
import messages from '@intlify/vite-plugin-vue-i18n/messages'

import { createApp } from 'vue';
import { createHamonicaRouter } from '@/router';
import { createHamonicaStore } from '@/store';

import util from '@/utils/util'

import { createI18n } from 'vue-i18n'

import '@/assets/scss/hamonica.scss';
import 'bootstrap'


const app = function(p){

    var config = Object.assign({
        app : null,
        message : []
    },p);

    config.message.push('common');

    const pathname  = document.location.pathname
    const app = createApp(config.app);

    let body = document.querySelector("body");

    if(body){

        let theme = getTheme();
        if(!util.text.isBlank(theme)){
            body.classList.add(theme);
        }
    }


    app.use(createHamonicaRouter())

    let currentLocale = getLocale();
    const i18n = createI18n({
        // legacy: false,
        locale: currentLocale,
        messages: (()=>{

            let returnMessage = {};

            for (const localeKey in messages) {
                const message = messages[localeKey];
                
                let keyArr = localeKey.split("_");
                let locale = (keyArr.length < 2) ? 'ko' : keyArr[1];

                let customMessage = {};
                customMessage[locale] = message;

                returnMessage = util.object.merge(returnMessage, customMessage);
            }
            return returnMessage;

        })()
    });

    app.use(i18n);
    app.i18n = i18n;


    app.mount('#app');

    return app;
}


function getLocale(){

    let isEmpty = !localStorage.getItem('locale') || (localStorage.getItem('locale') && localStorage.getItem('locale') == "undefined");

    if(isEmpty){
        localStorage.setItem('locale', 'ko');
    }

    return localStorage.getItem('locale');
}

function getTheme(){

    let isEmpty = !localStorage.getItem('theme') || (localStorage.getItem('lothemecale') && localStorage.getItem('theme') == "undefined");

    if(isEmpty){
        localStorage.setItem('theme', '');
    }

    return localStorage.getItem('theme');
}

export const createHamonicaApp = function(p){
    app(p);
};
