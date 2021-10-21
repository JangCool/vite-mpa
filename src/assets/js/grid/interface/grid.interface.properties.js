/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/**
 * 하모니카 grid에서 사용할 상수를 정의 한다.
 * 
 * @author 장진철(zerocoldog@pionnet.co.kr)
 */
const properties = {
        
    /** 서버 호출 기본 URL */
    url : null,
    /** 서버 호출 기본 METHOD */
    method: 'post',
    /** 서버에 데이터 전송할 기본 form id */
    form : null,
    /** 그리드 가로 길이 */
    width : "100%",
    /** 그리드 세로 길이 */
    height : "200px",
    /** 컬럼 정렬 기본 중앙 정렬 */
    align : "center",
    /** 그리드 cell 편집 여부 */
    editable: false,
    /** 그리드 cell 내용 정렬 여부 */
    sort: true,
    /** controll checkbox 출력 여부 */
    checkbox: false,
    /** 페이지 사용 여부 */
    pageable : false,
    /** 페이지당 보여줄 row 갯수 정의. */
    rowsPerPage : [10,30,50,100,200],
    /** rowPerPageComboBox 가로 크기. 단위) px */
    rowsPerPageWidth : 80,
    /**
     *  selection mode 
     *  
     *  Row : 행 한 개씩만 선택
     *  RowRange : 행 범위 지정 선택(드레그가능)
     *  Cell : 열 한 개씩만 선택
     *  CellRange :열 범위 지정 가능(드레그가능)
     *  ListBox : 컨트롤 키 눌러 열 선택 지정 가능
     */
   selectionMode : wijmo.grid.SelectionMode.RowRange,
    /** 내용에 따라 row 크기 자동 변환 여부 */
    autoRowResize : false,
    /** drag 여부 */
    rowDrag : false,
    /** drag 대상 */
    rowDragTarget :null,
    /** 데이터 호출 비동기 여부 */
    dataAsync : false,
    /** 클립보드 복사 여부 */
    clipboard : true,
    /** 클립보드 복사 여부 */
    clipboardNewRowAdd : false,
    /** 파일 업로드 여부 */
    multipart: false,
    /** tree {parentId : 부모 아이디, id : 기준 아이디}  */
    tree: {
        parent		: null , 
        id			: null, 
        sortAsc		: null, 
        sortDesc	: null
    },
    /** 새로운 데이터 grid 상단에 추가, true 일 경우 데이터가 많아지면 지연 현상 발생, false이면 하단에 추가되나 성능 저하 없음. */
    newRowAtTop : true,
    /** row 항목 좌측에 위치한 상태 및 체크박스 컬럼 보여주기 옵션 */
    hideCheckBox : false,
    /** 열 고정 번호 */
    frozenRow : -1,
    /** 행 고정 번호 */
    frozenColumn : -1,
    /** 파일 업로드 허용 확장자 */
    allowFileExtention : null,
    /** 이미지 업로드 허용 확장자 */
    allowImageExtention : null,
    /** 멀티 컬럼 헤더 기존 컬럼 헤더 이외로 여러 컬럼 헤더를 추가한다. */
    columnheaders : null,
    /**  총계 보여줄 행 위치 지정 */
    grandTotal : null,
    /**  column multi filter 사용 여부. */
    multiFilter : false,
    /** 
     * 서버 통신시 에러 발생 할 경우 alert 창 출력 여부.
     * false 일 경우 endQuery 및 endSave에서 응답 코드를 판단하여 직접 경고창 처리 한다.  
     * 
     * ex)
     * endSave : function(result){
     * 		if(result.status !== 200){
     *			alert("메뉴 입력중 에러가 발생 하였습니다." + result.message)
        *		}
        * }
        */
    alertError : true,
    /** row마다 상세 내용 보여줌. */
    isExpandMultiOnMasterDetail : false, 
    /** row 상세 내용을 보여줄 master-detail 여부를 설정한다 */
    masterDetail : false,
    /** row header 출력 여부 (맨 왼쪽에 있는 순번 및 상태,체크박스 항목) */
    hideRowHeader : false,
    /** row cell 높이 조절, 내용이 출력되는 column cell 영역 */
    rowsDefaultSize : 25,
    /** row header cell 높이 조절,  (맨 왼쪽에 있는 순번 및 상태,체크박스 항목) */
    rowHeaderHeight : 38,
    /** TopLeft영역 text 출력,  (맨 왼쪽에 TopLeft 영역) */
    topLeftText : null,
    /** columnheader cell 높이 조절  (맨 상단에 있는 컬럼 명 항목)*/
    columnHeaderHeight : 33,
    /** columnFooter cell 높이 조절  (맨 하단에 있는 사용자 정의 컬럼 항목)*/
    columnFooterHeight : 24,
    /** 좌측 게시물 번호 노출 여부.*/
    hideLineNumber: false,
    /** 좌측 게시물 번호 출력 여부.*/
    printLineNumber : true,
    /** 좌측 게시물 번호 노출 여부.*/
    lineNumberWidth : null,
    /**
     * 컨트롤 체크박스 가로 크기.
     */
    controllCheckBoxWidth:22,
    /** 컨트롤 체크박스 전체 선택 노출 여부,
     * 
     *  ex)
     *  	좌측에 위치한 컨트롤 체크박스가 무조건 1가지의 row만 선택 가능해야 할 경우 전체 선택 체크박스를 없앤다. 
     *  	또는 전체 선택 체크박스가 필요 없을 경우 없앤다.
     */
    hideSelectAllOnControlColumnHeader : false,
    /**
     * 컨트롤 체크박스 상태 아이콘 컬럼을 보여줄지 말지 설정한다.
     */
    hideStatusIconColumn : false,
    /** 
     * 특정 컬럼 내용 기준으로 병합한다. 그룹 기준이 될 컬럼 ID 지정
     * 
     * ---------------------------------------------------
     * A COLUMN                |     B COLUMN
     * ---------------------------------------------------
     * 아빠 10 값이다.            |     아들 홍길동
     * ---------------------------------------------------
     * 아빠 10 값이다.            |     아들 홍길동
     * ---------------------------------------------------
     * 엄마 20 값이다.            |     아들 홍길동
     * ---------------------------------------------------
     * 엄마 20 값이다.            |     아들 홍길동
     * ---------------------------------------------------
     * 
     * 해당 값이 지정 되지 않을 경우 
     * 	- A라는 컬럼이 병합되어 2가지의 CELL 값이 존재 할 경우 B라는 컬럼 값이 모두 같을 때 하나의 CELL 값으로 병함 된다. 
     * 
     * ---------------------------------------------------
     * A COLUMN                |     B COLUMN
     * ---------------------------------------------------
     *                         |    
     * 아빠 10 값이다.            |
     *                         |    
     * ------------------------|     아들 홍길동
     *                         |   
     * 엄마 10 값이다.            |
     *                         |  
     * ---------------------------------------------------
     * 해당 값이 지정 될 경우 
     * 	- A라는 컬럼이 병합되어 2가지의 CELL 값이 존재 할 경우 B라는 컬럼 값이 모두 같을 때 하나의 A컬럼에서 병합 된 기준으로 병함 된다. 
     * 
     * ---------------------------------------------------
     * A COLUMN                |     B COLUMN
     * ---------------------------------------------------
     *                         |    
     * 아빠 10 값이다.            |     아들 홍길동
     *                         |    
     * ------------------------|---------------------------
     *                         |   
     * 엄마 20 값이다.            |     아들 홍길동
     *                         |  
     * ---------------------------------------------------
     * */
    groupMergeIds : null
}

export default properties;