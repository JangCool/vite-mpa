/**
 * Front-end에서 사용할 Object 유틸 스크립트를 정의한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */
import _ from 'lodash';

const array = {

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
     * @param value 검증할 값 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    remove: (arrayValue, removeValue) => {
        
        return _.remove(arrayValue, (value) => {
            return value == removeValue;
        });
    },

    
    objectValueIncludes : function(arrayValue, field, conditionValue){

        for (let index = 0; index < arrayValue.length; index++) {
            const value = arrayValue[index][field];
            if(value == conditionValue) {
                return true;
            }
        }
        return false;
    },

    objectValueIndexOf : function(arrayValue, field, conditionValue){

        for (let index = 0; index < arrayValue.length; index++) {
            const value = arrayValue[index][field];
            if(value == conditionValue) {
                return index;
            }
        }

        return -1;
    }
}

export default array