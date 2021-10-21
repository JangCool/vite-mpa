/**
 * 데이터 검증에 사용하는 yup 모듈 적용시 국제화 처리에 필요.
 */

import { setLocale } from 'yup'

 const toString = Object.prototype.toString
const errorToString = Error.prototype.toString
const regExpToString = RegExp.prototype.toString
const symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => ''

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/

function printNumber(val) {
    if (val != +val) return 'NaN'
    const isNegativeZero = val === 0 && 1 / val < 0
    return isNegativeZero ? '-0' : '' + val
}

function printSimpleValue(val, quoteStrings = false) {
    if (val == null || val === true || val === false) return '' + val

    const typeOf = typeof val
    if (typeOf === 'number') return printNumber(val)
    if (typeOf === 'string') return quoteStrings ? `"${val}"` : val
    if (typeOf === 'function')
        return '[Function ' + (val.name || 'anonymous') + ']'
    if (typeOf === 'symbol')
        return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)')

    const tag = toString.call(val).slice(8, -1)
    if (tag === 'Date')
        return isNaN(val.getTime()) ? '' + val : val.toISOString(val)
    if (tag === 'Error' || val instanceof Error)
        return '[' + errorToString.call(val) + ']'
    if (tag === 'RegExp') return regExpToString.call(val)

    return null
}

function printValue(value, quoteStrings) {
    let result = printSimpleValue(value, quoteStrings)
    if (result !== null) return result

    return JSON.stringify(
        value,
        function(key, value) {
            let result = printSimpleValue(this[key], quoteStrings)
            if (result !== null) return result
            return value
        },
        2,
    )
}

const i18n = {
        en : {
            "mixed": {
                "default":"Value is invalid.",
                "required":"This is a required field.",
                "oneOf":"Must be one of the following values: ${values}.",
                "notOneOf":"Must not be one of the following values: ${values}.",
                "notType": ({ path, type, value, originalValue }) => {
                    let isCast = originalValue != null && originalValue !== value;
                    let msg =
                    `${path} must be a \`${type}\` type, ` +
                    `but the final value was: \`${printValue(value, true)}\`` +
                      (isCast
                        ? ` (cast from the value \`${printValue(originalValue, true)}\`).`
                        : '.');
                
                    if (value === null) {
                      msg += `\n If "null" is intended as an empty value be sure to mark the schema as \`.nullable()\``;
                    }
                
                    return msg;
                  },
                "defined":"Must be defined."
            },

            "string": {
                "length":"Must be exactly ${length} characters.",
                "min":"Must be at least ${min} characters.",
                "max":"Must be at most ${max} characters.",
                "matches":"Must match the following: \"${regex}\".",
                "email":"Must be a valid e-mail.",
                "url":"Must be a valid URL.",
                "uuid":"Must be a valid UUID.",
                "trim":"Must be a trimmed string.",
                "lowercase":"Must be a lowercase string.",
                "uppercase":"Must be a upper case string."
            },
            "number": {
                "min":"Must be greater than or equal to ${min}.",
                "max":"Must be less than or equal to ${max}.",
                "lessThan":"Must be less than ${less}.",
                "moreThan":"Must be greater than ${more}.",
                "positive":"Must be a positive number.",
                "negative":"Must be a negative number.",
                "integer":"Must be an integer."
            },

            "date": {
                "min":"Field must be later than ${min}.",
                "max":"Field must be at earlier than ${max}."
            },

            "boolean": {
                "isValue":"Field must be ${value}."
            },

            "object": {
                "noUnknown":"Field has unspecified keys: ${unknown}."
            },

            "array": {
                "min":"Field must have at least ${min} items.",
                "max":"Field must have less than or equal to ${max} items.",
                "length":"Must have ${length} items."
            }
        },
        ko : {
        "mixed": {
            "default":"올바르지 않습니다.",
            "required":"필수 항목 입니다.",
            "oneOf":"다음 값 중 하나여야 합니다: ${values}.",
            "notOneOf":"다음 아니여야 합니다: ${values}.",
            "notType": ({  type }) => {

                let convertLanguage = type;
                switch(type){
                    case "string" : 
                        convertLanguage = "문자";
                    break;
                    case "number" : 
                        convertLanguage = "숫자";
                    break;
                }

                let msg =
                `${convertLanguage} 유형만 입력가능 합니다.`
    
                return msg
            },
            "defined":"${path}을(를) 정의해야 합니다."
        },

        "string": {
            "length":"${length}자여야 합니다.",
            "min":"최소 ${min}자여야 합니다.",
            "max":"최대 ${max}자여야 합니다.",
            "matches":"다음 정규표현식을 만족해야 합니다: \"${regex}\".",
            "email":"올바른 이메일 형식이어야 합니다..",
            "url":"올바른 URL이어야 합니다.",
            "uuid":"올바른 UUID이어야 합니다.",
            "trim":"띄어쓰기를 시작과 끝에 포함하지 않는 문자열이어야 합니다.",
            "lowercase":"소문자이어야 합니다..",
            "uppercase":"대문자이어야 합니다."
        },
        "number": {
            "min":"${min}보다 크거나 같아야 합니다.",
            "max":"${max}보다 작거나 같아야 합니다.",
            "lessThan":"${less}보다 작아야 합니다.",
            "moreThan":"${more}보다 커야 합니다.",
            "positive":"양수여야 합니다.",
            "negative":"음수여야 합니다.",
            "integer":"정수여야 합니다"
        },

        "date": {
            "min":"필드는 ${min}보다 미래여야 합니다.",
            "max":"필드는 ${max}보다 과거여야 합니다"
        },

        "boolean": {
            "isValue":"${value}(이)여야 합니다"
        },

        "object": {
            "noUnknown":"지정되지 않은 키가 있습니다: ${path}"
        },

        "array": {
            "min":"${min}개 이상의 항목이 있어야 합니다..",
            "max":"${max}개보다 작거나 같아야 합니다..",
            "length":"${length}개의 항목이 있어야 합니다."
        }
    }
}

/**
 * 
 * @param {String} localeValue locale 값.  en, ko, ...
 */
const yupLocale = (localeValue) => {
    // if(localeValue !== 'en'){
        setLocale(i18n[localeValue] || {});
    // }

};

export {
    yupLocale
}