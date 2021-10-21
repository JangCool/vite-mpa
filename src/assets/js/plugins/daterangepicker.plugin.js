/**
 * Front-end에서 사용할 dateRangePicker를 적용한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

//daterangepicker
import { dateRangePicker } from '@/assets/js/daterangepicker/daterangepicker.min.js'
import '@/assets/css/daterangepicker/daterangepicker.min.css'

export default {
    
    // eslint-disable-next-line no-unused-vars
    install (app, options) {

        console.log('load dateRangePicker...');

        if(!window.dateRangePicker){
            window.dateRangePicker = dateRangePicker;
        }

    }
}
