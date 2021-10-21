/**
 * Front-end에서 사용할 유틸 스크립트를 적용한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import '../../css/sweetAlert2.custom.css'

export default {
    
    // eslint-disable-next-line no-unused-vars
    install (app, options) {

        console.log('sweetAlert2 override...');


        window.alert = {};

        //Brower alert 함수를 sweetAlert2 함수로 오버라이딩 한다.
        window.alert = function(p){
                       
            var swalConfig = Object.assign({
                icon : (arguments.length > 1) ? arguments[1] : null,
                confirmButtonText : app.i18n.global.t('common.btn.confirm'),
                cancelButtonText : app.i18n.global.t('common.btn.cancel'),
                html : ''
            }, (typeof(p) == 'string') ? {} : p);

            if(typeof(p) == 'string'){
                swalConfig.html = p;
            } else if(typeof(p) == 'object'){
                try{
                    swalConfig.html = p.text || '';                    
                }catch(e){
                    swalConfig.html = p.toString();                    
                }
            }

            return Swal.fire(swalConfig);
        };

        // //success 아이콘 출력.
        // window.alert.success = function(p){
        //     return window.alert.message(p, 'success');
        // };
        
        // //info 아이콘 출력.
        // window.alert.info = function(p){
        //     return window.alert.message(p, 'info');
        // };

        // //warning 아이콘 출력.
        // window.alert.warning = function(p){
        //     return window.alert.message(p, 'warning');
        // };

        // //warning 아이콘 출력.
        // window.alert.error = function(p){
        //     return window.alert.message(p, 'error');
        // };
    }
}
