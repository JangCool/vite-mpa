/**
 * Front-end에서 사용할 유틸 스크립트를 적용한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

import { useI18n } from 'vue-i18n'



export default {
    
    // eslint-disable-next-line no-unused-vars
    install (app, options) {

        const { t, locale } = useI18n();

        app.directive('message', {
            mounted (el, binding, vnode, oldVnode) {
            
                
                el.innerHTML = t(binding.value)
            }
        })

        app.mixin({
            created() {
            // some logic ...
            },
            message : (code) => {

            }

        });
    }
}
