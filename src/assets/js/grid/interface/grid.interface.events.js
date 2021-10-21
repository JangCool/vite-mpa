/* eslint-disable no-unused-vars */

/**
 * 하모니카 grid에서 사용할 컬럼을 정의 한다.
 * 
 * @author 장진철(zerocoldog@pionnet.co.kr)
 */

const events = {
    
    /***
     * 그리드 객체 생성 되기전 초기화 작업.
     */
    initialize : function(){
        console.log("initailize");
    },
    style: { 

        /**
         * 셀안의 버튼 클릭시 발생
         * 
         *  cell = (열+행) 위치한 정보.
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
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        beforeUnderline: function(cell, value){
            // console.log("style.beforeUnderline 이벤트가 구현되어 있지 않습니다.", cell, value);
            return value;
        }
    },
    cell : {
        /**
         * master-detail 형식을 경우 detail 항목 생성.
         * @param cell detail 항목을 출력할 column cell HTMLElement
         * @param row detail 항목을 출력할 row 데이터
         */
        createDetailCell : function(cell, row){
            // console.log("cell.createDetailCell 이벤트가 구현되어 있지 않습니다.", cell, row);
            return cell;
        },
        /***
         * Controll columnHeader cell checkbox click 시 발생하는 이벤트
         * 
         *  cell = 현재 클릭한 cell
         *  var cell = {
         *      checked : 체크여부
         * };
         */
        clickControlAllCheckBox : function (cell) {
            // console.log("cell.clickControlAllCheckBox 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /***
         * Controll checkbox click 시 발생하는 이벤트
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
         * };
         */
        clickControlCheckBox : function (cell) {
            // console.log("cell.clickControlCheckBox 이벤트가 구현되어 있지 않습니다.", cell);
        },
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
        click : function (cell) {
            // console.log("cell.click 이벤트가 구현되어 있지 않습니다.", cell);
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
            // console.log("cell.dblClick 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /***
         * columnHeader cell checkbox click 시 발생하는 이벤트
         * 
         *  cell = 현재 클릭한 cell
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      checked : 체크여부,
         * };
         */
        clickAllCheckBox : function (cell) {
            // console.log("cell.clickAllCheckBox 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /***
         *  cell checkbox click 시 발생하는 이벤트
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
        clickCheckBox : function (cell){
            // console.log("cell.clickCheckBox 이벤트가 구현되어 있지 않습니다.", cell);
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
        rightClick : function (cell) {
            // console.log("cell.rightClick 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /***
         *  cell 내용 편집 시작 시 발생하는 이벤트
         *  cell = (열+행) 위치한 정보.
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      value : 현재 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      html : html으로 cell에 출력될 경우 html 형식으로 출력,
         *      text : html으로 cell에 출력될 경우 문자열들만 뽑아서 문자열 형식으로 출력,
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        beginEdit : function(cell){
            // console.log("cell.beginEdit 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /***
         *  cell 내용 편집 종료 시 발생하는 이벤트
         *  cell = (열+행) 위치한 정보.
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      value : 변경 된 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      html : html으로 cell에 출력될 경우 html 형식으로 출력,
         *      text : html으로 cell에 출력될 경우 문자열들만 뽑아서 문자열 형식으로 출력,
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        endEdit : function(cell){
            // console.log("cell.endEdit 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /***
         *  cell 내용이 원본 값이던 새로운 값이 던 데이터 변경이 경우 발생하는 이벤트.
         *  원본 값일 때 이벤트 발생하지 않고 새로운 값 변경시에만 이벤트를 발생 하고 싶을 경우 changedCellByNewValue 이벤트를 이용한다.
         *
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      value : 현재 변경 된 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        changedCell : function(cell){
            // console.log("cell.changedCell 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /***
         *  cell 내용이 원본 값이 아닌 새로운 값으로 변경 될 경우 발생하는 이벤트 
         *
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      value : 현재 변경 된 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        changedCellByNewValue : function(cell){
            // console.log("cell.changedCellByNewValue 이벤트가 구현되어 있지 않습니다.", cell);
        },                  
        /**
         * 셀안의 버튼 클릭시 발생
         * 
         *  cell = (열+행) 위치한 정보.
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      value : 현재 값,
         *      preValue : 변경 이전 값,
         *      orgValue : 원본 값,
         *      html : html으로 cell에 출력될 경우 html 형식으로 출력,
         *      text : html으로 cell에 출력될 경우 문자열들만 뽑아서 문자열 형식으로 출력,
         *      dataType : 해당 열(컬럼)의 데이터 형식
         * };
         */
        buttonClick: function(cell) {
            // console.log("cell.buttonClick 이벤트가 구현되어 있지 않습니다.", cell);
        },
        /**
         * 다중 선택 컬럼에서 항목 선택 및 해제 되었을 때 이벤트가 발생 한다.
         * 
         * var cell : { 
         *                  row : 현재 선택된 row 번호, 
         *                  id : 현재 선택된 컬럼 아이디, 
         *                  items : 모든 항목. 체크 여부 속성 포함. [{id : 선택 항목 값 , name : 선택 항목 명, checked : 체크여부 }], 
         *                  checked : 선택 된 항목   [{id : 선택 항목 값 , name : 선택 항목 명}], 
         *                  unChecked :  미 선택 항목    [{id : 선택 항목 값 , name : 선택 항목 명}]
         *              }
         */
        checkedMultiItemsChanged : function(cell){
            // console.log("cell.buttonClick 이벤트가 구현되어 있지 않습니다.", cell);
        },
        checkedMultiItems : function(cell){
            // console.log("cell.buttonClick 이벤트가 구현되어 있지 않습니다.", cell);
        },

        /***
         * IMGAE_AND_BUTTON Cell type시 이벤트가 실행 된다. 이미지를 cell에 보여줄 경우 이미지 URL경로 지정시 사용한다.
         * 
         *  var cell = {
         *      id : 열(컬럼) 아이디,
         *      row : 행 번호,
         *      value : 현재 변경 된 값,
         * };
         * 
         * @param cell cell 정보
         * @return String
         */
        convertImageUrl : function(cell){
            return cell || null;
        },
        /**
        * 셀 내용을 자동완성 기능을 통하여 등록한다.
            *  var cell = {
            *      id : 열(컬럼) 아이디,
            *      row : 행 번호,
            *      item : 자동완성 출력 후 선택 된 값,
            * };
        * @param cell cell 위치 정보 및 data 값
        */
        changeItemByAutoComplete : function(cell){
            // console.log("changeItemByAutoComplete 이벤트가 구현되어 있지 않습니다.", cell);
        },
    },
    row : {
        /***
         * row 신규 내용 추가 후 발생 하는 이벤트
         * row : row 데이터
         * index : row 순서
         */
        rowAddedNew : function(row){
            // console.log("row.rowAddedNew 이벤트가 구현되어 있지 않습니다.", row);
        },
        /***
         * row 내용 추가 후 발생 하는 이벤트
         * row : row 데이터
         * index : row 순서
         */
        rowAdded : function(row, index){
            // console.log("row.rowAdded 이벤트가 구현되어 있지 않습니다.", row, index);
        },
        /***
         * row 선택 시 발생하는 이벤트
         */
        selectedRow : function(currRow){
            // console.log("row.selectedRow 이벤트가 구현되어 있지 않습니다.", currRow);
        },
        /***
         * row 선택 한 상태에서 다른 row 로 선택 시 발생하는 이벤트
         */
        selectedRowChanged : function(prevRow,currRow){
            // console.log("row.selectedRowChanged 이벤트가 구현되어 있지 않습니다.", prevRow, currRow);
        },
        /***
         * row drag 시작시 발생 하는 이벤트
         */
        beginDrag : function(data){
            // console.log("row.beginDrag 이벤트가 구현되어 있지 않습니다.", data);
        },
        /***
         * row drag 종료시 발생 하는 이벤트
         */
        endDrag : function(data){
            // console.log("row.endDrag 이벤트가 구현되어 있지 않습니다.", data);
        }
    },
    paging : {
        /***
         * rowsPerPage combobox 선택이 변경 되면 이벤트를 발생시킨다.
         * @param selectValue 현재 변경된 값
         */
        changeRowsPerPage : function(selectValue){
            // console.log("paging.changeRowsPerPage 이벤트가 구현되어 있지 않습니다.", selectValue);
        },
        /**
         * 페이지 이동 시 이벤트 발생
         * page = {
         *      isFirst : 첫 페이지 클릭 여부,
         *      isPrevious : 이전 페이지 클릭 여부,
         *      isNext : 다음 페이지 클릭 여부,
         *      isLast : 마지막 페이지 클릭 여부,
         *      param : 서버에 넘길 파라메터 객체,
         * }
         * @param page 페이지 정보 {}
         */
        movePage : function(page){
            // console.log("paging.movePage 이벤트가 구현되어 있지 않습니다.", page);
        }
    },
    /**
     * 서버에 데이터 호출 시 발생하는 이벤트
     * @param data 서버에 전송하는 파라메터 값. json객체.
     */
    beginQuery : function(data){
        // console.log("row.beginQuery 이벤트가 구현되어 있지 않습니다.", data);
    },
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
    endQuery : function(result){
        // console.log("row.endQuery 이벤트가 구현되어 있지 않습니다.", result);
    },
    /**
     * 서버에 데이터 저장 하기 전 발생하는 이벤트
     * @param data 서버에 전송하는 파라메터 값. json객체.
     */
    beginSave : function(data){
        // console.log("row.beginSave 이벤트가 구현되어 있지 않습니다.", data);
    },
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
    endSave : function(result){
        // console.log("row.endSave 이벤트가 구현되어 있지 않습니다.", result);
    },
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
    complete : function(isError, result){
        // console.log("row.complete 이벤트가 구현되어 있지 않습니다.", isError, result);
    },
    /**
     * filterRow함수 종료 후 발생 하는 이벤트.
     * filterRow함수 실행 시 filter 조건에 부합하는 row 데이터를 넘겨준다.
     * 
     * @param data keyword에 부합하는 row 데이터. 배열로 넘어옴.
     */
    endFilter : function(data){
        // console.log("row.endSave 이벤트가 구현되어 있지 않습니다.", data);
    },
    /**
     * RowHeader = 맨 좌측 컨트롤 상태 아이콘, 체크박스 항목을 가리킨다.
     * 그리드 내용 출력시 RowHeader 내용을 편집 할 수 있도록 도움을 주는 이벤트
     *  cell = (열+행) 위치한 정보.
     *  
     *  var cell = {
     *      id : RowHeader 열(컬럼) 아이디,
     *      row : RowHeader 행 번호,
     *      col : RowHeader 열 번호,
     * };
     * 
     * 해당 이벤트에서 넘겨주는 row, col 정보는 Data출력에 사용하는 컬럼 row, col 하고 영역이 다르니 구분하길 바란다.
     * 
     * @param cell cell 정보
     * @param el html 객체
     */
    rowHeaderItemFormatter : function(cell, el){
        // console.log("rowHeaderItemFormatter 이벤트가 구현되어 있지 않습니다.", cell, el);
    },
    /**
     * 그리드 내용 출력시 셀 내용을 편집 할 수 있도록 도움을 주는 이벤트, itemformatter 실행 전에 처리.
     *  cell = (열+행) 위치한 정보.
     *  
     *  var cell = {
     *      id : 열(컬럼) 아이디,
     *      row : 행 번호,
     *      value : 현재 값
     * };
     * @param cell cell 정보
     * @param el html 객체
     */
    beforeItemformatter : function(cell, el){
        // console.log("beforeItemformatter 이벤트가 구현되어 있지 않습니다.", cell, el);
    },
    /**
     * 그리드 내용 출력시 셀 내용을 편집 할 수 있도록 도움을 주는 이벤트
     *  cell = (열+행) 위치한 정보.
     *  
     *  var cell = {
     *      id : 열(컬럼) 아이디,
     *      row : 행 번호,
     *      value : 현재 값
     * };
     * @param cell cell 정보
     * @param el html 객체
     */
    itemformatter : function(cell, el){
        // console.log("itemformatter 이벤트가 구현되어 있지 않습니다.", cell, el);
    },

    /**
     * 무한 스크롤. grid 세로 스크롤이 마지막 지점(하단)에 도착하면 이벤트가 발생한다.
     * 
     * @param {Number} scrollPostion 스크롤 위치. 
     */
    infiniteScroll : function(scrollPostion){
        // console.log("infiniteScroll 이벤트가 구현되어 있지 않습니다.", scrollPostion);
    }
}

export default events;