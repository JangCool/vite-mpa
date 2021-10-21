/**
 * Front-end에서 사용할 Text 유틸 스크립트를 정의한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

// import _ from 'lodash';

const number = {

    /**
     * -1일 경우 None 약자인 N/A값 출력.
     * 
     * @param {Number} value 
     * @returns String
     */
    NA : (value) => {
        return value === -1  ? 'N/A' : value;
    },
    /**
     * -1일 경우 0 값으로 반환.
     * @param {Number} value 
     * @returns Number
     */
    ZERO : (value) => {
        return value === -1  ? 0 : value;
    }
}

export default number