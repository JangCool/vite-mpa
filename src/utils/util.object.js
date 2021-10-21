/* eslint-disable no-mixed-spaces-and-tabs */
/**
 * Front-end에서 사용할 Object 유틸 스크립트를 정의한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */
import _ from 'lodash';


const object = {

    /**
     * 
     * 객체의 값이 변경 되었는지 확인.
     * 
     * @param {Object} originalObject 원본 객체
     * @param {Object} newObject 변경된 객체
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2021.04.01
     */
    isChanged: (originalObject, newObject) => {
        return !_.isEqual(originalObject, newObject);
    },

    /**
     * 
     * 객체의 깊은 복사.
     * 
     * @param {Object} originalObject 원본 객체
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2021.04.01
     */
    cloneDeep: (originalObject) => {
        return _.cloneDeep(originalObject);
    },

    /**
     * 
     * 객체의 병합
     * 
     * @param {...Object} object 병합할 객체 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2021.04.01
     */
    merge: (object1, object2) => {
        return _.merge(object1, object2);
    },

    /**
     * 코드를 컴보 데이터로 변환 한다.
     * ex)
     * 	- 실행 
     * 		convertDataToCombo( [ {code : "SY001, codeName : "이름"} ] ,"code", "codeName");
     * 	- 결과
     * 		[ {cd : "SY001, cdNm : "이름"} ] -> [ {id : "SY001, name : "이름"} ] 변경
     * 
     * @param data 리스트 데이터
     * @param idKey id에 매핑할 데이터 키
     * @param nameKey name에 매핑할 데이터 키
     * @return [{}] 배열 json 데이터
     */
    convertDataToCombo: (data, idKey, nameKey) => {
   
    	if(data == null){
    		return null;
    	}
    	
    	var length = data.length;
    	
    	var newData = [];
    	for (var i = 0; i < length; i++) {
    		
    		var cdItem = data[i];
    		newData.push( {id : cdItem[idKey||"code"], name : cdItem[nameKey||"codeName"]});
		}
    	
    	return newData;
    }
}

export default object