/**
 * Front-end에서 사용할 Text 유틸 스크립트를 정의한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

import text from "./util.text.js"
import number from "./util.number.js"
import date from "./util.date.js"
import array from "./util.array.js"
import object from "./util.object.js"
import chart from "./util.chart.js"
import _ from 'lodash';

/**
 * util 각각 항목에 위치하게 애매한 경우나 전역적으로 빼야할 경우 공통 유틸 함수를 이곳에서 정의한다.
 */
const globalUtil = {

    /**
     * 문자열인지 검증.
     * 
     * @param {String} text 문자열 값.
     * @returns boolean
     */
    isString : (text) => {
        return _.isString(text);
    },

    /**
     * 숫자인지 검증.z
     * 
     * @param {number} number 숫자 값.
     * @returns boolean
     */
    isNumber : (number) => {
        return _.isNumber(number);
    },

    /**
     * 참/거짓 인지 검증.
     * 
     * @param {Boolean} boolean 참/거짓 값.
     * @returns boolean
     */
    isBoolean : (boolean) => {
        return _.isBoolean(boolean);
    },
    
    /**
     * null 인지 검증.
     * 
     * @param {Object} value 대상 값
     * @returns boolean
     */
     isNull : (value) => {
        return _.isNull(value);
    },

    /**
     * 
     * 넘겨 값은 값이 빈 값인지 확인한다. 
     * 
     * @param value 검증할 값 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    isEmpty :(value) =>{
        return _.isEmpty(value);
    },

    /**
     * 
     * 넘겨 값은 값이 함수인지 확인한다. 
     * 
     * @param value 검증할 값 
     * @author 이승헌(lsh0872@pionnet.co.kr)
     * @since 2020.12.01
     */
    isFunction :(value) =>{
        return _.isFunction(value);
    },

    /**
     * {} Literal Object인지 검증
     * 
     * @param value 검증할 값 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    isPlainObject :(value) =>{
        return _.isPlainObject(value);
    }
    
};

/**
 * util을 업무별로 정의.
 */
const moduleUtils = {
    text,
    number,
    date,
    array,
    object,
    chart
};

export default {
    ...globalUtil,
    ...moduleUtils
}