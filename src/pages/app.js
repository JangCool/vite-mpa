/**
 * MPA환경에서 공통으로 적용할 항목을 설정한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

import messages from '@intlify/vite-plugin-vue-i18n/messages'

import { createApp } from 'vue';
import { createHamonicaRouter } from '@/router';
import { createHamonicaStore } from '@/store';

import util from '@/utils/util'

import { createI18n } from 'vue-i18n'


/**
 * 각 page의 routes 설정 파일을 동적으로 지정한다.
 *    - getRoutes 함수 내에서 @/router/was.router.js 형식으로 조합 하여 routes객체를 설정한다.
 *    - 페이지 생성 후 새로운 routes 객체가 필요할 경우 /router 폴더에서 페이지명.router.js 형식으로 파일을 생성 한다.
 */

/**
 * 웹 어플리케이션(page)을 시작 한다.
 * 
 * @param {void} p 
 */
const app = function(p){

    var config = Object.assign({
        app : null,
        message : []
    },p);

    //전역으로 사용할 메세지 지정.
    config.message.push('common');

    const pathname  = document.location.pathname
    const app = createApp(config.app);
    
    //기본 모듈

    // Global Component
    

    // 테마 지정
    let body = document.querySelector("body");

    if(body){

        let theme = getTheme();
        if(!util.text.isBlank(theme)){
            body.classList.add(theme);
        }
    }

    //동적 route 설정.
    console.log("#### dynamic router")
    app.use(createHamonicaRouter())


    /**
     * 플러그인 설정
     */
    //app.use(utilsPlugin); //유틸 플러그인 초기화
    let currentLocale = getLocale();
    const i18n = createI18n({
        // legacy: false,
        locale: currentLocale,
        messages: (()=>{

            let returnMessage = {};

            for (const localeKey in messages) {
                const message = messages[localeKey];
                
                let keyArr = localeKey.split("_");
                //파일명이 비즈니스_로케일 형식이 아닐 경우 기본 인코딩 ko로 지정.. 추후에 자동지정??
                let locale = (keyArr.length < 2) ? 'ko' : keyArr[1];

                let customMessage = {};
                customMessage[locale] = message;

                returnMessage = util.object.merge(returnMessage, customMessage);
            }
            return returnMessage;

        })()
    });

    app.use(i18n); //국제화(i18n) 플러그인 초기화
    app.i18n = i18n;

    // // yup 검증 메세지 로케일 설정.
    // yupLocale(currentLocale);

    /**
     * 지시자 설정
     */
    // app.directive('focus', DirectiveFocus);
    // app.directive('highlight', DirectiveHighlight);

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
