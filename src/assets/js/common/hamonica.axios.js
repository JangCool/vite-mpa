import axios from 'axios'
import constant from '../constant/constant';

/**
 * Axios 라이브러이 통신에 대한 기본 설정을 지정 한다.
 * 
 */
 //axios로 통신할 기본 URL 지정.
axios.defaults.baseURL = constant.VUE_APP_PROFILES_ACTIVE == 'local'? 'http://localhost:8501' : '';

axios.defaults.withCredentials = true;
// axios 인스턴스를 만들 때 구성 기본 값 설정
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// headers: { 'X-Requested-With': 'XMLHttpRequest' },
//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axios;
