/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import constant from "./interface/grid.interface.constant";
import column from "./interface/grid.interface.column";

const DATA_TYPE = constant.DATA_TYPE;
const CELL_TYPE = constant.CELL_TYPE;
// const ROW_STATUS = constant.ROW_STATUS;
class Column {

    #config;

    #controlVars;

    #configColumns;

    #columns;

    #columnsMap;

    #gridColumns;

    #containColumnMerge;

    constructor(p) {

        if(!p.config.columns ||  p.config.columns && p.config.columns.length == 0){
            throw "columns 정보가 존재 하지 않습니다.";
        }

        // 그리드 설정 값.
        this.#config = p.config;

        this.#controlVars = p.controlVars;

        //그리드 생성시 설정한 컬럼 정보.
        this.#configColumns = p.config.columns;

        //기본 컬럼 정보 병합 및 grid에 맞게 설정 한다.
        this.setColumns(this.#configColumns);
        
    }

    /**
     * 컬럼에 병합 값이 true경우 가 있는지 확인.
     */
    containColumnMerge = () => this.#containColumnMerge;

    /**
     * 사용자가 정의한 컬럼 정보.
     */
    getConfigColumns = () => this.#configColumns;

    /**
     * grid 조작시 사용할 컬럼 정보.
     * 사용자가 정의한 컬럼 정보가 적용되어 반환.
     */
    getColumns = () => this.#columns;

    /**
     * grid 조작시 사용할 컬럼 정보.
     * 사용자가 정의한 컬럼 정보가 적용되어 반환.
     * Key Value 형식으로 컬럼 정보 저장.
     * columnId 값으로 접근 가능.
     */
    getColumnsMap = () => this.#columnsMap;

    /**
     * grid 형식에 맞게 변경한 컬럼 정보.
     */
    getGridColumns = () => this.#gridColumns

    /**
     * config.columns 정보를 grid에서 처리할 수 있게 재 정의 한다.
     * 
     * @param {*} configColumn 
     */
    defineColumn = (configColumn) => {

        var isSort = this.#config.properties.sort;

        if(!configColumn.hasOwnProperty('editable')){
            configColumn.editable = this.#config.properties.editable;
        }

        //기본 정의 된 컬럼 정보와, 사용자가 전달한 컬럼 정보를 병합한다.
        let mergeColumn = _.merge({}, column, configColumn);

        var format = mergeColumn.format;
        if(mergeColumn.dataType == DATA_TYPE.Number && !mergeColumn.format){
            format =  "d*";
        }else if(mergeColumn.dataType == DATA_TYPE.Date && !mergeColumn.format){
            format =  "yyyy-MM-dd hh:mm";
        }

        // 컬럼 정보 병합 후 재 정의 필요시 설정.
        let defineColumn = Object.assign({}, mergeColumn, {
            visible : (mergeColumn.dataType == DATA_TYPE.Hidden) ? false : mergeColumn.visible,
            dataType : (mergeColumn.dataType == DATA_TYPE.Hidden) ? wijmo.DataType.String : wijmo.DataType[mergeColumn.dataType] || wijmo.DataType.String , // tui grid 는 string과 number 타입만 지원.
            // editable : (mergeColumn.dataType == DATA_TYPE.Level || mergeColumn.cellType == CELL_TYPE.CHECK_BOX) ? true : mergeColumn.editable,
            editable : (mergeColumn.dataType == DATA_TYPE.Level) ? true : mergeColumn.editable,
            format : format,
            sort : isSort && (mergeColumn.sort !== false) ? true : mergeColumn.sort
        });

        if (defineColumn.aggregate != null) { // 집계 사용 여부
            this.#controlVars.isAggregate = true;
        };

        return defineColumn;
    }

    /**
     * 정의된 컬럼 정보를 grid 형식에 맞게 변경한다.
     * 
     * @param {Object} defineColumn 
     * @param {Object} config 
     * @return {Object} tui grid 컬럼 정보.
     */
    convertGridColumn = (defineColumn) => {

        let convertColumn = {
            header : defineColumn.header,
            binding : defineColumn.id,
            name : defineColumn.id ,
            width : defineColumn.width,
            minWidth : defineColumn.minWidth,
            dataType : defineColumn.dataType,
            visible : defineColumn.visible,
            isRequired : defineColumn.required,				// FLEXGRID 자체 내에서 필수 검증 처리 한다.
            isReadOnly : !defineColumn.editable,
            allowSorting : defineColumn.sort,
            allowMerging : defineColumn.merge,
            align : defineColumn.align,
            showDropDown : true,
            // maxLength : defineColumn.maxLength,
            mask : defineColumn.mask,
            format : defineColumn.format,
            aggregate : defineColumn.aggregate
        };

        return convertColumn;
    }


    /**
     * 컬럼 정보를 설정 한다.
     * 
     * @param {Array} configColumns 
     */
    setColumns(configColumns) {

        if(!configColumns || configColumns && configColumns.length == 0){
            console.error("columns 정보가 존재 하지 않습니다.");
            return;
        }

        let configColumnsLength = configColumns.length;

        let columns = [];
        let columnMap = {}
        let gridColumn = [];

        for (let i = 0; i < configColumnsLength; i++) {

            let configColumn = configColumns[i];
            let defineColumn = this.defineColumn(configColumn);
            let convertColumn = this.convertGridColumn(defineColumn);
            
            				
            if(!this.#containColumnMerge && defineColumn.merge &&  defineColumn.merge === true){
                this.#containColumnMerge = true;
            }

            columnMap[defineColumn.id] = defineColumn;
            columns.push(defineColumn);
            gridColumn.push(convertColumn);
        }

        
        this.#columnsMap = columnMap;

        this.#columns = columns;
        
        this.#gridColumns = gridColumn;
    }

            
    /***
     * ControllCheckBox column 정보를 설정 한다. controllCheckBox는 2개의 컬럼이 추가 된다.
     * ControllCheckBox는 2개의 컬럼이 신규 추가 되며, 이용하지 않을 때는 row 상태 컬럼과, checked 컬럼 동시에 안보여야 한다.
     * 0번째 컬럼은 N(상태변화 없음),C(추가),U(편집),D(삭제) 정보가 표시 된다.
     * 1번째 컬럼은 row 선택 여부를 체크한다.
     * 해당 컬럼들은 merge 및 정렬 기능을 허용 하지 않는다.
     * 
     * @param grid 사용자 정의 컬럼 객체.
     * @param p .createGrid(p)함수에 넘기는 파라메터 정보.
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    setControllCheckBox = (self, grid)  => {
        
        let properties =  this.#config.properties;

        var setRowHeader = function(columnId,visible, width){
            
            var rowStatusRowHeader = new wijmo.grid.Column();
            rowStatusRowHeader.width = width || 22;
            rowStatusRowHeader.align = "center";
            rowStatusRowHeader.binding = columnId;
            rowStatusRowHeader.name = columnId;
            rowStatusRowHeader.visible = visible;
            rowStatusRowHeader.dataType = DATA_TYPE.String;
            rowStatusRowHeader.allowMerging = false;
            rowStatusRowHeader.allowSorting = false;		
            
            return rowStatusRowHeader;
        };
        grid.rowHeaders.columns[0].visible = !properties.hideLineNumber;
        grid.rowHeaders.columns.push(setRowHeader(constant.ROW_STATUS_KEY, !properties.hideStatusIconColumn)); // controll row status 컬럼
        grid.rowHeaders.columns.push(setRowHeader(constant.CHECKED_KEY, true, properties.controllCheckBoxWidth)); // controll checkbox 컬럼	

        //controller status, checkbox 컬럼 병합. columnheader가 1개행 이상일 경우에도 병함.
        this.setMergeCell(self, grid, {startRow :0, lastRow: grid.topLeftCells.rows.length -1,startCol : 1, lastCol : 2}, wijmo.grid.CellType.TopLeft, properties);
        
    }

    /***
     * columnHeader depth별로 merge하기 위하여 header정보를 설정한다.
     * @param grid 그리드 객체
     */
    setColumnHeaders = (self, grid) => {

        let properties =  this.#config.properties;
        var columnHeaders = properties.columnHeaders;
        
        if (columnHeaders && columnHeaders.length > 0) {

            var columnHeadersLength = columnHeaders.length;
            
            columnHeaders.reverse();

            // grid 속성 값으로 받은 columnheaders 값을 grid header row에 추가.
            for (var i = 0; i < columnHeadersLength; i++) {
                
                grid.columnHeaders.rows.push(new wijmo.grid.Row());
                
                //columnheaders0번째는 기본 컬럼 명임으로 넘어간다.  p.properties.columnheaders로 추가한 헤더 값은 1번째부터 시작된다.
                
                for (var col = 0; col < grid.columns.length; col++) {
                    
                    var columns = grid.columns[col];
                    var header = columns.header;
                    var columnId = columns.binding;
                    var columnHeadersRow = columnHeaders[i]; //columnHeaders : []
                    var columnHeadersRowHeaderLength = columnHeadersRow.length; //columnHeaders : [ [{header:'헤더', id:['컬럼아이디']},{header:'헤더', id:['컬럼아이디']}] ]
                    
                    for (var cli = 0; cli < columnHeadersRowHeaderLength; cli++) {
                        //컬럼 헤더 정보
                        var columnHeader = columnHeadersRow[cli];

                        //columnHeaders.id 배열 속성에 해당 컬럼 아이디 값이 존재하면 columnHeaders.header값을 설정한다.
                        //존재하지 않는 다면 column 기본 header값을 설정한다.
                        if(columnHeader.id.includes(columnId)){
                            grid.columnHeaders.setCellData(i, col, columnHeader.header);
                            break;
                        }else{
                            
//								var nextColumnHeader = columnHeaders[i+1];
//								grid.columnHeaders.setCellData(i, col, (nextColumnHeader && nextColumnHeader[cli]) ? nextColumnHeader[cli].header : header);
                            grid.columnHeaders.setCellData(i, col, header);
                        }
                    }
                }
            }
            
            //그리드 컬럼 헤더 병합 처리.
           this.setMergeCell(self, grid, null, null, properties);
        }
    }

    /***
     * columnHeader merge 및 cell내용을 custom merge 할 경우에 사용
     * @param grid 그리드 객체
     * @param p custom merge 할 정보. 원하는 row, col 위치 범위 지정.
     * @param cellType wijmo.grid.CellType 
     */
    setMergeCell = (self, grid, p, cellType, properties)  => {
            
        var isAddMerge = false;
        var mm = new wijmo.grid.MergeManager(grid);
        
        var pRng = (p) ? new wijmo.grid.CellRange(p.startRow, p.startCol , p.lastRow, p.lastCol) : null;
        
        var groupMergeIds = properties.groupMergeIds;
        
        var isDup = function(panel, row1, row2 ,col){
            var flag = false;
            
            for (var i = 0; i < groupMergeIds.length; i++) {
                var groupMergeColumn = grid.columns.getColumn(groupMergeIds[i]);
                flag = (panel.getCellData(row1 , groupMergeColumn.index, true) == panel.getCellData(row2, groupMergeColumn.index, true));
            }
            
            return flag;
        }
        
        mm.getMergedRange = function(panel, r, c,e) {
            
            var rg = new wijmo.grid.CellRange(r, c);

            //컬럼 헤더 그룹핑.
            if (panel.cellType == wijmo.grid.CellType.ColumnHeader) {
                for (let i = rg.col; i < panel.columns.length - 1; i++) {
                    if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i + 1, true))
                        break;
                    rg.col2 = i + 1;
                }
                for (let i = rg.col; i > 0; i--) {
                    if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i - 1, true))
                        break;
                    rg.col = i - 1;
                }
                for (let i = rg.row; i < panel.rows.length - 1; i++) {
                    if (panel.getCellData(i, rg.col, true) != panel.getCellData(i + 1, rg.col, true))
                        break;
                    rg.row2 = i + 1;
                }
                for (let i = rg.row; i > 0; i--) {
                    if (panel.getCellData(i, rg.col, true) != panel.getCellData(i - 1, rg.col, true))
                        break;
                    rg.row = i - 1;
                }

                // done
                return rg;
                
            }else if (panel.cellType == wijmo.grid.CellType.Cell){
                
                //컬럼 그룹 mergeId값이 지정 되어 있다면 지정된 컬럼 값에 따라 다른 컬럼 merge구분 처리.
                if(groupMergeIds != null && !groupMergeIds.includes( grid.columns[c].binding)){
                    
                    let allowMerging = grid.columns[c].allowMerging;
                    
                    if(!allowMerging){
                        return mm.__proto__.getMergedRange.call(this, panel, r, c,e);		
                    }
                    
                    for (let i = rg.row; i < panel.rows.length - 1; i++) {

                        if (!isDup(panel, i, i + 1, c) && allowMerging === true ){
                            break;
                        }
                        rg.row2 = i + 1;
                    }
                    for (let i = rg.row; i > 0; i--) {
                        if (!isDup(panel, i, i - 1, c) && allowMerging === true ){
                            break;
                        }
                        rg.row = i - 1;
                    }
                }else{
                    
                    let allowMerging = grid.columns[c].allowMerging;
                    
                    if(allowMerging){
                        let columnId = grid.columns[c].binding;
                        let userColumns = self.getColumn().getColumnsMap();
                        let userColumn = userColumns[columnId];
                        
                        //공백 값 병합 하지 않을 경우 처리.
                        if(userColumn != null && userColumn.notMergeEmptyValue === true){
                            let cellValue = grid.rows[r].dataItem[columnId];

                            if(rd.util.text.isBlank(cellValue)){
                                return rg;
                            }         						
                        }
                    }

                        //컬럼헤더 그룹핑이 아니면 기존에 설정되어있는 mergeRange 값을 가져와서 적용한다.
                    rg = mm.__proto__.getMergedRange.call(this, panel, r, c,e);	
                }
                
            }else{
                    //컬럼헤더 그룹핑이 아니면 기존에 설정되어있는 mergeRange 값을 가져와서 적용한다.
                    rg = mm.__proto__.getMergedRange.call(this, panel, r, c,e);	
            }
            
            if (cellType && panel.cellType === cellType) {
                    //MergeGroupAddRow 함수를 이용하여 셀 내용을 따로 병합할때 처리.

                if(p && pRng != null){
                    if (r >= p.startRow  && r <= p.lastRow ) {
                        if (r >= p.startRow && pRng.contains(r, c)) {
                            return pRng;
                        }	
                    }
                }
            }

            
            return rg;
        };

        grid.mergeManager = mm;
    }

}


export default Column;
