/* eslint-disable no-unused-vars */

/**
 * 하모니카 topology에서 사용할 이벤트를 정의한다.
 * 
 * @author 송철현(sochu89@pionnet.co.kr)
 */

 const events = {
    
    /***
     * topology 객체 생성 되기전 초기화 작업.
     */
    initialize: function(){
        console.log("initailize");
    },
    node: {
        /**
         * master-detail 형식을 경우 detail 항목 생성.
         * @param cell detail 항목을 출력할 column cell HTMLElement
         * @param row detail 항목을 출력할 row 데이터
         */
        /***
         * cell click 시 발생하는 이벤트
         * 셀안의 버튼 클릭시 발생
         * 
         *  cell = 현재 클릭한 cell
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      rowData : row 데이터(item),
         *      value : 현재 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      left: 현재 cell의 left 위치 값,
         *      top: 현재 cell의 top 위치 값,
         *      right: 현재 cell의 right 위치 값,
         *      bottom: 현재 cell의 bottom 위치 값,
         *      html : html으로 cell에 출력될 경우 html 형식으로 출력,
         *      text : html으로 cell에 출력될 경우 문자열들만 뽑아서 문자열 형식으로 출력,
         *      dataType : 해당 열(컬럼)의 데이터 형식,
         *      isDetail : masterDetail 옵션 설정 시 detail row 인지 여부.
         * };
         */
        click : function (node) {
            console.log("node.click 이벤트가 구현되어 있지 않습니다.", node);
        },
        /***
         *  cell double click 시 발생하는 이벤트
         *
         *  cell = 현재 더블 클릭한 cell
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      rowData : row 데이터(item),
         *      value : 현재 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      left: 현재 cell의 left 위치 값,
         *      top: 현재 cell의 top 위치 값,
         *      right: 현재 cell의 right 위치 값,
         *      bottom: 현재 cell의 bottom 위치 값,
         *      html : html으로 cell에 출력될 경우 html 형식으로 출력,
         *      text : html으로 cell에 출력될 경우 문자열들만 뽑아서 문자열 형식으로 출력,
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        dblClick : function (cell){
            console.log("node.dblClick 이벤트가 구현되어 있지 않습니다.", node);
        },
        /***
         * cell을 마우스 오른쪽 버튼으로 클릭 시 발생하는 이벤트
         * 
         *  cell = 현재 클릭한 cell
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      value : 현재 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      left: 현재 cell의 left 위치 값,
         *      top: 현재 cell의 top 위치 값,
         *      right: 현재 cell의 right 위치 값,
         *      bottom: 현재 cell의 bottom 위치 값,
         *      html : html으로 cell에 출력될 경우 html 형식으로 출력,
         *      text : html으로 cell에 출력될 경우 문자열들만 뽑아서 문자열 형식으로 출력,
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        rightClick : function (node) {
            console.log("node.rightClick 이벤트가 구현되어 있지 않습니다.", node);
        },
    },
    edge: {
        /***
         * row 신규 내용 추가 후 발생 하는 이벤트
         * row : row 데이터
         * index : row 순서
         */
        rowAddedNew : function(row){
            console.log("row.rowAddedNew 이벤트가 구현되어 있지 않습니다.", row);
        },
        /***
         * row 내용 추가 후 발생 하는 이벤트
         * row : row 데이터
         * index : row 순서
         */
        rowAdded : function(row, index){
            console.log("row.rowAdded 이벤트가 구현되어 있지 않습니다.", row, index);
        },
        /***
         * row 선택 변경 시 발생하는 이벤트
         */
        selectedRowChanged : function(prevRow,currRow){
            console.log("row.selectedRowChanged 이벤트가 구현되어 있지 않습니다.", prevRow, currRow);
        },
        /***
         * row drag 시작시 발생 하는 이벤트
         */
        beginDrag : function(data){
            console.log("row.beginDrag 이벤트가 구현되어 있지 않습니다.", data);
        },
        /***
         * row drag 종료시 발생 하는 이벤트
         */
        endDrag : function(data){
            console.log("row.endDrag 이벤트가 구현되어 있지 않습니다.", data);
        }
    }
    /**
     * 서버에 데이터 호출 시 발생하는 이벤트
     * @param data 서버에 전송하는 파라메터 값. json객체.
     */
    // beginQuery : function(data){
    //     console.log("row.beginQuery 이벤트가 구현되어 있지 않습니다.", data);
    // },
    /**
     * 서버에 데이터 호출 종료 시 발생하는 이벤트
     * 
     * result = {
     *      status  : 응답 코드,
     *      message : 응답 메세지,
     *      type    : 에러 형식(pkg1.pkg2.ClassExection 형식으로 넘어 옴),
     *      data    : 응답 데이터
     *  }
     * @param result 서버 호출 이후 상태 값.
     */
    // endQuery : function(result){
    //     console.log("row.endQuery 이벤트가 구현되어 있지 않습니다.", result);
    // },
    /**
     * 서버에 데이터 저장 하기 전 발생하는 이벤트
     * @param data 서버에 전송하는 파라메터 값. json객체.
     */
    // beginSave : function(data){
    //     console.log("row.beginSave 이벤트가 구현되어 있지 않습니다.", data);
    // },
    /**
     * 서버에 데이터 저장 후 발생하는 이벤트
     * result = {
     *      status  : 응답 코드,
     *      message : 응답 메세지,
     *      type    : 에러 형식(pkg1.pkg2.ClassExection 형식으로 넘어 옴),
     *      data    : 응답 데이터
     *  }
     * @param result 서버 호출 이후 상태 값.
     */
    // endSave : function(result){
    //     console.log("row.endSave 이벤트가 구현되어 있지 않습니다.", result);
    // },
    /**
     * 서버에  doQuery 또는 doSave 이후 발생하는 이벤트
     * isError 값으로 에러 여부를 판별할 수 있다.
     * true 이면 에러, false이면 서버에 성공적으로 응답을 주고 받았다는 뜻이다.
     * 
     * result = {
     *      status  : 응답 코드,
     *      message : 응답 메세지,
     *      type    : 에러 형식(pkg1.pkg2.ClassExection 형식으로 넘어 옴),
     *      data    : 응답 데이터
     *  }
     * @param isError 에러 발생 여부.
     * @param result 서버 호출 이후 상태 값.
     */
    // complete : function(isError, result){
    //     console.log("row.complete 이벤트가 구현되어 있지 않습니다.", isError, result);
    // },
}

export default events;