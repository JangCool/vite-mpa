/* eslint-disable no-unused-vars */

/**
 * 하모니카 grid에서 사용할 컬럼을 정의 한다.
 * 
 * @author 장진철(zerocoldog@pionnet.co.kr)
 */
 

const column = {

    /** 화면에 출력 할 컬럼 명 */
    header: null,
    /** JSON 데이터와 결합 할 Key 지정 (JSON Key) */
    id: null,
    /** Cell 편집 여부 */
    editable: false,
    /** Cell 좌,우,중앙 정렬 */
    align: "center",
    /** 데이터 정렬 여부 */
    sort: false,
    /** column 가로 크기 */
    width: 120,
    /** column 최소 가로 크기 */
    minWidth : null, 
    /** GRID 데이터 형식 */
    dataType: "String",
    /** cell 내용 format 데이터 형식에 따라 포맷을 달리 지정. */
    format : 'yyyy-MM-dd HH:mm:ss',
    /** cell 데이터 앞에 문자열 붙임. */
    prefix: null,
    /** cell 데이터 뒤에 문자열 붙임. */
    suffix: null,
    /** 
     *	cell Number 옵션 
        *
        *	설정 값 : { 
        *		max : 최대 값 ,
        *  	min : 최소 값,
        *		step : 버튼 클릭시 한번에 이동하는 간격 
        *	}
        */
    number : {
        max : null,
        min : null,
        step : 1
    },
    /** mask 패턴  */
    mask : null,
    /** combox로 출력할 데이터 [{id : 실제 값, name: 그리드에 보여줄 값. }] 형식*/
    combo: null,
    /** column 화면에 출력 여부. */
    visible: true,
    /** cell 내용 병합 여부. 같은 이름이 이어질 경우 하나의 cell로 병함.*/
    merge: false,
    /** 빈값 cell 내용 병합 여부. 공백 값이 이어질 경우 하나의 cell로 병합 하지 않음.*/
    notMergeEmptyValue: false,
    /** cell 내용 checkbox 설정.*/
    checkBox: {"Y" : "Y", "N" : "N"},
    /** cell 내용 밑줄표현 underline.*/
    underline : false,
    /** cell 내용 굴자 두께.*/
    bold : null,
    /** cell 내용 italic체.*/
    italic : null,
    /** cell 내용 폰트 색상.*/
    color : null,
    /** cell 내용 폰트 크기.*/
    fontSize : null,
    /** cell 글자 배경 색.*/
    foreColor : null,
    /** cell 배경 색.*/
    backColor : null,
    /** cell 내용 필수 여부. 공백 허용 안함.*/
    required: false,
    /** cell 내용 공백시 기본 데이터 지정. */
    defaultValue : "",
    /**cell에 출력할 형식을 지정한다. 버튼,버튼 html, 파일 업로드, 이미지 등 구분..*/
    cellType : null,
    /** cell 내용 입력 글자 제한. */
    maxLength: null,
    /** column 고정 여부. */
    frozen: false,
    /** css 클래스 명. */
    cssClass : false,
    /** html 내용. */
    html : null,
    
    filter: "",
    
    aggregate : null,
    
    /** 자동완성 데이터를 호출할 설정값 */
    autoComplete : {
        url : null, //검색 데이터를 호출 할 URL
        placeholder : "검색명 입력", //PlaceHolder내용
        displayField : null, //응답받은 데이터를 노출할 항목 설정.
        minLength : 2, //2자 이상 검색 시작.
        /***
         * 자동 완성 시 서버에 넘길 파라메터를 설정
         *	var cell = {
         *		id : 열(컬럼) 아이디,
            *		row : 행 번호
            * };
            * @param cell cell 정보
            * @param grid 그리드 객체.
            */
            params : function(cell, grid){
                return null;
            },
            
    },
    /**
     * 컬럼 CELL_TYPE이 COMBOBOX 일 경우 컬럼 헤더의 CHECKBOX 숨김 여부.
     */
    hideColumnHeaderCheckBox: false,
    /***
     * CELL_TYPE.FILE 인 컬럼 ID를 지정 한다.
     * CELL_TYPE.IMAGE 일 경우 미리보기 기능을 제공 하고 ROW 상태가 C(행 추가), U(행 업데이트) 상태에서만 사용가능 하다.
     * 
     * 기본 이미지 엘리먼트 사이즈 크기는 20x20이고 크기변경 할 때는 별도로 지정한다.
     * 
     */
    previewImageFile : {
        id : null,
        width : 20,
        height : 20
    }
}

export default column;