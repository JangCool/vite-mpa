import axios from './hamonica.axios'
import Cookies from 'js-cookie'

/**
 * uri 접근 허용 여부를 응답한다.
 * 
 * @return {} 응답 결과 { 
 *                          status : 상태코드, 
 *                          type : 에러유형 , 
 *                          message : 응답내용(에러 또는 정상 내용), 
 *                          auth : 인증 상태 구분 (S:성공, F: 실패, D: 접근 금지, U: 비인증)
 *                      }
 * 
 * @since 2020.12.10 10:54
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
async function allowedAccess(uri){

    let response = null;

    try {
        response = await axios.post(uri, null, {
            headers: {
                'H-Action-Type': 'Auth'
            }
        });

    } catch(e) {
        response = e.response;
    }

    return response; 
};

/**
 * 
 * URL 값으로 페이지를 이동 한다.
 * 
 * @param {string} url 이동할 페이지(주소) 
 * 
 * @since 2020.12.10 10:54
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
async function movePage(url) {
     
    let response  = await allowedAccess(url);

    if(
        // 비인증 상태이면 로그인 페이지로 이동
        response.status === 401 || 

        //로그 아웃 응답 상태가 정상이면 로그인 페이지로 이동.
        ("/login/logout-processing" === url &&response.status === 200)
    ){
        // alert.message(response.data.message)
        location.href="/user#/user/login";
        return;
    }

    location.href=url;

};

/**
 * 
 * view 유형을 설정 한다.
 * 
 * viewType : view 유형 { card = 카드형, grid = 그리드 형}
 * 
 * @param {String} key 뷰 유형 업무 구분. 
 * @param {String} viewType view 유형
 */
function setViewType(key, viewType) {
    Cookies.set(key +'-view-type', viewType, { expires: 365 });
}

/**
 * 
 * view 유형을 설정한 값 반환.
 *  
 * @param {String} key 
 * @return {String} view 유형 ex) view 유형 { card = 카드형, grid = 그리드 형}
 */
function getViewType(key) {
    return Cookies.get(key +'-view-type') || null;
}

/**
 * 컴포넌트 view 유형을 설정한 값 반환.
 * 
 * @param {String} key 값을 저장할 구분 값.
 * @return {String} 컴포넌트 명 ex) server-card
 */
const currentComponentViewType  = (key) => {
    return getViewType(key);
};

/**
 * 컴포넌트 view 유형을 설정한 값 반환.
 * 
 * @param {String} key 값을 저장할 구분 값.
 * @param {Stromg} componentName 컴포넌트 명 
 */
const setComponentViewType  = (key, componentName) => {
    setViewType(key, componentName)
};

export {
    allowedAccess,
    movePage,
    setViewType,
    getViewType,
    currentComponentViewType,
    setComponentViewType
}
