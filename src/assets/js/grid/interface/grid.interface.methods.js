/* eslint-disable no-unused-vars */

/**
 * 하모니카 grid에서 사용할 컬럼을 정의 한다.
 * 
 * @author 장진철(zerocoldog@pionnet.co.kr)
 */

const methods = {
    /***
     * grid 데이터를 등록 한다.
     */
    setData : function(data){
        console.log("setData 함수가 구현되어 있지 않습니다.");
    },
    /** data 호출 
     * 
     *	var param = {
     *		url			:	저장할 url,
        *		form		:	form객체에 있는 input 값을 파라메터로 설정, 문자열 아이디, 또는 배열 아이디 지정. "form1" or ["form1, "form2"] 값이 중복될 경우 후순위가 적용된다.
        *		params		:	추가로 넘길 파라메터. 파라메터값이 중복 될 경우 해당 파라메터로 적용된다.
        *	};
        * @param param 서버에 전송할 파라메터 및 설정 값.
        */
    doQuery : function(param) {
        console.log("doQuery 함수가 구현되어 있지 않습니다.");
    },
    /** data 저장 
     * 
     *	var param = {
     *		url			:	저장할 url,
        *		status		:	저장할 상태값 지정 ROW_STATE.C,R,U,D
        *		checked		:	체크된 값만 저장,
        *		form		:	form객체에 있는 input 값을 파라메터로 설정, 문자열 아이디, 또는 배열 아이디 지정. "form1" or ["form1, "form2"] 값이 중복될 경우 후순위가 적용된다.
        *		multipart	:	multipart 저장 여부,
        *		params		:	추가로 넘길 파라메터. 파라메터값이 중복 될 경우 해당 파라메터로 적용된다.
        *	};
        * @param param 서버에 전송할 파라메터 및 설정 값.
        */
    doSave : function(param) {
        console.log("doSave 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 컬럼 추가 
     * 
     *	샘플)
        *	p = {
        *		id		: 추가할 기준이 될 열(컬럼) 아이디 = 기준 컬럼 바로 옆에 추가 된다.,
        *		next	: 기준 컬럼 오른쪽으로 추가
        *		prev	: 기준 컬럼 왼쪽으로 추가
        *		index	: 열(컬럼) 추가 위치 (생략 가능-특정 위치에 추가하고 싶을 때 사용),
        *		column	: 사용자 정의 컬럼 정보 {header : 컬럼 출력명, id : 컬러 아이디, dataType : 데이터 형식, ...}
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        * 
        */
    addColumn : function(p) {
        console.log("addColumn 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 컬럼 제거 
     * 
     *	샘플)
        *	p = {
        *		id		: 열(컬럼) 아이디,
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        * 
        */
    removeColumn : function(p) {
        console.log("removeColumn 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 컬럼 보임 
     * 
     *	샘플)
        *	p = {
        *		id		: 열(컬럼) 아이디,
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        * 
        */
    showColumn : function(p) {
        console.log("showColumn 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 컬럼 숨김
     * 
     *	샘플)
        *	p = {
        *		id		: 열(컬럼) 아이디,
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    hideColumn : function(p) {
        console.log("hideColumn 함수가 구현되어 있지 않습니다.");
    },
    /** 
     *	row 추가 
        *
        *	샘플)
        *	p = {
        *		row		: 추가 할 row 번호,
        *		data	: 그리드에 추가할 데이터 (JSON 형식) {id: "id", name : "name"}
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    addRow : function(p) {
        console.log("addRow 함수가 구현되어 있지 않습니다.");
    },
    /** 특정 row 이동 
     * 
     *	샘플)
        *	p = {
        *		currentRow	: 이동 시킬 행(대상) 번호,
        *		targetRow	: 이동 할 row 번호
        *	}
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    moveRow : function(p) {
        console.log("moveRow 함수가 구현되어 있지 않습니다.");
    },
    /** 특정 row 삭제 
     *
     *	p = {
     *		row	: 데이터를 삭제 할 row 번호.
        *	}
        *
        * @return {} Object 삭제 할 row 객체
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    deleteRow : function(p) {
        console.log("deleteRow 함수가 구현되어 있지 않습니다.");
    },
    /** 모든 row 삭제 
     * 
     * checked 속성이 없을 경우 :  모든 row 삭제, deleteRows() or  deleteRows({});;
     * checked 값이 true 일 경우 : checkebox가 선택 된 경우만 삭제,  deleteRows({checked:true});
     * checked 값이 false 일 경우 : checkebox가 선택 된 경우만 삭제,  deleteRows({checked:false});
     *
     *	p = {
     *		checked	: checkbox 선택 여부
        *	}
        *
        * @return [{},{}] Object 삭제 할 row object 정보를 담고있는 배열 객체
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    deleteRows : function(p) {
        console.log("deleteRows 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 새로 추가 된 row 삭제 
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    deleteCreateRows : function() {
        console.log("deleteCreateRows 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 데이터 변경 전 원본 데이터로 되돌아 간다.
     * row 값을 지정 하지 않으면 선택 되어 있는 row를 되돌린다.
     * id 값을 지정 하지 않으면 모든 컬럼 값을 되돌린다.
     * 
     *	샘플)
        *	p = {
        *		row		: 추가 할 row 번호,
        *		data	: 그리드에 추가할 데이터 (JSON 형식) {id: "id", name : "name"}
        *	}
        *
        * @param p
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    revert : function(p){
        console.log("revert 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * row 데이터 모두 제거
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    clearRows : function(p) {
        console.log("clearRows 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * row 체크박스 선택 
     * 
     *	p = {
     *		row	: row 번호
        *	}
        *
        * @param p 파라메터 정보
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    checkedRow : function(p) {
        console.log("checkedRow 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 특정 값을 가지고 있는 row만 선택 한다. 
     * 
     *	p = {
     *		id	: 컬럼 아이디,
        *		value : 컬럼 cell 값.
        *	}
        *
        * @param p 파라메터 정보
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    checkedRowsOnSpecificValue: function(p){
        console.log("checkedRowsOnSpecificValue 함수가 구현되어 있지 않습니다.");
    },
    
    /***
     * control checkbox 체크박스를 disabled 상태로 변환한다.
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 0
        *	}
        * @param p
        */
    disabledControlCheckBox : function(p){
        console.log("disabledControlCheckBox 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 전체 row 체크박스 선택 
     * 
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    checkedAllRow : function() {
        console.log("checkedAllRow 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * row 체크박스 선택 해제. 
     * 
     *	p = {
     *		row	: row 번호
        *	}
        *
        * @param p 파라메터 정보
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    unCheckedRow : function(p) {
        console.log("unCheckedRow 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 전체 row 체크박스 선택 해제
     *
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    unCheckedAllRow : function() {
        console.log("unCheckedAllRow 함수가 구현되어 있지 않습니다.");
    },
    /***
     * 현재 선택된 row 번호를 알려준다.
     * 
     * @return Number 선택 된 row 번호
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    selectedRowNumber : function() {
        console.log("selectedRowNumber 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 컬럼 아이디로 로우 데이터 가져오기
     * 
     *	샘플)
     *  id = 컬럼 아이디,
     *	p = {		            
     *      checked : null,
     *      status : ROW_STATUS.N,
     *      metadata : true,
     *      excludeColumn: []
     *	}
     * @param p 파라메터 정보
     * @return {} row 데이터. row가 존재 하지 않으면 null 리턴
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
     getRowById : (id, p) => {
        console.log("getRowById 함수가 구현되어 있지 않습니다.", id, p);
    },
    /** 
     * 로우 데이터 가져오기, row 번호를 넣지 않으면 0번째 데이터를 가져온다.
     * 
     *	샘플)
        *	p = {
        *		row	: 데이터를 읽을 row 번호.
        *	}
        * @param p 파라메터 정보
        * @return {} row 데이터. row가 존재 하지 않으면 null 리턴
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    getRow : function(p) {
        console.log("getRow 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 로우 데이터 여러건 가져오기 
     * 
     *	샘플)
        *	p = {
        *		checked : true면 체크된 데이터만, false면 체크여부 상관 없이 모든 데이터를 가져온다.
        *		status 	: C,U,D 값을 선택하여 호출 한다.
        *	}
        * @param p 파라메터 정보
        * @return [{}] row data가 들어있는 배열. 값이 존재 하지 않으면 null 리턴.
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    getRows : function(p) {
        console.log("getRows 함수가 구현되어 있지 않습니다.");
    },
    
    /** 
     * 로우 상태 값 포함 여부 
     * 
     *	샘플)
     *	p = {
     *		checked : true면 체크된 데이터만, false면 체크여부 상관 없이 모든 데이터를 가져온다.
     *		status 	: C,U,D 값을 선택하여 호출 한다.
     *	}
     * @param p 파라메터 정보
     * @return boolean 로우 상태 값이 들어있으면 true 아니면 false
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    includesStatus = (p) =>{
        console.log("includesStatus 함수가 구현되어 있지 않습니다.");

        return false;
    },
    
    /** 로우 갯수 
     * @return Number
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    getRowCount : function(p) {
        console.log("getRowCount 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 특정 cell에 새로운 값 추가
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호
        *		id 		: column 아이디
        *		value 	: 입력 값.
        *		force   : editable false 일 경우 강제 등록.
        *		css 	: 스타일 속성.
        *	}
        *
        * @param p 파라메터 속성.
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    setValue : function(p) {
        console.log("setValue 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 특정 row의 column에 위치한 값 가져오기.
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호
        *		id 		: column 아이디
        *	}
        *
        * @param p 파라메터 속성.
        * @return Object (String,Number,Boolean...)값이 없을 경우에는 null
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    getValue : function(p) {
        console.log("getValue 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 특정 row의 column에 위치한 cell 정보 가져오기.
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호
        *		id 		: column 아이디
        *	}
        *
        * @param p 파라메터 속성.
        * @return { id: , row: , value: , preValue: , orgValue: , html: , text: , dataType : }
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    getCell : function(p) {
        console.log("getCell 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 특정 row의 column에 위치한 cell 선택.
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호
        *		id 		: column 아이디
        *	}
        *
        * @param p 파라메터 속성.
        * @return { id: , row: , value: , preValue: , orgValue: , html: , text: , dataType : }
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    selectCell : function(p) {
        console.log("selectCell 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 특정 row 선택. 
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호
        *	}
        *
        * @param p 파라메터 속성.
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    selectRow : function(p) {
        console.log("selectRow 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * 필수 컬럼 데이터가 공백인지 검증. 검증이 올바르지 않으면 경고창을 출력한다.
     * 
     * @param alert 경고 창 출력 여부.
     * @return boolean
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    isValidRequired : function(p) {
        console.log("isValidRequired() 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * C,N,U,D 상태 변화,
     * 아무런 값이 없으면 0번째 row 상태가 N값으로 변경.
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 0
        *		status	: 상태 값,	기본 값	: N
        *		checked	: 선택 여부,	기본 값	: null
        *	}
        * @param p 파라메터 속성.
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    changeStatus : function(p) {
        console.log("changeStatus 함수가 구현되어 있지 않습니다.");
    },
    /** 
     *	Tree형 그리드 일 경우 행 추가.
        *
        *	샘플)
        *	p = {
        *		row		: 추가 할 row 번호,
        *		data	: 그리드에 추가할 데이터 (JSON 형식) {id: "id", name : "name"}
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */		
    addTreeRow : function(p) {
        console.log("addTreeRow 함수가 구현되어 있지 않습니다.");
    },
    /***
     * Tree형 그리드일 경우 현재 선택된 행의 부모 노드를 가져온다.
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 선택 된 row 번호
        *	}
        * @param p 파라메터 속성.
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    getParentNode : function(p) {
        console.log("getParentNode 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * Tree형 그리드 일 경우 해당 row 기준으로 모든 부모 및 자식 노드를 체크 선택 또는 체크 해제 한다.
     * 
     * 현재 row가 부모 노드가 없을 경우 -  현재 row만 체크.
     * 현재 row가 부모 노드가 있을 경우 -  상위 부모노드가 있을 경우 모두 체크
     * 현재 row가 자식 노드가 없을 경우 -  현재 row만 체크.
     * 현재 row가 자식 노드가 있을 경우 -  하위 자식노드가 있을 경우 모두 체크
     * 
     *	샘플)
        *	p = {
        *		id : 열(컬럼) 아이디,
        *		row : 행 번호,
        *		checked : 체크 여부
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    checkedNode : function(p){
        console.log("checkedNode 함수가 구현되어 있지 않습니다.");
    },				
    /** 
     * Tree형 그리드 일 경우 해당 row 기준으로 모든 부모 노드를 체크 선택 또는 체크 해제 한다.
     * 
     * 현재 row가 부모 노드가 없을 경우 -  현재 row만 체크.
     * 현재 row가 부모 노드가 있을 경우 -  상위 부모노드가 있을 경우 모두 체크
     * 
     *	샘플)
        *	p = {
        *		id : 열(컬럼) 아이디,
        *		row : 행 번호,
        *		checked : 체크 여부,
        *		refresh : 그리드 화면 갱신 여부. 특별한 경우에만 사용한다. 기본 true
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    checkedParentNode : function(p, self){
        console.log("checkedParentNode 함수가 구현되어 있지 않습니다.");
    },				
    /** 
     * Tree형 그리드 일 경우 해당 row 기준으로 모든 자식 노드를 체크 선택 또는 체크 해제 한다.
     * 
     * 현재 row가 자식 노드가 없을 경우 -  현재 row만 체크.
     * 현재 row가 자식 노드가 있을 경우 -  하위 자식노드가 있을 경우 모두 체크
     * 
     *	샘플)
        *	p = {
        *		id : 열(컬럼) 아이디,
        *		row : 행 번호,
        *		checked : 체크 여부,
        *		refresh : 그리드 화면 갱신 여부. 특별한 경우에만 사용한다. 기본 true
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    checkedChildNode : function(p,self){
        console.log("checkedChildNode 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * Tree형 그리드 일 경우 현재 node에서 하위 자식노드 값을 가져온다. 하위 자식노드의 자식노드는 가져오지 않는다.
     * 
     * 
     *	샘플)
        *	p = {
        *		id : 열(컬럼) 아이디,
        *		row : 행 번호,
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    getChildNode : function(p){
        console.log("getChildNode 함수가 구현되어 있지 않습니다.");
    },
    /** 
     * Tree형 그리드 일 경우 현재 node에서 하위 자식노드가 있는지 여부 확인
     * 
     * 
     *	샘플)
        *	p = {
        *		id : 열(컬럼) 아이디,
        *		row : 행 번호,
        *	}
        *
        * @author 장진철(zerocooldog@pionnet.co.kr)
        */
    hasChildNode : function(p){
        console.log("hasChildNode 함수가 구현되어 있지 않습니다.");
    },
    /**
     * tree grid 일 경우에 자식이 있는 row일 경우 접어서 표현한다.
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 0
        *	}
        * @param p 
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    collapseRow : function(p){
        console.log("collapseRow 함수가 구현되어 있지 않습니다.");
    },
    /**
     * tree grid 일 경우에 자식이 있는 row일 경우 펼처서 표현한다.
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 0
        *	}
        * @param p 
        */
    expandRow : function(p){
        console.log("collapseRow 함수가 구현되어 있지 않습니다.");
    },
    /**
     * tree grid 일 경우에 자식이 있는 모든 row는 접어서(level 0) 표현한다.
     */
    collapseAll : function(){
        console.log("collapseAll 함수가 구현되어 있지 않습니다.");
    },
    /**
     * tree grid 일 경우에 자식이 있는 모든 접힌 row를 찾아 펼쳐서 표현한다.
     */
    expandAll : function(){
        console.log("expandAll 함수가 구현되어 있지 않습니다.");
    },
    /**
     * excel 파일에 있는 내용을 grid에 추가한다.
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 0
        *	}
        * @param p
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    importExcel : function(p){
        console.log("importExcel 함수가 구현되어 있지 않습니다.");
    },
    /**
     * grid에 있는 내용을 excel 파일로 내려받는다.
     * 
     *	샘플)
        *	p = {
        *		columnHeader 	: columnHeader 포함 여부, 기본 값	: true
        *		rowHeader 		: rowHeader 포함 여부,		기본 값	: false
        *	}
        *
        * @param p
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    exportExcel : function(p){
        console.log("exportExcel 함수가 구현되어 있지 않습니다.");
    },
    /**
     * grid내용을 서버에서 내려 받는다.
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    downloadExcel : function(p){
        console.log("downloadExcel 함수가 구현되어 있지 않습니다.");
    },
    /**
     * 그리드 내용을 pdf로 내려 받음
     * @param fileName 내려받을 pdf 파일 명
     */
    exportPdf : function(p){
        console.log("exportPdf 함수가 구현되어 있지 않습니다.");
    },
    /***
     * 데이터를 검색하여 해당 row로 이동 한다.
     *	샘플)
        *	p = {
        *		id 		: 컬럼 아이디,
        *		keyword : 검색 단어.
        *	}
        * @param p
        */
    searchRow : function(p){
        console.log("exportPdf 함수가 구현되어 있지 않습니다.");
    },
    /***
     * keyword에 부합하는 row만 화면에 출력 한다.
     *	샘플)
        *	p = {
        *		id 		: 컬럼 아이디,
        *		keyword : 검색 단어.
        *	}
        * @param p
        */
    filterRow : function(p){
        console.log("exportPdf 함수가 구현되어 있지 않습니다.");
    },
    /** 초기화 */
    restore : function(p) {
        console.log("restore 함수가 구현되어 있지 않습니다.");
    },
    /***
     * cell 배경색을 설정 한다.
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 0
        *		id 		: 컬럼 아이디,
        *		color   : 배경색 ex) #fff or rgb(000,000,000)
        *	}
        * @param p
        */
    setBackgroundColor : function(p){
        console.log("setBackgroundColor 함수가 구현되어 있지 않습니다.");
    },
    /**
     * column 객체에서 설정하지 않고 grid 함수를 이용하여 적용 한 스타일 제거.
     */
    removeCustomStyles : function(){
        console.log("removeCustomStyles 함수가 구현되어 있지 않습니다.");
    },
    /**
     * masterDetail 옵션이 켜졋을 경우 사용 가능하다.
     * 특정 row의 detail 내용이 보여지는 상태인지 아닌지 알려준다.
     * 
     *	샘플)
        *	p = {
        *		row	: 데이터를 읽을 row 번호.
        *	}
        */
    isDetailVisible : function(p){
        console.log("isDetailVisible 함수가 구현되어 있지 않습니다.");
        
        return false;
    },
    /**
     * masterDetail 옵션이 켜졋을 경우 사용 가능하다.
     * 특정 row의 detail 내용을 보여준다.
     * 
     *	샘플)
        *	p = {
        *		row	: 데이터를 읽을 row 번호.
        *	}
        */
    showDetail : function(p){
        console.log("showDetail 함수가 구현되어 있지 않습니다.");
    },

    /**
     * masterDetail 옵션이 켜졋을 경우 사용 가능하다.
     * 특정 row의 detail 내용을 숨긴다.
     * 
     *	샘플)
        *	p = {
        *		row	: 데이터를 읽을 row 번호.
        *	}
        */
    hideDetail : function(p){
        console.log("hideDetail 함수가 구현되어 있지 않습니다.");
    },
    /**
     * 콤보박스 데이터를 동적으로 변경 한다.
     * 
     *	샘플)
        *	p = {
        *		id  	: 컬럼 아이디,
        *		row		: 데이터를 읽을 row 번호.
        *		combo	: 변경할 combobox 데이터.
        *	}
        */
    setDataOnComboBox : function(p){
        console.log("setDataOnComboBox 함수가 구현되어 있지 않습니다.");
    }
}

export default methods;