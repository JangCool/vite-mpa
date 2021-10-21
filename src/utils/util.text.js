/**
 * Front-end에서 사용할 Text 유틸 스크립트를 정의한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

import _ from 'lodash';

const text = {

    /**
     * 넘겨 값은 값이 빈 값인지 확인한다. 
     * ps.공백을 빈값으로 처리.
     * 
     * @param value 검증할 값 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    isBlank : (value) => {
        return _.isEmpty(value) && !_.isNumber(value) || _.isNaN(value);
    },
    
    /**
     * 넘겨 값은 값이 빈 값인지 확인한다. 
     * ps.공백을 비어 있지 않다고 처리.
     * 
     * @param value 검증할 값 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    isEmpty :(value) =>{
        return _.isEmpty(value);
    },

    /**
     * JSON 객체 및 문자열을 보기 좋게 정렬하여 반환.
     * 
     * @param value 검증할 값 
     * @return String
     * 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2021.04.18
     */
    prettyJSON: (o) => {
        let pretty = null;
        if(typeof(o) == "string") {
            pretty = JSON.stringify(JSON.parse(o), null, 4);
        } else {
            pretty = JSON.stringify(o, null, 4);
        }

        return pretty;
    },
    /**
     * 문자열로 받은 true, false 값을 Boolean 형태로 변경.
     * @param {*} booleanStr 문자열 boolean
     */
    toBoolean: function(booleanStr){
        return (typeof(booleanStr) == "string" && booleanStr == 'true')
    }
}

export default text