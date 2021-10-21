/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 하모니카 grid에서 사용할 상수를 정의 한다.
 * 
 * @author 장진철(zerocoldog@pionnet.co.kr)
 */

 
const constant = {
        

    /** grid 데이터에 설정 될 ROW_STATUS KEY */
    ROW_STATUS_KEY : "_R_S",
    /** grid 데이터에 설정 될 CHECKED KEY */
    CHECKED_KEY : "_CHECKED",
    /** grid 화면에 출력된 현재 상태의 INDEX KEY */
    GRID_INDEX_KEY : "_GRID_IDX",
    /** grid 데이터 추가 시 지정 되는 순번 INDEX KEY */
    INDEX_KEY : "_IDX",
    /** grid 데이터 추가 시 이미지 미리보기 컬럼일 설정 될 경우 BASE64 저장값을 호출 하는 KEY */
    PREVIEW_IMAGE_KEY  : "_PREVIEW_IMAGE",
    /** grid 데이터에 설정 될 Orignal value 앞 글자 */
    PREFIX_ORG_VALUE : "_OV_",
    /** grid 데이터에 설정 될 Previous value 앞 글자 */
    PREFIX_PRE_VALUE : "_PV_",
    /** doQuery 메소드 명*/
    METHOD_NAME_DOQUERY : "doQuery",
    /** doSave 메소드 명*/
    METHOD_NAME_DOSAVE : "doSave",

    /**
     *  selection mode 
     *  
     *  Row : 행 한 개씩만 선택
     *  RowRange : 행 범위 지정 선택(드레그가능)
     *  Cell : 열 한 개씩만 선택
     *  CellRange :열 범위 지정 가능(드레그가능)
     *  ListBox : 컨트롤 키 눌러 열 선택 지정 가능
     */
    SELECTION_MODE: {
        Row : wijmo.grid.SelectionMode.Row,
        RowRange : wijmo.grid.SelectionMode.RowRange,
        Cell : wijmo.grid.SelectionMode.Cell,
        CellRange : wijmo.grid.SelectionMode.CellRange,
        ListBox : wijmo.grid.SelectionMode.ListBox
    },
    DATA_TYPE :{
        String		: "String",
        Number		: "Number",
        Boolean 	: "Boolean",
        Date 		: "Date",
        Array 		: "Array",
        Level		: "Level",
        Hidden		: "Hidden"
    },
    CELL_TYPE :{
        BUTTON				: "button",
        BUTTON_HTML			: "buttonHtml",
        HTML				: "html",
        IMAGE	 			: "image",
        IMAGE_BUTTON		: "imageButton", //찾기버튼 아이콘 및 이미지를 보여줄 항목을 나타낸다.
        FILE	 			: "file",
        TEXT_DATE			: "textDate", // 2019.08.06 미 구현 보류.부분 구현.
        DATE_TIME			: "dateTime",
        COMBO_BOX			: "comboBox",
        CHECK_BOX			: "checkBox",
        MASK				: "mask",
        LEVEL				: "level",
        MULTI_SELECT		: "multiSelect", //2019.08.02 미 구현 보류. able안정화 되면 진행 할 예정.
        AUTO_COMPLETE		: "autoComplete" 

    },
    AGGREGATE :{
        SUM			: "Sum",
        AVG			: "Avg"
    },
    GRANDTOTAL_POSITION : {
        NONE : 'None',
        BELOW : 'Below',
        ABOVE : 'Above'
    },
    /**
     * 그리드 row 상태를 나타낸다.
     * N : 상태 없음. 단순 출력.,
     * C : row 추가
     * U : row cell 데이터 수정.
     * D : row 데이터 삭제.
     * A : 모든 데이터 출력.
     */
    ROW_STATUS : {
        "N" 	: "N",
        "C" 	: "C",
        "U" 	: "U",
        "D" 	: "D",
        "A" 	: "A"
    },
    /**
     * 그리드 row 데이터를 서버롤 보내기 위한 파라메터 키.
     * N : row 상태변화 없는 데이터 전송 키
     * C : row 추가 데이터 전송 키
     * U : row 수정 데이터 전송 키
     * D : row 삭제 데이터 전송 키
     * A : row 모든 데이터 전송 키
     */			
    GRID_PARAM_KEY : {
        "N" 	: "D_G_N",
        "C" 	: "D_G_C",
        "U" 	: "D_G_U",
        "D" 	: "D_G_D",
        "A" 	: "D_G_A"
    }
}

export default constant;