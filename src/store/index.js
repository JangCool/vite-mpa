import { createStore } from 'vuex'
// import rootStore from '@/store/root'

/**
 * createRouter 함수를 page 마다 개별적으로 분리하지 않고 하나의 함수로 처리하기 위하여 hamonicaRouter함수를 정의힌다.
 * 
 * @param p {routes: route URL을 정의한 객체}
 * @author 장진철 (zerocooldog@pionnet.co.kr)
 * @since 2020.07.01
 */

export const createHamonicaStore = function(p){

    //router 객체 및 기타 설정 값 정의.
    var config = Object.assign({
        modules : null
    },p);

    const store = createStore({
        modules : config.modules,
        // state () {
        //     return rootStore.state;
        // },
        // getters: rootStore.getters,
        // mutations: rootStore.mutations,
        // actions: rootStore.actions
    })


    return store;
}

