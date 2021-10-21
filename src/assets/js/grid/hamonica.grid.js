/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
// import constant from '@/common/constant/constant.js'
// import methods from '/static/interface/grid.interface.methods.js'

import axios from '../common/hamonica.axios.js'
import { param, paramFiles, serializeFiles, serializeObject } from '../common/hamonica.serialize.js'
import constant from './interface/grid.interface.constant.js'
import events from './interface/grid.interface.events.js'
import properties from './interface/grid.interface.properties.js'
import Column from './hamonica.grid.column.js'
import Common from './hamonica.grid.common.js'
import Formatter from './hamonica.grid.formatter.js'
import GridEvent from './hamonica.grid.events.js'
import UI from './hamonica.grid.ui.js'
import util from '../../../utils/util.js'


var getHtmlPreviewImage = function(userColumn, result){
    	
    var height = userColumn.previewImageFile.height;
    var style = "background-size: "+userColumn.previewImageFile.width+"px "+userColumn.previewImageFile.height+"px;width : "+userColumn.previewImageFile.width+"px; height:"+userColumn.previewImageFile.height+"px;";

    var html = "";
    html += "	<div class=\"grid-icon-wrap\" style='height:"+height+"px'>";
    if(result){
        html += "		<div class=\"butterfly-grid-icon-image preview\" style=\""+style+";background-image: url(\'"+result+"\')\"></div>";
    }else{
        html += "		<div class=\"butterfly-grid-icon-image preview\" style=\""+style+";\"></div>";
    }
    html += "	</div>";
    
    return html;
};

var previewImage = function(cell,item,userColumn){
    var reader = new FileReader();
    reader.onload = function (e) {

        var html = "";
        html += "<div class=\"butterfly-wj-cell-child\">";
        html += getHtmlPreviewImage(userColumn, e.target.result);
        html += "</div>";
        cell.innerHTML = html;
    }
    
    reader.readAsDataURL(item[userColumn.previewImageFile.id]);
};

/**
 * grid 관리 객체 초기화.
 */
window.bf = { grid : {} };

/**
 * 전역 객체로 grid 인스턴스 정보를 등록하여 관리 한다.
 */
window.bf.grid.instance = {};

/**
 * 전역 객체로 이벤트 함수를 등록하여 관리 한다.
 */
window.bf.grid.events = {
    /***
     * @author 장진철(zerocooldog@zen9.co.kr)
     */
    clickClearButtonToFile : function(e,gridId,row,col,columnId){
        
        var grid = bf.grid.instance[gridId];
        if(!grid){
            return;
        }

        console.log(grid.getControlVars())
        console.log(grid.getConfig())
        console.log(grid.getColumn())

        var common = new Common({
            controlVars : grid.getControlVars(), 
            config :  grid.getConfig(), 
            column : grid.getColumn()
        });
        
        e = e || event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;	

        var fileRow = grid.getRow({row : row});

        var value = fileRow[common.getOrgValueKey(columnId)] || null;
        grid.setValue({
            row : row,
            id : columnId,
            value : value,
            fileName : common.getFileName(value),
            force : true
        });
    },
    changeInputFile : function(e,gridId,row,col,columnId){
        
        if(!window.File || !window.FormData){
            console.error("File 또는 FormFile 객체를 지원하지 않아 해당 함수를 사용할 수 없습니다.");
            return;
        }
        
        var grid = bf.grid.instance[gridId];
        if(!grid){
            return;
        }

        var controlVars = grid.getControlVars();
        
        e = e || event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        
        
        //파일 입력이 처음 되는 것임으로 org 정보를 설정 한다.
        var item = grid.getGrid().rows[row].dataItem;

        
        //미리보기 컬럼이 존재 할 경우 이미지 파일이라 판단 하고 base64 이미지 문자열을 설정한다.
        if(controlVars.previewColumnId[columnId] === true){
            var reader = new FileReader();
            reader.onload = function (fe) {
                 item[constant.PREVIEW_IMAGE_KEY] = fe.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        
        grid.setValue({
            row : row,
            id : columnId,
            value : e.target.files[0] || null,
        });
    },
    clickButton : function(e,gridId,row,col,columnId){
        
        var grid = bf.grid.instance[gridId];
        if(!grid){
            return;
        }
        
        var events = grid.getConfig().events;
        
        e = e || event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        
        events.cell.buttonClick(grid.getCell({
            row : row,
            id : columnId,
        }));
    },
    clickCheckBox : function(e,gridId,row,col,columnId){

        var grid = bf.grid.instance[gridId];
        if(!grid){
            return;
        }

        var common = new Common({
            controlVars : grid.getControlVars(), 
            config :  grid.getConfig(), 
            column : grid.getColumn()
        });

        var events = grid.getConfig().events;
        var wijGrid = grid.getGrid();
                
        e = e || event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        
        var ht = wijGrid.hitTest(e);
        
        wijGrid.onBeginningEdit(ht.range);
        
        var column = wijGrid.columns[ht.col],
             userColumns = grid.getColumn().getColumnsMap(),
             userColumn = userColumns[columnId];
        
        var item = wijGrid.rows[ht.row].dataItem;
        var value = null;
        var checked = (e.checked !== undefined) ? e.checked : item[columnId] === userColumn.checkBox.Y ? true : false

        if(checked){
            e.checked = false;
            value = userColumn.checkBox.N;
        }else{
            e.checked = true;
            value = userColumn.checkBox.Y;
        }

        //값 설정
        item[columnId] = value;

        wijGrid.onCellEditEnded(ht.range);
        
        var orgValueKey = common.getOrgValueKey(columnId);
        var preValueKey = common.getPreValueKey(columnId);

        var rc = wijGrid.getCellBoundingRect(row, col);
        var cell = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
        
        var cellObject = {
            id : columnId,
            row : row,	
            rowData : item,	
            value: value,
            preValue : item[preValueKey],
            orgValue : item[orgValueKey],
            left: rc.left,
            top: rc.top,
            right: (rc.left + rc.width),
            bottom: (rc.top + rc.height),
            html : cell.innerHTML,
            text : cell.innerText,
            dataType : userColumn.dataType
        };

        events.cell.clickCheckBox(cellObject);	
    }

};



const ROW_STATUS = constant.ROW_STATUS;
const DATA_TYPE = constant.DATA_TYPE;
const CELL_TYPE = constant.CELL_TYPE;
class HamonicaGrid {
    
    /**
     * 그리드 조작시 필요한 변수 
     */
    #controlVars;

    /**
     * 그리드 설정 값.
     */
    #config;

    /**
     * wjimo 그리드 객체
     */
    #grid;

    /**
     * 컬럼 객체 - grid 및 사용자 컬럼 정의. 
     */
    #column;

    /**
     * grid tree 설정 값
     */
    #tree;

    /**
     * grid tree 여부.
     */
    #isTree;

    /**
     * wijmo grid에서 관리하는 데이터 객체.
     */
    #collectionView;

    #common;

    #formatter;

    #gridEvent;

    #ui;

    //grid row 상태 변화에 따라 데이터를 추적 보관 한다.
    #tracking = {
            "C" : [],
            "U" : [],
            "D" : []
    };

    /**
     * 그리드 객체 생성시 초기화 한다.
     * @param {Object} p grid 설정 정보
     */
    constructor(p) {


        // 그리드에서 사용할 파라메터 설정.
        this.#config  = {
            id : p.id || null,
            imageHome : '/static/images',
            element : p.element || (document.querySelector("#"+p.id) || null),
            theme: p.theme || 'normal',
            darkMode: p.darkMode || false,
            height : p.height || null,
            data : p.data || null,
            columns : p.columns || null,
            events : _.merge({}, events, p.events),
            properties :  _.merge({}, properties, p.properties)
        };

        //기본값 배열과 같이 병합되버리는 문제가 있어서 페이징 데이터는 교체를 한다.
        if(p.properties.rowsPerPage){
            this.#config.properties.rowsPerPage = p.properties.rowsPerPage;
        }

        this.#controlVars = this.#initControlVars();

        this.#tree = this.#config.properties.tree;

        this.#isTree = (this.#tree.parent != null && this.#tree.id != null);
        
        this.#column = new Column({
            controlVars : this.#controlVars, 
            config : this.#config
        });

        this.#common = new Common({
            controlVars : this.#controlVars, 
            config : this.#config, 
            column : this.#column
        });

        this.#formatter = new Formatter({
            instance : this,
            controlVars : this.#controlVars, 
            config : this.#config, 
            common : this.#common, 
            column : this.#column
        });

        this.#grid = this.#initGrid(this.#config);

        this.#gridEvent = new GridEvent({
            instance : this,
            controlVars : this.#controlVars, 
            config : this.#config, 
            common : this.#common, 
            column : this.#column, 
            grid : this.#grid
        });

        this.#ui = new UI(this.#config);

        this.#formatter.setCustomEditor(this, this.#grid);
		//페이징 처리 한다.
		if(this.#config.properties.pageable){
			this.#common.initPaging(this);
		}

        if(this.#config.data && this.#config.data.length > 0){
			this.#setCollectionView(this.#grid , this.#config.data);			
        }

        this.setTheme(this.#config.theme, this.#config.darkMode);
    }
    /**
     * 테마 설정
     */
    setTheme = (theTheme, isDarkMode) => {
        
        let themeName = theTheme.toLowerCase();

        // build theme URL
        var cssRoot = '/static/css/grid/wijmo';
        var url = `${cssRoot}/theme/${themeName}/wijmo.theme.${themeName}${isDarkMode === true ? '.dark' : ''}.css`;

        let themes  = document.querySelectorAll('link[href*=wijmo\\.theme]');

        let isDup = false;

        //기존 테마 제거.
        themes.forEach(css => {

            if(!css.href.endsWith(url)){                    
                css.remove();
            }else{  
                isDup = true;              
            }
        });

        if(isDup === true){
            return;
        }

        // apply theme url to page
        var links = document.getElementsByTagName('link'),
            lastLink = links[links.length -1];

        if (lastLink.href.indexOf('themes/wijmo.theme.') > -1) {
            lastLink.href = url; // change last link
        } else { // append link
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            lastLink.parentElement.appendChild(link);
        }
    }

    /**
     * wjimo grid 객체 반환.
     * 
     * @return {FlexGrid}.
     */
    getGrid = () => {
        return this.#grid;
    }

    /**
     * grid data 관리 객체 반환.
     * 
     * @return {CollectionView}.
     */
    getCollectionView = () => {
        return this.#collectionView;
    }

    /**
     * 컬럼 정보를 가지고 있는 객체 반환.
     * 
     * @return {Column}.
     */
    getColumn = () => this.#column;

    /**
     * grid 조작에 필요한 변수 모음 객체 반환.
     * 
     * @return {Literal Object}.
     */
    getControlVars = () => this.#controlVars;

    /**
     * grid 설정 객체 반환.
     * 
     * @return {Literal Object}.
     */
    getConfig = () => this.#config;

    /**
     * grid id 값 반환.
     * 
     * @return {String} grid id 값.
     */
    getId = () =>  this.#config.id;

    /**
     * grid id 값 반환.
     * 
     * @return {String} grid id 값.
     */
    getTracking = () =>  this.#tracking;

    /**
     * 신규 row 추가 여부.
     * 
     * @return {boolean}
     */
    getRefreshAddRow = () => this.#controlVars.refreshAddRow;

    /**
     * 신규 row 추가할 경우 true값을 설정한다.
     * @param bool 신규 row 추가 여부.
     */
    setRefreshAddRow = (bool) => {
        this.#controlVars.refreshAddRow = bool;
    }

    /**
     * grid 작업에 필요한 변수들을 초기화 한다.
     */
    #reset = () => {
        this.#controlVars = this.#initControlVars();
    }

    /**
     * 그리드 조작시 사용하는 변수들을 정의.
     * 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    #initControlVars = () => {

        return {
				
            previewColumnId : {},
            
            //cell 별 편집 여부 설정. 각각 셀마다 편집 여부를 정의한다.
            editableCells : {},
            
            //cell 스타일을 정의 한다.
            styleCells : {},
            
            //컨트롤 체크박스를 disable 한다.
            disabledControlCheckBox : {},

            
            // ※중요 : 
            // wijmo5 grid는 row를 신규 추가 할 때 grid의 맨 하단 부터 등록 되게 되어있다(성능상 문제)
            // 하지만 신규 row 추가시 grid상단에 추가 되어야 하는 상황도 있다.([properties.newRowAtTop = true] 설정할 경우)
            // wjimo5는 collectionView를 통하여 데이터를 관리 하는 데 이때 신규 row를 collectionView를 이용하여 등록 후 refresh()이용하여 갱신해 주어야 한다.
            // 이때 모든 row를 불러왔다는 loadedRows 이벤트가 호출 되는데 우리는 이때 loop를 통하여 rowAdded 이벤트를 발생 시킨다.
            // 단순히 신규 row를 추가 했을 경우 해당 이벤트가 발생한다는 것은 오작동이기 때문에 refreshAddrow 값을 통하여 신규 row가 추가되면 rowAdded이벤트가 발생하지
            // 않도록 한다.
            refreshAddRow : false,
            
            //이전 선택 된 row
            prevSelectRow : -1,
            
            //현재 선택 된 row
            selectRow : -1,
            
            //현재 선택 된 column
            selectColumn : null,
            
            //클립보드에 데이터를 복사하면 선택된 row 객체를 담는다.
            //이 정보로 후에 paste 이벤트 발생시 새로운 row 데이터로 추가한다. 단. clipboardNewRowAdd 속성이 true 이어야 한다.
            clipboard : {
                rows : []
            },
            
            //콤보박스 input 객체를 저장한다. 
            comboBox : {},
            
            //컴보 list형 데이터를 key 값으로 관리한다.
            //key는 id_name 형식으로 관리한다.
            comboKey : {},
            
            //CustomGridEditor datetime input 객체를 저장한다. 
            dateTime : {},
            
            //CustomGridEditor date input 객체를 저장한다. 
            date : {},
            
            //컴보 multi select input 객체를 저장한다. 
            multiSelect : {},

            //컴보 multi select형 데이터를 key 값으로 관리한다.
            //key는 id_name 형식으로 관리한다.
            multiSelectKey : {},
            
            //CELL 내용 자동완성 input 객체를 저장한다. 
            autoComplete : {},
            
            //편집 이전 값을 얻기위하여 설정. 셀 편집 시작 시 데이터를 설정한다.
            beforeEditValue : null,

            //사용자 정의 컬럼으로 frozen을 설정할 경우 컬럼 아이디 명을 설정.
            frozenColumnsId : null,
            
            paging : {
                //페이징 처리시 서버에 전송할 파라메터 데이터를 보관 한다.
                queryData : null,
                rowsPerPageComboBox : null,
                totalCount : 0,
                totalPage : 0
            },
            
            //컬럼 헤더 정보를 설정한다.
            columnHeaders : null,
            
            //집계 사용 여부.
            isAggregate : false
        };
    }

    #initGrid = (config) => {

        //그리드 높이 조절
		if( this.#config.height > 0 ){
            let element = this.#config.element;
			element.style.cssText = element.style.cssText+";height:"+config.height+"px;"
        }
        let controlVars = this.#controlVars;
        let properties = this.#config.properties;
        
		//그리드 생성 전 초기화 이벤트
        this.#config.events.initialize(config);

        var flexGrid =  new wijmo.grid.FlexGrid(config.element, {
            headersVisibility: config.properties.hideRowHeader ?  wijmo.grid.HeadersVisibility.Column : wijmo.grid.HeadersVisibility.All,
			autoGenerateColumns : false,
			columns : this.#column.getGridColumns(),
            selectionMode : config.properties.selectionMode,
			allowMerging : (this.#column.containColumnMerge()) ? wijmo.grid.AllowMerging.All : wijmo.grid.AllowMerging.AllHeaders //헤더컬럼만 머지 , wijmo.grid.AllowMerging.All => 헤더컬럼과 셀내용 전체 머지 적용.
        });

        //cell 세로 크기.
		flexGrid.rows.defaultSize = config.properties.rowsDefaultSize; //기본 cell(내용출력영역) 세로 크기
		flexGrid.columnHeaders.rows.defaultSize = config.properties.columnHeaderHeight; //컬럼명이 출력되는 그리드 상단 영역 세로크기
		flexGrid.columnFooters.rows.defaultSize = config.properties.columnFooterHeight; 
        flexGrid.rowHeaders.columns.defaultSize = config.properties.rowHeaderHeight; //row header cell 세로 높이 조절,  (맨 왼쪽에 있는 순번 및 상태,체크박스 항목)
        
        //tree 이면 자식 속성 설정.
		if(this.#isTree){
			flexGrid.childItemsPath = "children";
        }

        //column multi filter 설정
		// if(properties.multiFilter){
		//     var f = new wijmo.grid.filter.FlexGridFilter(grid);
        // }
        
        //columnHeaders값이 존재 하면 columnheader 깊이에따라 merge처리 하도록 함.
		if(properties.columnHeaders != null && properties.columnHeaders.length > 0){
			//그리드 컬럼 헤더 병합 처리.
			this.#column.setColumnHeaders(this, flexGrid);
		}
		
		//row_status 컨트롤 체크박스를 설정한다.
		if(!properties.hideCheckBox){
			this.#column.setControllCheckBox(this, flexGrid);
		}

		//rowHeader가 보여진 상태이고 lineNumberWidth 값이 있을 경우 가로 크기 설정.
		if(!config.properties.hideRowHeader && config.properties.lineNumberWidth != null){
			flexGrid.rowHeaders.columns[0].width = config.properties.lineNumberWidth;
		}
		
		//열,행을 고정 한다.
		if(config.properties.frozenColumns > -1){
			flexGrid.frozenColumns = config.properties.frozenColumns;
		}
		
		//열,행을 고정 한다.
		if(config.properties.frozenRows > -1){
			flexGrid.frozenRows = config.properties.frozenRows;
		}

		//열 고정 column 속성에 정의할 경우 properties 보다 선 순위로 적용 된다.
		if(controlVars.frozenColumnsId != null){
			//name, 또는 binding 값으로 해당 컬럼을 찾는다.
			var frozenColumn = flexGrid.columns.getColumn(controlVars.frozenColumnsId);
			if(frozenColumn != null){
				flexGrid.frozenColumns = frozenColumn.index;
			}
        }
        
		//총계 합을 하단에 고정 출력 한다.
		if(controlVars.isAggregate && config.properties.grandTotal == constant.GRANDTOTAL_POSITION.BELOW){
			
			var group = new wijmo.grid.GroupRow();
			group.allowMerging = true;
            group.cssClassAll = "grand-total"
            
		    flexGrid.columnFooters.rows.push(group);
		    flexGrid.bottomLeftCells.setCellData(0, 0, 'Σ');
		}
		

        var selfConfig = this.#config;
        var selfColumn = this.#column;
        var selfCommon = this.#common;
        var selfFormatter = this.#formatter;
        var selfEvents = this.#config.events;
        var selfControlVars = this.#controlVars;
        var instance = this;

        flexGrid.itemFormatter = function (panel, row, col, cell){
            
            var isColumnHeader = (panel.cellType == wijmo.grid.CellType.ColumnHeader) ? true: false,
            isColumnFooter = (panel.cellType == wijmo.grid.CellType.ColumnFooter) ? true: false,
            isCell = (panel.cellType == wijmo.grid.CellType.Cell) ? true: false,
            isRowHeader = (panel.cellType == wijmo.grid.CellType.RowHeader) ? true: false,
            isTopLeft = (panel.cellType == wijmo.grid.CellType.TopLeft) ? true: false,
            isBottomLeft = (panel.cellType == wijmo.grid.CellType.BottomLeft) ? true: false,
            isGroup = (panel.grid.rows[row] instanceof wijmo.grid.GroupRow) ? true: false;
        
    
            var grid = panel.grid,
                column = (isRowHeader) ? grid.rowHeaders.columns[col] :  grid.columns[col];
    
                //컬럼 정보가 없을 경우 진행하지 않는다.
                if( !column ){
                    return;
                }

            var columnId = (isRowHeader) ? grid.rowHeaders.columns[col].binding : column.name,
                userColumns = selfColumn.getColumnsMap(),
                userColumn = userColumns[columnId];
                rowObject = grid.rows[row],
                item = (rowObject) ? rowObject.dataItem : null;
                
            var styleObject = {
                    id : columnId,
                    isColumnHeader : isColumnHeader,
                    isCell : isCell,
                    item : item
                };
            
            //내용이 들어가는 일반 cell인지, cellType이 level인 경우에는 넘어간다.
            var isRowGroup =  config.properties.groupTotal != null && (!isRowHeader && isGroup) && CELL_TYPE.LEVEL != userColumn.cellType;
                
            //columnheader 맨 왼쪽 상단.
            if (!isCell || isRowGroup) {
                //드레그 사용시 설정.
                if(isTopLeft && col ==0 && config.properties.rowDrag){
                    cell.innerHTML = '<div class="butterfly-wj-cell-child">'+config.properties.topLeftText+'</div>';										
                }else if(isColumnHeader || isColumnFooter || isBottomLeft || isRowGroup ){
                    //컬럼 헤더 아이콘이 생길 때 위치가 어긋나는 현상이 있어서 line-height값으로 중앙 정렬을 맞춰준다.
                    if(isColumnHeader){

                        if(CELL_TYPE.CHECK_BOX === userColumn.cellType && !userColumn.hideColumnHeaderCheckBox){
                            
                            cell.innerHTML = '<div class="butterfly-controll-icon" style="width:100%">'+cell.innerHTML+' <span><input type="checkbox"></div></span></div> ';
                            
                            var cnt = 0;
                            var checkedRows = grid.rows;
                            var rowsLength = checkedRows.length;
                            for (var i = 0; i < rowsLength; i++) {
                                if (checkedRows[i].dataItem && checkedRows[i].dataItem[columnId] == userColumn.checkBox.Y){
                                    cnt++;
                                } 
                            }
        //							
                            var cb = cell.querySelector("input[type=checkbox]");
                            cb.checked = cnt > 0;
                            cb.indeterminate = cnt > 0 && cnt < rowsLength;
    
                            // apply checkbox value to cells
                            cb.addEventListener('click', function(e) {
                                
                                var checkBoxVal = (cb.checked) ? userColumn.checkBox.Y :userColumn.checkBox.N;
                                
                                selfEvents.cell.clickAllCheckBox({
                                    id : columnId,
                                    checked : cb.checked
                                });	
                                
                                grid.beginUpdate();
                                for (var i = 0; i < rowsLength; i++) {
                                    
                                    var checkBoxDataItem = grid.rows[i].dataItem;
                                    var orgValue = selfselfCommon.getOrgValueKey(columnId)
                                    
                                    checkBoxDataItem[constant.ROW_STATUS_KEY] = (checkBoxDataItem[orgValue] == checkBoxVal) ?  ROW_STATUS.N : ROW_STATUS.U;
                                    checkBoxDataItem[constant.CHECKED_KEY] = (checkBoxDataItem[orgValue] == checkBoxVal) ? false : true;
                                    checkBoxDataItem[columnId] = checkBoxVal;
                                }
                                grid.endUpdate();
    
                            });

                        } else {
							cell.style.cssText=cell.style.cssText+";line-height:"+(Number(cell.style.height.replace("px","")-5))+"px"

                            var innerHTML = cell.innerHTML;
                            if(userColumn.required === true){
								innerHTML +=" <span style='color:red'>*</span>";
                            }
                            cell.innerHTML = innerHTML;						
    
                        }
    
                    }else{
	            		cell.innerHTML = '<div class="butterfly-wj-cell-child">' + cell.innerText + '</div>';						
                    }
                    
                }else if (isRowHeader) {
                    
                    var number = "";
                    if(config.properties.showLineNumber){
                        number = (row + 1).toString();
                        
                        if(config.properties.pageable){

                            if(selfControlVars.paging.queryData){
                                var pageNum = selfControlVars.paging.queryData.params.pageNum;
                                var rowsPerPage = selfControlVars.paging.queryData.params.rowsPerPage;
                                var totalCount = selfControlVars.paging.totalCount;
                                var totalPages = selfControlVars.paging.totalPages;
                                
                                number = totalCount - ((pageNum-1) * rowsPerPage) - row;
                            }
                        }
                    }
                    
    
                    let rowHeaderColumn = grid.rowHeaders.columns[col];
                    //0 번째는 숫자 출력
                    if(col == 0){
                        
                        //드레그 사용시 설정.
                        if(config.properties.rowDrag){
                            cell.draggable = true;
							cell.innerHTML = '<div class="butterfly-wj-cell-child left-drag"><i class="fas fa-arrows-alt"></i></div>';
    
                        }else{
							cell.innerHTML = '<div class="butterfly-wj-cell-child">' + number + '</div>';
                        }
                    //ROW_STATUS 컬럼 일 경우.
                    }else if(col == 1){
                        //rowStatus 변경.
                        selfFormatter.rowStatus(panel,row,col,cell,item);
                        //화면에 출력 시 셀 내용 편집하고 싶을 경우 사용한다.
                        selfEvents.rowHeaderItemFormatter({
                            id : constant.ROW_STATUS_KEY,
                            row : row,
                            col : col,
                            isLeaf : rowObject.hasChildren || false
                        }, cell);
    
                    }else if(col == 2){
                        //coltroll checked 변경.
                        selfFormatter.rowCheckBox(panel, row, col, cell, item);

                        var disabledCells = selfControlVars.disabledControlCheckBox;
                        var cellKey = null;
    
                        if(item && item.hasOwnProperty(constant.INDEX_KEY)){
                            cellKey = selfCommon.getCellCustomKey(item[constant.INDEX_KEY], constant.CHECKED_KEY);
                        }
    
                        if(disabledCells[cellKey] && disabledCells[cellKey].hasOwnProperty("disabled") && disabledCells[cellKey].disabled === true){
                            var checkboxInput = cell.querySelector("input");
                            if(checkboxInput){
                                checkboxInput.disabled = true;
                            }
                        }
                        
                        
                        //화면에 출력 시 셀 내용 편집하고 싶을 경우 사용한다.
                        selfEvents.rowHeaderItemFormatter({
                            id : constant.CHECKED_KEY,
                            row : row,
                            col : col,
                            isLeaf : rowObject.hasChildren || false
                        }, cell);
                        
                        
    
                    }
                    
                }else if(isTopLeft){
    
                    //control checkbox 전체 선택, 전체 해제 
                    if(col == 1){
                        
                        //컬럼헤더의 전체선택 컨트롤 체크박스를 생성하지 않는다.
                        if(config.properties.hideSelectAllOnControlColumnHeader === true){
                            return;
                        }
                        
                        cell.innerHTML = '<div class="butterfly-controll-icon"><input type="checkbox"></div> ';
    
                        let cnt = 0;
                        let checkedRows = grid.rows;
                        let rowsLength = checkedRows.length;
                        for (let i = 0; i < rowsLength; i++) {
                            if (checkedRows[i].dataItem && checkedRows[i].dataItem[constant.CHECKED_KEY] == true){
                                cnt++;
                            } 
                        }
                        
                        let cb = cell.firstChild.firstChild;
                        cb.checked = cnt > 0;
                        cb.indeterminate = cnt > 0 && cnt < rowsLength;
    
                        // apply checkbox value to cells
                        cb.addEventListener('click', function(e) {
                                
                            var checkBoxVal = (cb.checked) ? userColumn.checkBox.Y :userColumn.checkBox.N;
                            // 순서 변경되었습니다. 기존 순서 clickControlAllCheckBox 실행 후 실행
                            grid.beginUpdate();
                            for (var i = 0; i < rowsLength; i++) {
                                grid.rows[i].dataItem[constant.CHECKED_KEY] = cb.checked;
                                
                            }
                            
                            grid.endUpdate();
                            // 순서 변경 : 하위 이벤트는 전체 선택 처리가 된 후에 실행.
                            selfEvents.cell.clickControlAllCheckBox({
                                checked : cb.checked
                            });	
                        
                        });
                    }
                }
                
                return;
            }
            
            var rowObject = panel.grid.rows[row],
                item = (rowObject) ? rowObject.dataItem : null,
                itemValue = (item) ? item[columnId] : null,
                itemIndex = (item) ? item[constant.INDEX_KEY] : null,
                isNotNullItemData = (item) ? (item.hasOwnProperty(columnId) && itemValue != null && itemValue != "") : false,
                isEditRange = panel.grid.editRange, //편집 모드 여부.
                isDataTypeString = false,
                isButton = false;
    
                if(userColumn){
                    isDataTypeString = userColumn.dataType == constant.DATA_TYPE.String,
                    isButton = CELL_TYPE.BUTTON === userColumn.cellType || CELL_TYPE.BUTTON_HTML === userColumn.cellType;  // buttonHtml 속성을 가지고 있다면  값 유무 상관없이 true 처리.
                }else{
                    userColumn = {};
    
                }
            //함수로 이벤트를 실행 할때 사용한다.
            var eventArgument = "(event,'"+config.id+"',"+row+","+col+",'"+columnId+"')";

            //어떠한 조건과 상관없이 모든 상황에 적용 되어야 할 항목 설정.
            selfFormatter.formatterInit(panel, row, col, cell);
            
    
            if(isCell) {
    
                
                //화면에 출력 시 셀 내용 편집하고 싶을 경우 사용한다.
                selfEvents.beforeItemformatter({
                    id : columnId,
                    row : row,
                    col : col,
                    value : itemValue
                }, cell);
    
                if (isDataTypeString && userColumn.prefix && userColumn.prefix != "") {
                    cell.innerHTML = (userColumn.prefix != "" ? userColumn.prefix+ " ": "")	+ itemValue;
                };
    
                if (isDataTypeString && userColumn.suffix && userColumn.suffix != "") {
                    cell.innerHTML = itemValue + (userColumn.suffix != "" ? userColumn.suffix+ " ": "");
                };		
                    
                
                //컬럼이 이미지 형식일 경우에 진행
                if(CELL_TYPE.IMAGE === userColumn.cellType){
                    
                    if (isNotNullItemData !== true && userColumn.previewImageFile.id === null){
                        cell.innerHTML = getHtmlPreviewImage(userColumn, null);
                    }else{
                    
                        if(userColumn.previewImageFile.id === null){
                            cell.innerHTML = "<div class='grid-icon-wrap'><div class=\"butterfly-grid-icon-image\" style='background-image: url(\""+userColumn.domain+ item[columnId]+"\")'></div></div>";
                        }else{
                            
    
                            if(item[constant.ROW_STATUS_KEY] === ROW_STATUS.C || item[constant.ROW_STATUS_KEY] === ROW_STATUS.U ){
                                
                                cell.innerHTML = getHtmlPreviewImage(userColumn, null);
    
                                if (item[userColumn.previewImageFile.id]) {
                                    //이미지 미리보기 형식일 때 해당 데이터가 있으면 바로 출력 한다.
                                    //해당 데이터가 없을 경우 File API를 이용하여 이미지를 불러온다.
                                    //Upload Input 으로 파일 선택 시에도 File API를 호출하여 _PREVIEW_IMAGE 데이터를 생성하는데 GRID출력 보다 늦게 처리되어 이미지가 나타나지 않는다.
                                    //이를 보완하기 위하여 priviewImage 함수를 호출하여 cell 내용을 업데이트 한다.
                                    if(item[constant.PREVIEW_IMAGE_KEY]){
                                        cell.innerHTML = getHtmlPreviewImage(userColumn, item["_PREVIEW_IMAGE"]);
                                    }else{
                                        previewImage(cell,item,userColumn);
                                    }
                                }
                            }else{
                                
                                cell.innerHTML = getHtmlPreviewImage(userColumn, userColumn.domain + item[columnId]);
                            }
                        }
                    }
                    
                    
                //컬럼이 이미지 및 버튼 형식일 경우 진행
                }if(CELL_TYPE.IMAGE_BUTTON === userColumn.cellType){
    
                    let buttonWrapStyle =";width:"+(parseInt(cell.style.width.replace("px",""))-30)+"px";
    
                    let buttonWrap = ""
                    buttonWrap += "<dl class='butterfly-grid-custom'>";
                    buttonWrap += "		<dt class='butterfly-grid-custom-dt'>";
                    buttonWrap += "			<dl class='butterfly-grid-image-button'>";
                    buttonWrap += "				<dt>";
                    buttonWrap += "					<div class=\"butterfly-grid-icon-image\" style='background-image: url(\""+config.events.cell.convertImageUrl({id : columnId, row : row, value : (itemValue || "")})+"\")'/>";
                    buttonWrap += "				</dt>";
                    buttonWrap += "				<dd style='"+buttonWrapStyle+"' class='butterfly-grid-custom-span'>"+(itemValue || "")+"</dd>";
                    buttonWrap += "			</dl>";
                    buttonWrap += "		</dt>";
                    buttonWrap += "		<dd class='butterfly-grid-custom-button'>";
                    buttonWrap += "			<a href=\"javascript:void(0);\" onclick=\"bf.grid.events.clickButton"+eventArgument+"\">";
                    buttonWrap += "				<div class='butterfly-grid-custom-button-search' style='background-image: url(\""+bf.grid.config.imageHome +"/grid/icon_search.png')\"></div>";
                    buttonWrap += "			</a>";
                    buttonWrap += "		</dd>";
                    buttonWrap += "</dl>";
                    
                    cell.innerHTML = buttonWrap;
                    
                }else if(CELL_TYPE.FILE === userColumn.cellType){
    
                    var fileName = (itemValue instanceof File) ? itemValue.name : itemValue || "";
                    var fileInputId = config.id+"-file-input-"+columnId+"-"+row; //DoQuery를 이용하면 Index가 설정되어 있으나 addRow로 입력할 경우 해당 값이 없다. 그럴 때 row값을 설정 한
                    var uploadHtmlStyle =";width:"+(parseInt(cell.style.width.replace("px",""))-50)+"px";
    
                    var uploadHtml = ""
                        uploadHtml += "<dl class='butterfly-grid-custom'>";
                        uploadHtml += "		<dt class='butterfly-grid-custom-dt'>";
                        uploadHtml += 			"<span class='butterfly-grid-custom-span' style='"+uploadHtmlStyle+"'>"+fileName+"</span>";
                        uploadHtml += "		</dt>";				
                        if(userColumn.editable){
                        uploadHtml += "		<dd class='butterfly-grid-custom-button'>";
                        uploadHtml += "			<a href=\"javascript:void(0);\" onclick=\"bf.grid.events.clickClearButtonToFile"+eventArgument+"\">";
                        uploadHtml += "				<div class='butterfly-grid-custom-button-clear' style='background-image: url(\""+selfConfig.imageHome +"/grid/ico_x.gif')\"></div>";
                        uploadHtml += "			</a>";
                        uploadHtml += "		</dd>";
                        uploadHtml += "		<dd class='butterfly-grid-custom-button'>";
                        uploadHtml += "			<a href=\"javascript:void(0);\">";
                        uploadHtml += "				<label for=\""+fileInputId+"\"><div class='butterfly-grid-custom-button-upload' style='background-image: url(\""+selfConfig.imageHome +"/grid/ico_upload.gif')\"></div></label>";
                        uploadHtml += "				<input id=\""+fileInputId+"\" type=\"file\" accept=\""+userColumn.filter+"\" onchange=\"bf.grid.events.changeInputFile"+eventArgument+"\" class='butterfly-grid-custom-button-file'/>";
                        uploadHtml += "			</a>";
                        uploadHtml += "		</dd>";
                        }
                        
                        uploadHtml += "</dl>";
    
                    cell.innerHTML = uploadHtml;
    
                //HTML일 경우 처리한다.
                }else if(CELL_TYPE.HTML === userColumn.cellType){
                    cell.innerHTML = (wijmo.isFunction(userColumn.html)) ? userColumn.html({id: columnId, row: row, value: itemValue, item: item }) : userColumn.html;
    
                //버튼일 경우 처리 한다.
                }else if(isButton){
                    
                    if(CELL_TYPE.BUTTON_HTML === userColumn.cellType){
                        cell.innerHTML = (wijmo.isFunction(userColumn.html)) ? userColumn.html({id: columnId, row: row, value: itemValue, item: item }) : userColumn.html;
                        var button = cell.querySelector("button");
                        if(button){
                            button.setAttribute("onclick","bf.grid.events.clickButton"+eventArgument);
                        }
                        
                    }else{
    
                        let buttonWrapStyle =";width:"+(parseInt(cell.style.width.replace("px",""))-30)+"px";
                        
                        let buttonWrap = ""
                        buttonWrap += "<dl class='butterfly-grid-custom'>";
                        buttonWrap += "		<dt class='butterfly-grid-custom-dt'>";
                        buttonWrap += 			"<span class='butterfly-grid-custom-span' style='"+buttonWrapStyle+"'>"+(itemValue || "")+"</span>";
                        buttonWrap += "		</dt>";
                        buttonWrap += "		<dd class='butterfly-grid-custom-button'>";
                        buttonWrap += "			<a href=\"javascript:void(0);\" onclick=\"bf.grid.events.clickButton"+eventArgument+"\">";
                        buttonWrap += "				<div class='butterfly-grid-custom-button-search' style='background-image: url(\""+selfConfig.imageHome +"/grid/icon_search.png')></div>";
                        buttonWrap += "			</a>";
                        buttonWrap += "		</dd>";
                        buttonWrap += "</dl>";
                        
                        cell.innerHTML = buttonWrap;
                    }							
    
                }else if(wijmo.DataType.Date === userColumn.dataType || CELL_TYPE.DATE_TIME === userColumn.cellType){
    
                    if (isNotNullItemData === true) {
                        if(wijmo.isNumber(itemValue)){
                            cell.innerHTML = util.date.toLocalAtUTC(itemValue).format(userColumn.format);
                        }else if(wijmo.isDate(itemValue)){
                            cell.innerHTML = itemValue.format(userColumn.format)
                        }else{
                            cell.innerHTML = new Date(Date.parse(itemValue)).format(userColumn.format);
                        }
                    }
                }else if(CELL_TYPE.TEXT_DATE === userColumn.cellType){
                    if (isNotNullItemData === true) {
                        cell.innerHTML = selfFormatter.formatter(itemValue, userColumn.format);
                    }
                }else if(CELL_TYPE.COMBO_BOX === userColumn.cellType){
                    //컴보박스 일 경우. 선택된 id 값을 저장 한다.
                    if(isNotNullItemData === true && (selfControlVars.comboKey[columnId])){
                        if(selfControlVars.comboKey[columnId+'_'+row]){
                            cell.innerHTML= selfControlVars.comboKey[columnId+'_'+row][itemValue]||"";
                        }else{
                            cell.innerHTML= selfControlVars.comboKey[columnId][itemValue]||"";
                        }
                    }
                }else if(CELL_TYPE.LEVEL == userColumn.cellType){
                    
                    var isLeaf = cell.querySelector(".wj-elem-collapse") != null;
     
                    if(!isLeaf){
                        cell.insertAdjacentHTML('afterbegin', '<span class="wj-elem-collapse wj-glyph-square" style="background:url(/static/images/grid/ico_tree_none.gif)"></span>');
                    }
                    
                }else if(CELL_TYPE.MASK === userColumn.cellType){
                    //컴보박스 일 경우. 선택된 id 값을 저장 한다.
                    if(isNotNullItemData === true ){
                        if(itemValue != null){
                            cell.innerText= selfFormatter.formatter(itemValue, userColumn.mask.replace(/[0-9]/ig,"#"));
                        }
                    }
                }else if( wijmo.DataType.String === userColumn.dataType && CELL_TYPE.CHECK_BOX === userColumn.cellType){

                    var cellChecked = (itemValue === "Y") ? true : false
    
                    var isEditable = selfCommon.isEditable(grid, itemIndex, col, columnId);
                    
                    if(cellChecked){
                        cell.innerHTML='<input type="checkbox"  checked="" tabindex="-1" style="cursor: default;">';
                    }else{
                        cell.innerHTML='<input type="checkbox" tabindex="-1" style="cursor: default;">';
                    }
                    if(!isEditable){
                        cell.firstChild.disabled = true;
                    }else{
                        cell.firstChild.setAttribute("onclick","bf.grid.events.clickCheckBox"+eventArgument);
                    }
    
                }
                
                if(columnId!= constant.ROW_STATUS_KEY && columnId != constant.CHECKED_KEY){
                    
                    if((DATA_TYPE.Boolean !== userColumn.dataType)){
                        selfFormatter.setCellStyle({
                            panel: panel, 
                            cell: cell, 
                            userColumn: userColumn, 
                            rowObject: rowObject,
                            styleObject: styleObject, 
                            row: row, 
                            col: col
                        });
                    }
                }
                
                //화면에 출력 시 셀 내용 편집하고 싶을 경우 사용한다.
                selfEvents.itemformatter({
                    id : columnId,
                    row : row,
                    col : col,
                    value : itemValue,
                    rowData : item
                }, cell);
            }
                
        };
        
        return flexGrid;
        
    }

    #setCollectionView(grid, data){
			
        var isData = (data && data.length > 0) ;
        
        var tree = this.#tree;
        var sort = function(items){
            
            if(items instanceof Array){
                
                items.sort(function(a,b){
                    if(tree.sortAsc){
                        return a[tree.sortAsc] - b[tree.sortAsc];							
                    }else if(tree.sortDesc){
                        return a[tree.sortDesc] > b[tree.sortDesc];
                    }
                });	
            }
            
            for (var i = 0; i < items.length; i++) {
                
                if(items[i].children){
                    sort(items[i].children);
                }
            }
        };
        
        if(isData && this.#isTree){
            data = this.#common.convertTree(data,tree.parent,tree.id);

            if(tree.sortAsc){
                sort(data);						
            }
        }
        
        this.#collectionView = new wijmo.collections.CollectionView(data);
        grid.itemsSource = this.#collectionView;
    };

    /**
     * 그리드 존재 여부 
     * 
     * @param {String} gid 
     */
    isGrid = (gid) => {
        if(datagrid[gid] || (datagrid[gid] && datagrid[gid] !== null) ){
            alert("이미 그리드가 존재 합니다.")
        }
    }

    /***
     * grid 데이터를 등록 한다.
     */
    setData = (data) => {
        
        this.#setCollectionView(this.getGrid(), data);
        let ui = this.#ui;

        //데이터가 없을 경우 No Result 출력.
        if(this.getCollectionView().itemCount == 0){
            ui.showNoResultStatus(this.getId());
        }else{
            ui.hideResultStatus(this.getId());
        }
    }

    /**
     * 서버에 질의 한다.
     * 
     * @param {*} p 
     * @param {*} methodType 
     */
    #query = (p, methodType) => {

        var common = this.#common;
        var properties = this.#config.properties;
        var controlVars = this.#controlVars;
        var events = this.#config.events;
        var grid = this.getGrid();
        var gridId = this.getId();
        var instance = this;
        var ui = this.#ui;
        
        var config = {
            method :p.method,
            url : p.url,
        };
        console.log(config.method,'#########config.method')

        //서버에 넘길 파라메터 객체 정보.
        var data = {};
        
        var formParam = null;

        //form에 있는 input 값을 서버에 넘기도록 설정한다.
        //여러 form에서 데이터를 입력 받을 수 있으나 중복 되는 파라메터 명은 마지막에 접근한 form값으로 덮어씌워진다.
        //뒤이에 param 값 역시 중복되는 파라메터가 있다면 p.param에 적용된 파라메터 값으로 덮어씌워진다.
        if(p.form instanceof Array){

            for (var j = 0; j < p.form.length; j++) {
                
                if(document.querySelector("#"+p.form[j])){

                    if(p.multipart){
                        formParam = serializeFiles("#"+p.form[j]);
                    }else{
                        formParam = serializeObject("#"+p.form[j]);
                    }
                    
                    for ( var key in formParam) {
                        data[key] = formParam[key];
                    }
                }
            }
            
        }else{

            if(document.querySelector("#"+p.form)){

                if(p.multipart){
                    formParam = serializeFiles("#"+p.form);
                }else{
                    formParam = serializeObject("#"+p.form);
                }
                for ( let key in formParam) {
                    data[key] = formParam[key];
                }
            }
        }
        
        //사용자가 따로 추가한 파라메터를 서버로 보내기 위해 설정.
        if(p.params != null){
            for ( let key in p.params) {
                data[key] = p.params[key];
            }
        }

        //editable === true 인 데이터만 서버에 전송.
        let setOnlyEditableData = function(p, userColumns, rows){

            if(p.saveOption.onlyEditable && rows){

                for (let index = 0; index < rows.length; index++) {
                    const row = rows[index];

                    for (const key in row) {
                        if(userColumns[key] && userColumns[key].editable !== true){

                            if(p.saveOption.includeColumn.includes(key)){
                                continue;
                            }
                            
                            delete row[key];
                        }
                    }
                    
                }
                
            }
        };

        //excludeColumn 을 제외한 데이터만 서버에 전송.
        let excludeColumn = function(p, userColumns, rows){

            if(rows){

                for (let index = 0; index < rows.length; index++) {
                    const row = rows[index];

                    for (const key in row) {

                        if(p.excludeColumn.includes(key)){
                            delete row[key];
                        }
                            
                    }
                    
                }
                
            }
        };
        
        //서버에 전송할 그리드 데이터를 설정 한다.
        //서버에서는 D_G_로 시작 하는 파라메터값으로 전달 받는다.
        //기본으로 checked : true 값을 설정한다.
        //status 속성이 존재하지 않으면 doQuery 함수 호출로 판단한다.  doQuery함수는 그리드 내용을 넘기지 않는다.
        if(p.hasOwnProperty("status")){

            if(p.status instanceof Array){

                for (var i = 0; i < p.status.length; i++) {
                    
                    let rows = this.getRows({ checked : p.checked, status : p.status[i] , metadata : false });

                    console.log(rows)
                    setOnlyEditableData(p,  this.#column.getColumnsMap(), rows);
                    excludeColumn(p,  this.#column.getColumnsMap(), rows);
                    
                    if(rows != null && rows.length > 0){

                        if(ROW_STATUS.N == p.status[i]){
                            data["D_G_N"] = rows;
                        }else if(ROW_STATUS.C == p.status[i]){
                            data["D_G_C"] = rows;
                        }else if(ROW_STATUS.U == p.status[i]){
                            data["D_G_U"] = rows;
                        }else if(ROW_STATUS.D == p.status[i]){
                            data["D_G_D"] = rows;
                        }else if(ROW_STATUS.A == p.status[i]){
                            data["D_G_A"] = rows;
                        }
                    }
                }
            }else{
                let rows = this.getRows({ checked : p.checked, status : p.status, metadata : false });

                setOnlyEditableData(p,  this.#column.getColumnsMap(), rows);
                excludeColumn(p,  this.#column.getColumnsMap(), rows);

                data["D_G_"+p.status] = rows;


            }
            
        }


        //multipart일 경우 jquery ajax에서는 다음과 같이 설정해 주어야 한다.
        if(properties.multipart || p.multipart){
            config["enctype"]		= "multipart/form-data"; 
            config["processData"]	= false; // Important!
            config["contentType"]	= false; 
            config["cache"]			= false; 

            config.data =  paramFiles(data,false);

        }else{
            config.data = param(data,false);
        }
        
        //서버에 데이터 전송전 실행하는 이벤트 
        if(methodType == constant.METHOD_NAME_DOSAVE){
            events.beginSave(data);
        }else{
            events.beginQuery(data);						
        }


        //호출 하기전 설정 로딩중, NoResult 아이콘 있으면 제거 
        ui.hideResultStatus();
        ui.hideLoading();
        ui.showLoading();
        
        let ajax = null;

        switch (config.method) {
            case "get":
                ajax = axios.get(config.url, { params : data});
                break;
            case "delete":
                    ajax = axios({
                        url: config.url,
                        method: 'delete',
                        data: config.data
                    });
                break;      
            case "put":
                ajax = axios({
                    url: config.url,
                    method: 'put',
                    data: config.data
                });
                break;
            case "patch":
                ajax = axios({
                    url: config.url,
                    method: 'patch',
                    data: config.data
                });
                break;      
            default:
                ajax = axios.post(config.url,config.data);
                break;
        }
        //서버에 그리드 및 파라메터 데이터를 전송한다.
        ajax
            .then(function (response){

                var gridData = (response.data.GRID_DATA) ? response.data.GRID_DATA : response.data;

                //데이터가 null이 아니면 collectionView에 설정.
                if(gridData){
                    //조회한 데이터를 설정한다.
                    instance.setData(gridData.content);
                }else{
                    instance.setData([]);
                }

                   
                var result = {
                    status	: 200,
                    message : null,
                    type	: null,
                    data	: data
                };
                
                //페이징 사용 시 페이징 정보들을 설정한다.
                if(properties.pageable && gridData != null){
                    //전체 페이지 및 갯수를 설정.
                    controlVars.paging.totalCount = gridData.totalCount;
                    controlVars.paging.totalPages = gridData.totalPages;
                    
                    common.setPaging(gridId,gridData);
                }
                
                if(methodType == constant.METHOD_NAME_DOSAVE){
                    events.endSave(result);
                }else{
                    events.endQuery(result);						
                }
                
                events.complete(false, result);						

                //로딩 상태 아이콘 제거.
                ui.hideLoading();

                //데이터가 없을 경우 No Result 출력.
                if(instance.getCollectionView().itemCount == 0){
                    ui.showNoResultStatus(gridId);
                }else{
                    ui.hideResultStatus(gridId);
                }
            })
            .catch(function(e) {

                console.error(e);
                
                if(properties.alertError){
                    if(e.message){
//							alert("[에러 발생]\n - 응답코드 : "+ e.status +", \n - 메세지 : "+e.message+", \n - exception : "+e.type);
                        alert("[에러 발생]\n - 메세지 : "+e.response.data.message);
                        //로그인 권한 없을 경우 로그인 페이지로 이동
                        if(e.status == "401"){
                            location.href="/login";
                        }
                    }
                } else{
                    
                    if(methodType == constant.METHOD_NAME_DOSAVE){
                        events.endSave(e.response.data);
                    }else{
                        events.endQuery(e.response.data);						
                    }
                    
                    events.complete(true, e.response.data);						

                }

                let fieldName = e.response.data.fieldName;
                
                
                if(fieldName){
                    var el = document.querySelector("input[name="+fieldName+"]");
                    if(el){el.focus();}
                }
                
                ui.hideResultStatus();
                ui.hideLoading();

            });
    }

    /** data 호출 */
    doQuery = (p) => {
        
        var properties = this.#config.properties;
        var controlVars = this.#controlVars;
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            url			:	properties.url,
            form		:	properties.form,
            method      :   properties.method,
            params		:	null
        }, p || {});
        
        //페이징 처리 할 경우 페이지 이동시 이전에 호출한 파라메터를 유지 하기 위해 별도의 공간에 저장해 놓는다.
        if(properties.pageable){
            //pageNum 값과 rowsPerPage값이 셋팅되어 있지 않으면 pageNum은 기본 값. rowsPerPage는 선택된 값을 설정.
            var rowsPerPage = controlVars.paging.rowsPerPageComboBox.selectedValue;
            if(param.params != null){
                if(!param.params.pageNum){
                    param.params.pageNum = 1;
                }
                
                if(!param.params.rowsPerPage){
                    param.params.rowsPerPage = rowsPerPage;
                }
                
            }else{
                param.params = {
                        pageNum : 1,
                        rowsPerPage : rowsPerPage
                };
            }
            
            controlVars.paging.queryData = param;
        }
        
        this.#query(param, constant.METHOD_NAME_DOQUERY);
    }

    /** data 저장 */
    doSave = (p) => {
        
        var properties = this.#config.properties;

        //파라메터 값을 초기하 한다.
        var param =	_.merge({}, {
            url             :	properties.url,
            form            :	properties.form,
            method          :   properties.method,
            saveOption : {
                onlyEditable : false,
                includeColumn: []
            },
            excludeColumn   : [],
            status          :	[ROW_STATUS.C,ROW_STATUS.U,ROW_STATUS.D], //값이 안들어 올경우 기본 설정.
            checked         :	true,
            multipart       :	false,
            params          :	null
        }, p || {});

        console.log(param,'#########')
        
        this.#query(param, constant.METHOD_NAME_DOSAVE);
        
    }

    /** 
     * 컬럼 추가 
     * 
     *	샘플)
    *	p = {
    *		id		: 추가할 기준이 될 열(컬럼) 아이디 = 기준 컬럼 바로 옆에 추가 된다.,
    *		next	: 기준 컬럼 오른쪽으로 추가
    *		index	: 열(컬럼) 추가 위치 (생략 가능-특정 위치에 추가하고 싶을 때 사용),
    *		column	: 사용자 정의 컬럼 정보 {header : 컬럼 출력명, id : 컬러 아이디, dataType : 데이터 형식, ...}
    *	}
    *
    * @author 장진철(zerocooldog@pionnet.co.kr)
    * 
    */
    addColumn = (p) => {
        
        var userColumns = this.#column.getColumnsMap();
        var grid = this.getGrid();

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            id:null,
            next:false,
            index : -1,
            column : null
        },p || {});
        
        if(param.column === null){
            console.error("추가 할 컬럼 정보가 없습니다. [ 사용자 정의 컬럼 정보 = {header : 컬럼 출력명, id : 컬러 아이디, dataType : 데이터 형식, ...} ]");
            return;
        }
        
        if(!param.column.id){
            console.error("컬럼 id 속성은 필수 입니다. [ {id : 컬럼 아이디 }]");
            return;
        }
        
        if(grid.columns.getColumn(param.column.id) !== null){
            console.error("이미 추가 된 컬럼 입니다. [ id : "+param.column.id+" ]");
            return;
        }
        
        var insertIndex = param.index;
        
        if(param.id != null){
            var column = grid.columns.getColumn(param.id);
            insertIndex = column.index;
        }
        
        if(param.next === true){
            insertIndex = insertIndex+1;
        }

        if(insertIndex === -1){
            console.error("컬럼 순서는 -1 보다 커야 합니다. [ index : "+param.index+" ]");
        }

        //사용자 정의 컬럼 설정 후 userColumns 객체에 column.id 값으로 저장한다.
        var userColumn = this.#column.defineColumn(param.column);
        userColumns[param.column.id] = userColumn;

        var redefineColumn = this.#column.convertGridColumn(userColumn);
        //컬럼을 재정의 한뒤 grid columns 객체에 삽입한다.
        grid.columns.insert(insertIndex,new wijmo.grid.Column(redefineColumn));
        
        grid.refresh();
    }


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
    removeColumn = (p) => {
        
        var userColumns = this.#column.getColumnsMap();
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            id : 0
        },p || {});

        var column = grid.columns.getColumn(param.id);
        grid.columns.remove(column);
        
        //userColumns에 있는 값도 제거한다.
        delete userColumns[param.id];
        
        console.log(this.#column.getColumnsMap())
    }

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
    showColumn = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            id : null
        },p || {});

        var column = grid.columns.getColumn(param.id);
        
        if(column){
            column.visible = true
        }
    }

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
    hideColumn = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            id : null
        },p || {});

        var column = grid.columns.getColumn(param.id);
        
        if(column){
            column.visible = false
        }		
    }

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
    addRow = (p) => {
        
        var common = this.#common;
        var properties = this.#config.properties;
        var controlVars = this.#controlVars;
        var events = this.#config.events;
        var grid = this.getGrid();
        var tracking = this.getTracking();
        var userColumns = this.#column.getColumnsMap();


        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : 0,
            tracking : true,
            data : {}
        },p || {});
        

        //신규 데이터 추가시에 grid상단에 위치한다. row 0번째
        //상단 위치가 아니라면 맨 하단에 위치한다.
        if(!param.row && !properties.newRowAtTop){
            param.row = this.getRowCount();
        }

        var item = {};
        
        for ( var columnId in userColumns) {
            
            var column = grid.getColumn(columnId);
            var userColumn = userColumns[columnId];
            
            // 값이 셋팅되어 있지 않으면 NULL로 초기화.
            if(item[columnId] === undefined){
                item[columnId] = null;
            }

            //신규 등록시 boolean 형식은 무조건 N값을 넣는다.
            if(column && userColumn.cellType === CELL_TYPE.CHECK_BOX){
                item[columnId] = "N";
            }
            
            var orgValKey = common.getOrgValueKey(columnId);
            var preValKey = common.getPreValueKey(columnId);

            // 데이터 변경시 이전 값과 원래 값을 알기 위해 초기에 설정.
            item[orgValKey] = item[columnId];
            item[preValKey] = item[columnId];
        }
        
        //넘어오는 데이터가 있다면 초기화 된 item 값에 대입한다.
        if(param.data){
            item = _.merge({}, item, param.data);
        }

        //신규로 데이터가 추가 되기 때문에 ROW_STATUS값을 Create 약자인 C로 설정 한다. 체크박스는 자동으로 선택.
        item[constant.ROW_STATUS_KEY] = ROW_STATUS.C;
        item[constant.CHECKED_KEY] = true;
        
        
        //신규 row를 추가하기 위해여 row 객체 생성 후 item 대입.
        var row = new wijmo.grid.Row();
        row.dataItem = item;
        
        //상단 row추가 일 경우
        if(properties.newRowAtTop){
            grid.rows.insert(param.row,row);
            grid.select(param.row, 1);
            
        //하단 row 추가 일 경우
        }else{
            console.warn("[properties.newRowAtTop] 값이 false 일 경우 row 위치를 지정 하여 삽입 할 수 없습니다.");
            var addRowIdx = grid.rows.length;
            
            grid.rows.push(row)
            grid.scrollIntoView(addRowIdx, 1);
        }
        
        //신규 추가된 데이터를 따로 추적 보관한다.
        tracking[ROW_STATUS.C].push(row);
        
        //신규 데이터 추가시 발생 하는 이벤트
        events.row.rowAddedNew(item);
        //grid에 로우 추가 될 경우 이벤트 발생. ROW_STATUS.N,ROW_STATUS.C 모두 해당
        events.row.rowAdded(item);
        
        // 내용에 따라 row 크기 자동 변환 여부가 true 일 경우 처리. ps. 나중에 확인해보고 필요없으면 제거.
        if(properties.autoRowResize){
            common.setAutoRowResize(grid,param.row);
        }

    }

    /** 특정 row 이동 
     * 
     *	샘플)
    *	p = {
    *		currentRow	: 이동 시킬 행(대상) 번호,
    *		targetRow	: 이동 할 row 번호
    *	}
    *
    * @author 장진철(zerocooldog@pionnet.co.kr)
    */
    moveRow = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            currentRow : 0,
            targetRow : 0
        },p || {});
        
        //현재 행과 이동 하려는 행이 같을 경우 진행하지 않는다.
        if(param.targetRow  === param.currentRow){
            return;
        }
        
        //행 이동이 가능 한지 검증.
        var canMove = grid.rows.canMoveElement(param.currentRow,param.targetRow);

        //행 이동이 가능 하지 않거나 이동할 행이 0보다 작으면 경고문구 출력 후 더 이상 진행하지 않는다.
        if(!canMove || param.targetRow < 0){
            alert("더이상 이동 할 수 없습니다.");
            return;
        }
        
        grid.rows.moveElement(param.currentRow,param.targetRow);
        grid.select(param.targetRow, 1);

    }

    /** 특정 row 삭제 
     *
     *	p = {
     *		row	: 데이터를 읽을 row 번호.
     *	}
     *
     * @return {} Object 삭제 할 row 객체
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    deleteRow = (p) => {
        
        var grid = this.getGrid();
        var controlVars = this.#controlVars;
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : controlVars.selectRow
        },p || {});
        
        
        //row 번호에 위치 한 데이터를 읽어온다.
        var item = grid.rows[param.row].dataItem;
        
        //객체 정보가 없으면 false로 리턴
        if(!item){
            console.warn("해당 row가 존재 하지 않습니다. [row:"+param.row+"]");
            return;
        }
        
        //row 번호에 위치 한 데이터의 ROW STATUS 값을 D(delete) 로 변경 후 선택한다.
        item[constant.ROW_STATUS_KEY] = ROW_STATUS.D;
        item[constant.CHECKED_KEY] = true;
        
        var successStatus = (item[constant.ROW_STATUS_KEY] == ROW_STATUS.D);
        
        if(!successStatus){
            console.warn("row 상태 삭제 값이 올바르지 않습니다. [row:"+param.row+"]", item[constant.ROW_STATUS_KEY]);
        }
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();

        //객체 정보가 있으면 true로 리턴
        return item;
    }

    /** 모든 row 삭제 
     * 
     * checked 속성이 없을 경우 :  모든 row 삭제, deleteRows() or  deleteRows({});;
     * checked 값이 false 일 경우 : 모든 row 삭제,  deleteRows({checked:false});
     * checked 값이 true 일 경우 : checkebox가 선택 된 경우만 삭제,  deleteRows({checked:true});
     *
     *	p = {
     *		checked	: checkbox 선택 여부
     *	}
     *
     * @return [{},{}] Object 삭제 할 row object 정보를 담고있는 배열 객체
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    deleteRows = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            checked : true
        },p || {});
        
        var rows = [];
        var items = grid.rows;
        var length = items.length;
        
        var isCheck = (param.checked === true);

        // 1. checked 값이 true일 경우.
        // 1.1 row data의 constant.CHECKED_KEY 값이 true이면 row 상태값을 ROW_STATUS.D로 변경 아니면 넘어간다. 
        // 2. checked 값이 false일 경우
        // 2.1 모든  row 상태값을 ROW_STATUS.D로 변경 한다.
        for (var i = 0; i < length; i++) {
            
            var item = grid.rows[i].dataItem;
            var rowStatus = item[constant.ROW_STATUS_KEY];
            if(isCheck){
                
                //체크가 되어 있지 않거나 상태변화가 있는 C,U 값이라면 삭제처리 하지 않고 넘어간다.
                if(item[constant.CHECKED_KEY] !== true || rowStatus == ROW_STATUS.C || rowStatus == ROW_STATUS.U){
                    continue;
                }
                
                item[constant.ROW_STATUS_KEY] = ROW_STATUS.D;
                rows.push(item);
                
            }else{
                
                //상태변화가 있는 C,U 값이라면 삭제처리 하지 않고 넘어간다.
                if(rowStatus == ROW_STATUS.C || rowStatus == ROW_STATUS.U){
                    continue;
                }
                
                item[constant.ROW_STATUS_KEY] = ROW_STATUS.D;
                item[constant.CHECKED_KEY] = true;
                rows.push(item);
            }
            
        }
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();

        return rows;
    }
    
    /** 
     * 새로 추가 된 row 삭제 
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    deleteCreateRow = (p) => {
        
        var grid = this.getGrid();
        var controlVars = this.#controlVars;        

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : controlVars.selectRow,
            checked : true
        },p || {});
        
            
        //row 번호에 위치 한 데이터를 읽어온다.
        var row = grid.rows[param.row];
        var item =  row.dataItem;
        
        //객체 정보가 없으면 false로 리턴
        if(!row){
            console.warn("해당 row가 존재 하지 않습니다. [row:"+param.row+"]");
            return;
        }
        
        if(param.checked === true && item[constant.CHECKED_KEY] !== true){
            alert("추가한 행 제거는 선택 된 항목만 가능 합니다. [row:"+param.row+", checked:"+param.checked+"]");
            return;
        }
        
        if (item[constant.ROW_STATUS_KEY] === ROW_STATUS.C){
            grid.rows.remove(row);
            grid.refresh();
        }

    }

    /** 
     * 새로 추가 된 row들 삭제 
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    deleteCreateRows = () => {
        
        var collectionView = this.getCollectionView();
        var grid = this.getGrid();
        var tracking = this.getTracking();
    
        var addedRows = tracking[ROW_STATUS.C];
        var addedRowsLength = addedRows.length;

        try {
            //일반 grid일 경우에는 grid.rows 객체에서 지우면 되지만
            //tree grid일 경우에는 collectionView를 통해서 지워주어야 한다.
            //별도 함수 제공은 의미 없어보여 동시에 제거 하도록 한다.
            
            if(!this.#isTree){
                for (var i = 0; i < addedRowsLength; i++) {
                    grid.rows.remove(addedRows[i]);
                }	
                
                //새로고침 해줘야 화면이 갱신 된다.
                grid.refresh();
                
            }else{
                
                // eslint-disable-next-line no-inner-declarations
                function prune(array, label) {
                    var arrayLength = array.length;
                    for (var i = 0; i < arrayLength; ++i) {
                        var obj = array[i];
                        
                        if (obj[constant.ROW_STATUS_KEY] === ROW_STATUS.C) {
                            // splice out 1 element starting at position i
                            array.splice(i, 1);
                            return true;
                        }
                        if (obj.children) {
                            if (prune(obj.children, label)) {
                                if (obj[constant.ROW_STATUS_KEY] === ROW_STATUS.C && obj.children.length === 0) {
                                    // delete children property when empty
                                    delete obj.children;

                                    // or, to delete this parent altogether
                                    // as a result of it having no more children
                                    // do this instead
                                    array.splice(i, 1);
                                }
                                return true;
                            }
                        }
                    }
                }
                
                collectionView.beginUpdate();
                var endDelete = true;
                
                while(endDelete){
                    endDelete = prune(collectionView.items, ROW_STATUS.C)
                }

                collectionView.refresh();
                collectionView.endUpdate();

            }
        } catch (e) {
            console.log(e)
        }

    }

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
    revert = (p) => {
        
        var common = this.#common;
        var grid = this.getGrid();
        var userColumns = this.#column.getColumnsMap();
        var controlVars = this.#controlVars;

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : controlVars.selectRow,
            id : null
        },p || {});
        
        var row = grid.rows[param.row];
        
        if(row){
            var item = grid.rows[param.row].dataItem;
            
            if(item && item[param.id]){
                var orgValKey = common.getOrgValueKey(param.id);
                item[param.id] = item[orgValKey];
                item[constant.ROW_STATUS_KEY] = ROW_STATUS.N;
                item[constant.CHECKED_KEY] = false;	
            }else{
                for ( let id in userColumns) {
                    let orgValKey = common.getOrgValueKey(id);
                    item[id] = item[orgValKey];
                    item[constant.ROW_STATUS_KEY] = ROW_STATUS.N;
                    item[constant.CHECKED_KEY] = false;	

                }
            }
            
            //새로고침 해줘야 화면이 갱신 된다.
            grid.refresh();
        }
    }

    /** 
     * row 데이터 모두 제거
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    clearRows = (p) => {
        
        var grid = this.getGrid();
        grid.rows.clear();
        
    }

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
    checkedRow = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : null
        },p || {});
        
        var rows = grid.rows;

        //row 값이 존재 하지 않으면 null 리턴.
        if(!rows || !rows[param.row]){
            return null;
        }
        
        var item = rows[param.row].dataItem;
        
        item[constant.CHECKED_KEY] = true;
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();
    }
    
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
    checkedRowsOnSpecificValue = (p) => {
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            id : null,
            value : null
        },p || {});
        
        var grid = this.getGrid();
        
        var items = grid.rows;
        var length = items.length;

        var isLike = param.value.startsWith('%') && param.value.endsWith('%');

        var value = (isLike) ? param.value.replace(/(^%)/ig,'').replace(/(%$)/ig,'') : param.value;
        
        for (var i = 0; i < length; i++) {
            
            var item = items[i].dataItem;

            if(isLike && item[param.id] && item[param.id].indexOf(value) > -1){
                items[i].dataItem[constant.CHECKED_KEY] = true;
            }else if(!isLike && item[param.id] && item[param.id] == value ){
                items[i].dataItem[constant.CHECKED_KEY] = true;
            }else{
                items[i].dataItem[constant.CHECKED_KEY] = false;
            }
        }
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();
        
    }
    
    /***
     * control checkbox 체크박스를 disabled 상태로 변환한다.
     *	샘플)
     *	p = {
     *		row 	: row 번호,	기본 값	: 0
     *	}
     * @param p
     */
    disabledControlCheckBox = (p) => {
        
        var common = this.#common;
        var controlVars = this.#controlVars;

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : controlVars.selectRow,
            disabled : true,
            clear : false
        },p || {});
        
        var item = this.getRow({
            row : param.row
        });
        
        if(item){
            //clear 속성 값이 true 이면 disable정보를 담고 있는 객체를 초기화 시킨다.
            if(param.clear === true){
                controlVars.disabledControlCheckBox = {};
            }
            
            var cellKey = common.getCellCustomKey(param.row, constant.CHECKED_KEY);
            var disabledCell = controlVars.disabledControlCheckBox[cellKey];

            if(!disabledCell){
                disabledCell = controlVars.disabledControlCheckBox[cellKey] = {};
            }
            

            disabledCell.disabled = param.disabled;


        }else{
            console.warn("[row : "+param.row+"] 데이터가 존재 하지 않습니다")
        }

        this.getGrid().refresh();
    }

    /** 
     * 전체 row 체크박스 선택 
     * 
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    checkedAllRow  = () => {
        
        var grid = this.getGrid();
        
        var items = grid.rows;
        var length = items.length;
        
        for (var i = 0; i < length; i++) {
            items[i].dataItem[constant.CHECKED_KEY] = true;
        }
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();
    }
    
    /** 
     * 전체 row 체크박스 선택 해제
     * 
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    unCheckedAllRow = () => {
        
        var grid = this.getGrid();
        
        var items = grid.rows;
        var length = items.length;
        
        for (var i = 0; i < length; i++) {
            items[i].dataItem[constant.CHECKED_KEY] = false;
        }
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();
    }

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
    unCheckedRow = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : null
        },p || {});
        
        var rows = grid.rows;
        
        //row 값이 존재 하지 않으면 null 리턴.
        if(!rows || !rows[param.row]){
            return null;
        }
        
        var item = rows[param.row].dataItem;
        
        item[constant.CHECKED_KEY] = false;
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();
    }

    /** 
     * 특정 row 선택. 
     * 
     *	샘플)
     *	p = {
     *		row 	: row 번호
     *	}
     *
     * @param p 파라메터 속성.
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    selectRow = (p) => {
        
        var grid = this.getGrid();
        var events = this.getConfig().events;
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : 0,
        },p || {});
        
        grid.select(param.row, 0);
        events.row.selectedRow(this.getRow({row: param.row}));
    }
        
    /***
     * 현재 선택된 row 번호를 알려준다.
     * 
     * @return Number 선택 된 row 번호
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    selectedRowNumber = () => {
        
        var grid = this.getGrid();
        var controlVars = this.#controlVars;

        return (grid.rows.length > 0 && controlVars.selectRow == -1) ? 0 : controlVars.selectRow;
    }
    

    
    /** 
     * 컬럼 아이디로 로우 데이터 가져오기
     * 
     *	샘플)
     *	id = {		            
     *      id : 컬럼 아이디,
     *      value : 컬럼 아이디 값,
     *	}
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
    getRowById = (id, p) => {
        
        //아이디 검색 값을 초기화 한다.
        var idParam = _.merge({}, {
            id: null,
            value: null,
        },id || {});

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            value: null,
            status : ROW_STATUS.A
        },p || {});

        let rows = this.getRows(param);


        if(rows != null && rows.length > 0){
            return rows.filter((it) => {            
                return it[idParam.id] === idParam.value;
            })[0] || null;
        }

        return null;
    }

    /** 
     * 로우 데이터 가져오기, row 번호를 넣지 않으면 0번째 데이터를 가져온다.
     * 
     *	샘플)
     *	p = {
     *		row	: 데이터를 읽을 row 번호.
     *		metadata : true
     *	}
     * @param p 파라메터 정보
     * @return {} row 데이터. row가 존재 하지 않으면 null 리턴
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    getRow = (p) => {
        
        var common = this.#common;
        var grid = this.#grid;
        // var properties = this.#config.properties;
        var controlVars = this.#controlVars;
        var userColumns = this.#column.getColumnsMap();

        //파라메터 값을 초기하 한다.
        var param =	_.merge({}, {
            row : controlVars.selectRow,
            metadata : true,
            excludeColumn: []
        }, p || {});
        
        //row가 존재 하지 않으면 null 값 리턴
        if(!grid.rows[param.row]){
            return null;
        }
        
        var gridRow = grid.rows[param.row];
        var item = gridRow.dataItem;
        var gridIndex = gridRow.index;
        var rowData = {};
        
        //데이터를 새로운 객체에 담는다.
            
        let getValueString = (value) => {

            if(typeof(value) == 'string'){

                if( value == '' ) {
                    return value;
                }else if( value === null || value === undefined ) {
                    return null;
                }
            }

            return value;
        }

        for(var columnId in userColumns){
            
            var orgValKey = common.getOrgValueKey(columnId);
            var preValKey = common.getPreValueKey(columnId);


            rowData[columnId] = typeof(item[columnId]) == 'number' ?  item[columnId]   || 0 : getValueString(item[columnId]) ;
            rowData[orgValKey] = typeof(item[orgValKey]) == 'number' ?  item[orgValKey] || 0 : getValueString(item[orgValKey]);
            rowData[preValKey] = typeof(item[preValKey]) == 'number' ?  item[preValKey] || 0 : getValueString(item[preValKey]);
            rowData[constant.ROW_STATUS_KEY] = item[constant.ROW_STATUS_KEY] || null;
            rowData[constant.CHECKED_KEY] = item[constant.CHECKED_KEY] || null;
            rowData[constant.INDEX_KEY] = item[constant.INDEX_KEY] || null;

        }
        
        rowData[constant.GRID_INDEX_KEY] = gridRow.index;

        //메타데이터 여무가 false라면 _로 시작하는 필드는 모두 제거한다.
        if(param.metadata !== true){
            common.deleteRowMetaData(rowData, param.metadata);
        }

                
        //excludeColumn 컬럼 제거.
        for (const key in rowData) {

            if(param.excludeColumn.includes(key)){
                delete rowData[key];
            }
        }

        return rowData;
    }

    /** 
     * 로우 데이터 여러건 가져오기 
     * 
     *	샘플)
        *	p = {
        *		checked : true면 체크된 데이터만, false면 체크여부 상관 없이 모든 데이터를 가져온다.
        *		status 	: C,U,D 값을 선택하여 호출 한다.
        *		metadata : true
        *	}
        * @param p 파라메터 정보
        * @return [{}] row data가 들어있는 배열. 값이 존재 하지 않으면 null 리턴.
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    getRows = (p) => {
        
        var common = this.#common;
        var grid = this.#grid;
        // var properties = this.#config.properties;
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            checked : null,
            status : ROW_STATUS.N,
            metadata : true,
            excludeColumn: []
        },p || {});
        
        var rows = [];
        var items = grid.rows;
        var length = items.length;
        
        var isArrayOfStatus = (param.status instanceof Array ); //status 값이 배열 값 인지 아닌지 확인.
        var isNotNullCheck = !(param.checked == null);

        for (var i = 0; i < length; i++) {
            
            var item = this.getRow({row : i});

            // 1. checked 값이 null 이면 모든 데이터 등록.
            // 1.1. param.status 값이 문자열 또는 배열 값에 ROW 상태값 N이 있으면 모든 데이터를 등록한다.
            // 1.2. param.status 값이 문자열 또는 배열 값에 ROW 상태값 N값이 아닐 경우 각(C,U,D) 상태 값에 맞는 데이터를 등록 한다.
            if(!isNotNullCheck){
                common.setRowsStatusContition(rows, item, param.status, isArrayOfStatus, param.metadata, param.excludeColumn);
                
            // 2.checked가 null 이 아니고 true 또는 false 값이 있을 경우 데이터 출력.
            // 2.1. param.status 값이 문자열 또는 배열 값에 ROW 상태값 N이 있으면 모든 데이터를 등록한다.
            // 2.2. param.status 값이 문자열 또는 배열 값에 ROW 상태값 N값이 아닐 경우 각(C,U,D) 상태 값에 맞는 데이터를 등록 한다.	
            }else if(isNotNullCheck && (param.checked === item[constant.CHECKED_KEY])){
                common.setRowsStatusContition(rows, item, param.status, isArrayOfStatus, param.metadata, param.excludeColumn);
            }
        };
        
        if(rows.length == 0){
            return null;
        }
        
        return rows;
    }

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

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            checked : null,
            status : ROW_STATUS.N,
        },p || {});

        let rows = this.getRows(param);

        if(rows && rows.length > 0){
            return true;
        }

        return false;
    }

    /** 로우 갯수 
     * @return Number
     * @author 장진철(zerocooldog@pionnet.co.kr)	 
     */
    getRowCount = () => {
        return this.#grid.rows.length;
    }

    /** 
     * 특정 cell에 새로운 값 추가
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호
        *		id 		: column 아이디
        *		value 	: 입력 값.
        *		force   : editable false 일 경우나 값을 강제 등록 할 경우.
        *	}
        *
        * @param p 파라메터 속성.
        * @author 장진철(zerocooldog@pionnet.co.kr)	 
        */
    setValue = (p) => {
      
        var common = this.#common;
        var events = this.#config.events;
        var grid = this.getGrid();
        var userColumns = this.#column.getColumnsMap();

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row		: 0,
            id		: null,
            value	: null,
            force	: false,
            forceStatus: {
                status : null,
                checked: null   
            },
            ignoreEditable	: false,
            refresh : true
        },p || {});
        
        var userColumn = userColumns[param.id];

        if(userColumn && !userColumn.editable && !param.force){
            alert("읽기 전용 입니다. 해당 열[row:"+param.row+"]을 수정 할 수 없습니다.");
            return;
        }
        
        
        var row = grid.rows[param.row].dataItem;
        var rowStatus = row[constant.ROW_STATUS_KEY];

        var opv = common.setOrgAndPreValue(param.id, row); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}
        
        //param.value null 값이 아니고 원본 값과 같지 않으면 값이 변경 된 것으로 판단.
        var isChangedValue = (param.value != null && param.value != opv.orgValue);
        var isNotRowStatusCD = (rowStatus !== ROW_STATUS.C && rowStatus !== ROW_STATUS.D);

        var isEditableColumn = userColumn.editable || p.ignoreEditable === true

        //새로운 값으로 갱신한다.
        row[param.id] = param.value;
        

        
        var isChange = false;
        for ( var key in row) {
            
            //메타 데이터 키는 진행하지 않는다.
            if(
                key == constant.ROW_STATUS_KEY || 
                key == constant.CHECKED_KEY || 
                key == constant.INDEX_KEY ||
                key.indexOf(constant.PREFIX_ORG_VALUE) > -1  ||
                key.indexOf(constant.PREFIX_PRE_VALUE) > -1
            ){
                continue;
            }
            
            var validOrgValKey = common.getOrgValueKey(key);

            var itemValue = (param.id === key) ? param.value : row[key];
            
            if(row.hasOwnProperty(validOrgValKey) && row[validOrgValKey] !== itemValue){
                isChange = true;
                break;
            }
        }

        if(isEditableColumn){
            if(isChange){
                row[constant.ROW_STATUS_KEY] = ROW_STATUS.U;
                row[constant.CHECKED_KEY] = true;		
            }else{
                row[constant.ROW_STATUS_KEY] = ROW_STATUS.N;
                row[constant.CHECKED_KEY] = false;		
            }
        }

        if(param.forceStatus){
            if( param.forceStatus.status != null) {
                row[constant.ROW_STATUS_KEY] = param.forceStatus.status;
            }

            if( param.forceStatus.checked != null) {
                row[constant.CHECKED_KEY] = param.forceStatus.checked;		
            }
        }
    
        //원본값이 아닌 새로운 값으로 변경 되었다면 changedCellByNewValue 이벤트 발생.
        events.cell.changedCellByNewValue({
            id : param.id,
            row : param.row,
            value : param.value,
            preValue : opv.preValue,
            orgValue : opv.orgValue,
            dataType : userColumn.dataType 
        });
        
        //원본 값 일치여부 상관없이 무조건 changedCell 이벤트 발생.
        events.cell.changedCell({
            id : param.id,
            row : param.row,
            value : param.value,
            preValue : opv.preValue,
            orgValue : opv.orgValue,
            dataType : userColumn.dataType 
        });

        //cell 만 업데이트 한다.
        if(param.refresh){
            grid.refreshCells();
        }
    }
    
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
    getValue = (p) => {
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row		: 0,
            id		: null
        },p || {});
        
        var row = this.getRow({row : param.row});
        
        if(!row){
            return null;
        }
        
        return row[p.id] || null;
    }

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
        * @author 장진철(zerocooldog@zen9.co.kr)	 
        */
    getCell = (p) => {
        
        var common = this.#common;
        var grid = this.getGrid();

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row		: 0,
            id		: null
        },p || {});
        
        var row = this.getRow({row : param.row});
        
        //row 값이 존재 하지 않으면 null 리턴.
        if(!row){
            return null;
        }
        
        //name, 또는 binding 값으로 해당 컬럼을 찾는다.
        var column = grid.columns.getColumn(param.id);
        var col = column.index;
        
        var opv = common.setOrgAndPreValue(param.id, row); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}

        var cellElement = common.getCellElement(grid, param.row, col);
        
        var cell = {
                id : param.id,
                row : param.row,
                value : row[param.id] || null,
                preValue : opv.preValue,
                orgValue : opv.orgValue,
                html : cellElement.innerHTML,
                text : cellElement.innerText,
                dataType : column.dataType
            };
        
        return cell;
    }
    
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
        * @author 장진철(zerocooldog@zen9.co.kr)	 
        */
    selectCell = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row		: 0,
            id		: null
        },p || {});
        
        //name, 또는 binding 값으로 해당 컬럼을 찾는다.
        var column = grid.columns.getColumn(param.id);
        var col = column.index;
        
        grid.select(param.row, col);
    }

    /**
     * Cell 편집 또는 비 편집(읽기전용)으로 변경.
     * 
     * @param p 파라메터 속성.
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    setCellEditable = (p) => {
			
        var common = this.#common;
        var grid = this.getGrid();
        var controlVars = this.#controlVars;

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : -1,
            id : null,
            editable : false,
            cssClass : null,
            refresh  : false
        },p || {});
        
        var row = param.row;
        var id = param.id;

        var item = this.getRow({
            row : row
        });
        
        if(!item){
            return;
        }
        
        if(id instanceof Array){

            var idLength = id.length;
            for (var i = 0; i < idLength; i++) {

                let columnId = id[i];
                            
                let gColumn = grid.columns.getColumn(columnId);
                if(gColumn.isReadOnly){
                    gColumn.isReadOnly = !param.editable;
                }                
                var indexKey = common.getCellCustomKey(item[constant.INDEX_KEY], columnId);
                if(indexKey){
                    controlVars.editableCells[common.getCellCustomKey(item[constant.INDEX_KEY], columnId)] = {editable : param.editable, cssClass : param.cssClass};
                }
//					console.log(common.getCellCustomKey(item[constant.INDEX_KEY], id[i]),item , item[constant.INDEX_KEY],id[i],row)
            }

        }else{

            if (row > -1 && (id && id != "")) { // cell 지정
                controlVars.editableCells[common.getCellCustomKey(item[constant.INDEX_KEY], param.id)] = {editable : param.editable, cssClass : param.cssClass};
                let gColumn = grid.columns.getColumn(param.id);
                if(gColumn.isReadOnly){
                    gColumn.isReadOnly = !param.editable;
                }

            }

        }
        
        if(param.refresh === true){
            //새로고침 해줘야 화면이 갱신 된다.
            grid.refresh();
        }
        
    }

    /**
     * Row(행) 편집 또는 비 편집(읽기전용)으로 변경. 구현 완성도 떨어짐. 아직 미구현 @사용금지.
     * 
     * @param {*} p 
     */
    setRowEditable = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : -1,
            editable : false,
            cssClass : null
        },p || {});
        

        grid.rows[param.row].isReadOnly = !p.editable;

        if(param.cssClass){
            grid.rows[param.row].cssClass = param.cssClass;
        }

    }

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
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    changeStatus = (p) => {
        
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : 0,
            status : ROW_STATUS.N,
            checked : null
        },p || {});
        
        //데이터를 여러건 변경해야 하기 때문에 grid row 를  직접 변경한다.
        var row = grid.rows[param.row].dataItem;
        
        //row 값이 존재 하지 않으면 null 리턴.
        if(!row){
            return null;
        }
        
        row[constant.ROW_STATUS_KEY] = param.status;
        if(param.checked !== null){
            row[constant.CHECKED_KEY] = param.checked;
        }
        
        //새로고침 해줘야 화면이 갱신 된다.
        grid.refresh();
        
    }

    /** 
     * 필수 컬럼 데이터가 공백인지 검증. 검증이 올바르지 않으면 경고창을 출력한다.
     * 
     *	샘플)
     *	p = {
     *		alert 			: 기본 경고창 출력 여부,
     *		startEditing 	: 공백 컬럼 편집 시작 여부.
     *	}
     *
     * @param p 파라메터 속성 정보
     * @return boolean
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    isRequired = (p) => {
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            alert : true,
            startEditing : true
        },p || {});

        var common = this.#common;
        var grid = this.getGrid();
        var userColumns = this.#column.getColumnsMap();

        var result = true;
        
        var items = grid.rows;
        var length = items.length;
        
        for (var i = 0; i < length; i++) {
            
            var item = grid.rows[i].dataItem;
            
            for ( var columnId in userColumns) {
                if(userColumns[columnId].required){
                    
                    result = common.isRequired(item[columnId],{
                        id : columnId,
                        row : i,
                        header : userColumns[columnId].header,
                        alert : param.alert
                    });
                    
                    if(!result){
                        
                        if(param.startEditing){
                            
                            //name, 또는 binding 값으로 해당 컬럼을 찾는다.
                            var column = grid.columns.getColumn(columnId);
                            var col = column.index;

                            grid.startEditing(true, i, col, true);								
                        }

                        result = false;
                        break;							
                    }
                }
            }
            
            if(!result){
                break;
            }
        }			

        return result;
    }

    /**
     * 현재 선택된 row가 children 영역이 있을 경우 바로 추가.
     * 없을 경우 새로 children 배열을 만들어 추가한다.
     * 
     * 자식 및 형제 노드 처리시 필요.
     * 
     * 공개된 함수가 아니기 때문에 내부 로직 처리시에만 사용한다.
     * 
     * @param selectedRowItem 현재 선택된 row의 dataItem
     * @param item 현재 선택된 로우에 추가할 신규 item
     */
    #setChildren = (selectedRowItem, item) => {
        if(selectedRowItem.children){
            selectedRowItem.children.push(item);
        }else{
            selectedRowItem.children = [];
            selectedRowItem.children.push(item)
        }
    }
    /**
     * 선택 된 row의 부모 row를 선택 후 그 이하 모든 자식의 갯수를 구한다.
     * 공개된 함수가 아니기 때문에 내부 로직 처리시에만 사용한다.
     * 
     * @param parentItem 부모 row 객체. ex) grid.rows[부모 row 번호]
     * @return Number
     */
    #allChildrenLength = (parentItem) => {
        
        var length = 0;
        
        var childrenLength = function(item){
            
            if(item && item.children){

                for (var i = 0; i < item.children.length; i++) {
                    length++;
                    childrenLength(item.children[i]);
                }
            }
            return length;
        };
        
        return childrenLength(parentItem);
    }
    
    /**
     * 선택 된 row의 부모 row를 선택 후 그 이하 모든 자식의 갯수를 구한다.
     * 공개된 함수가 아니기 때문에 내부 로직 처리시에만 사용한다.
     * 
     * @param parentItem 부모 row 객체. ex) grid.rows[부모 row 번호]
     * @return Number
     */
    
    #getTreeRow = (collectionViewItems, id, row) => {
        
        
        var childrenLength = function(item){
            
            if(item.hasOwnProperty(id) && item[constant.INDEX_KEY] === row){
                return item;
            }
            
            if(item && item.children){

                for (var i = 0; i < item.children.length; i++) {
                    childrenLength(item.children[i]);
                }
            }
            
            return null;
        };
        
        var length = collectionViewItems.length;
        var rowData = null;
        for (var i = 0; i < length; i++) {
            rowData = childrenLength(collectionViewItems[i]);
            
            if(rowData != null){
                return rowData;
            }
        }
        
        return null;
    }

    /** 
     *	row 추가 
        *
        *	샘플)
        *	p = {
        *		row		: 추가 할 row 번호,
        *		data	: 그리드에 추가할 데이터 (JSON 형식) {id: "id", name : "name"}
        *	}
        *
        * @author 장진철(zerocooldog@zen9.co.kr)
        */		
       addRowToTree = (p)  => {
        
        var common = this.#common;
        var properties = this.#config.properties;
        var collectionView = this.getCollectionView();
        var grid = this.getGrid();
        var tracking = this.getTracking();
        var controlVars = this.#controlVars;
        var userColumns = this.#column.getColumnsMap();
        var instance = this;

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : 0,
            tracking : true,
            data : {},
            sibling : false
        },p || {});
        
        //데이터 처리시 별도의 이벤트가 발생하지 않도록 transaction 걸어 둔다.
        //beginUpdate, endUpdate하지 않으면 row 추가시 loadedRows 가 실행된다.
        collectionView.beginUpdate();
        
        var item = {};
        
        for ( var columnId in userColumns) {
            
            var column = grid.getColumn(columnId);
            var userColumn = userColumns[columnId];
            
            // 값이 셋팅되어 있지 않으면 NULL로 초기화.
            if(item[columnId] === undefined){
                item[columnId] = null;
            }

            //신규 등록시 boolean 형식은 무조건 N값을 넣는다.
            if(column && userColumn.cellType === CELL_TYPE.CHECK_BOX){
                item[columnId] = "N";
            }
            
            var orgValKey = common.getOrgValueKey(columnId);
            var preValKey = common.getPreValueKey(columnId);

            // 데이터 변경시 이전 값과 원래 값을 알기 위해 초기에 설정.
            item[orgValKey] = item[columnId];
            item[preValKey] = item[columnId];
        }
        
        //넘어오는 데이터가 있다면 초기화 된 item 값에 대입한다.
        if(param.data){
            item = _.merge(item,param.data);
        }

        //신규 row를 추가하기 위해여 row 객체 생성 후 item 대입.
        var row = new wijmo.grid.Row();
        row.dataItem = item;
        
        var selectedIndex = controlVars.selectRow;		
        var selectedRow = grid.rows[selectedIndex];
        var selectedRowItem = null;
        
        if(selectedRow){
            var level = selectedRow.level;
            selectedRowItem = selectedRow.dataItem;

            var parentNode = null;
            
            if(param.sibling){
                
                parentNode = this.getParentNode({row : selectedIndex});
                
                if(parentNode){
                    
                    selectedRow = parentNode;
                    selectedRowItem = selectedRow.dataItem;
                    this.#setChildren(selectedRowItem, item);
                    item[properties.tree.parent] = selectedRowItem[properties.tree.id];

                }else{
                    collectionView.items.push(item);
                }
            }else{
                this.#setChildren(selectedRowItem, item);
                item[properties.tree.parent] = selectedRowItem[properties.tree.id];
            }

        }else{
            collectionView.items.push(item);
        }
        
        //신규로 데이터가 추가 되기 때문에 ROW_STATUS값을 Create 약자인 C로 설정 한다. 체크박스는 자동으로 선택.
        item[constant.ROW_STATUS_KEY] = constant.ROW_STATUS.C;
        item[constant.CHECKED_KEY] = true;
        
        //신규 추가된 데이터를 따로 추적 보관한다.
        tracking[constant.ROW_STATUS.C].push(row);
        
        //신규 데이터 추가시 발생 하는 이벤트
        events.row.rowAddedNew(item);
        //grid에 로우 추가 될 경우 이벤트 발생. ROW_STATUS.N,ROW_STATUS.C 모두 해당
        events.row.rowAdded(item);
        
        // 내용에 따라 row 크기 자동 변환 여부가 true 일 경우 처리. ps. 나중에 확인해보고 필요없으면 제거.
        if(properties.autoRowResize){
            common.setAutoRowResize(grid,param.row);
        }

        collectionView.refresh();
        
        collectionView.endUpdate();

        //tree grid 형식으로 추가 할 경우,  children속성에 데이터가 들어가면 grid에서는 위치를 찾을 수가 없다.[ {data : 1, children : []}]
        // 그렇기 때문에 일일이 collectionView 데이터를 뒤져서 선택 할 위치를 파악한다.
        //tree에서 row 추가 된 위치를 구한다. level === 0 일 경우에는 전체 아이템 갯수를 구한다.
        var addRowIndex = collectionView.items.length;
        
        //형재 노드가 아니거나 형재 노드이지만 현재 선택된 row level이 0보다 클 경우 로직 진행.
        //현재 선택된 row 번호 + childrenLength() 함수를 이용하여 현재 추가 된 row 번호가 몇 번째 인지 탐색 한다.
        //level 0일 때는 moveCurrentTo를 이용하여 선택 하고 그 외에는 grid.select(addRowIndex, 1); 이용하여 선택 한다.
        if(!param.sibling || param.sibling && grid.rows[selectedIndex] && grid.rows[selectedIndex].level > 0  ){
            if(selectedRow){
                addRowIndex = selectedRow.index + this.#allChildrenLength(selectedRowItem);		
            }
            //추가 된 로우를 선택 한다.
            grid.select(addRowIndex, 1);

        }else{
            collectionView.moveCurrentTo(item);
        }
    }

    /***
     * Tree형 그리드일 경우 현재 선택된 행의 부모 노드를 가져온다.
     * 
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 선택 된 row 번호
        *	}
        * @param p 파라메터 속성.
        * @author 장진철(zerocooldog@zen9.co.kr)	 
        */
    getParentNode = (p) => {
        
        var grid = this.getGrid();
        var controlVars = this.#controlVars;

        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : controlVars.selectRow
        },p || {});
        
        var row = grid.rows[param.row];
        
        if(row){
            // get row level
            var startLevel = row instanceof(wijmo.grid.GroupRow) ? row.level : -1;
            var startIndex = row.index;
            // travel up to find parent node
            for (var i = startIndex-1 ; i >= 0; i--) {
                var thisRow = row.grid.rows[i],
                thisLevel = thisRow instanceof(wijmo.grid.GroupRow) ? thisRow.level : -1;
                
                if (thisLevel > -1) {
                    if (startLevel == -1 || (startLevel > -1 && thisLevel < startLevel)) {
                        return thisRow;
                    }
                }
            }
        }

        // not found
        return null;
    }

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
        * @author 장진철(zerocooldog@zen9.co.kr)
        */
    checkedNode = (p) => {

        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge(true,{}, {
            row : 0,
            id	: null,
            checked : true
        },p || {});
        
        p.refresh = false //아래 함수 실행하기 위해 전달. 아래 checkedParentNode, checkedChildNode 함수에서는 grid화면을 갱신하지 않는다.

        this.checkedParentNode(param, this);
        this.checkedChildNode(param, this);
        
        grid.refresh();

    }

    		
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
		 * @author 장진철(zerocooldog@zen9.co.kr)
		 */
		checkedParentNode = (p, ins) => {

			var instance = ins || this;

			var grid = instance.getGrid();
			var userColumns = instance.getColumn().getColumnsMap();

			//파라메터 값을 초기화 한다.
            var param =	_.merge(true,{}, {
				row : 0,
				id	: null,
				checked : true,
				refresh : true
			},p || {});

			var currentRow = instance.getParentNode({
				row : param.row
			});
			
			var isControlCheckbox = (param.id === constant.CHECKED_KEY) ? true : false;

			if(isControlCheckbox){

				while(currentRow != null){
					
					let isCheckedChild = false;
					let currentRowDataItem = currentRow.dataItem;
					if(currentRowDataItem.children){
						
						let childrenLength = currentRowDataItem.children.length;
						
						for (let i = 0; i < childrenLength; i++) {
							let childrenDataItem = currentRowDataItem.children[i];
							if(childrenDataItem[param.id] === true){
								isCheckedChild = true;
							}
						}
					}
					
					var value = param.checked;

					if(!param.checked && isCheckedChild){
						value = true;
					}
					
					currentRowDataItem[constant.CHECKED_KEY] = value;
					
					currentRow = this.getParentNode({
						row : currentRow.index
					});
				}
				
			}else{
				
				var column = userColumns[param.id];

				while(currentRow != null){
					
					let isCheckedChild = false;
					let currentRowDataItem = currentRow.dataItem;
					if(currentRowDataItem.children){
						
						let childrenLength = currentRowDataItem.children.length;
						
						for (let i = 0; i < childrenLength; i++) {
							let childrenDataItem = currentRowDataItem.children[i];
							if(childrenDataItem[param.id] === column.checkBox.Y){
								isCheckedChild = true;
							}
						}
					}
					
					let value = (param.checked) ? column.checkBox.Y : column.checkBox.N;

					if(!param.checked && isCheckedChild){
						value = column.checkBox.Y;
					}
					
					this.setValue({id : param.id, row : currentRow.index, value : value, refresh : param.refresh});

					
					currentRow = this.getParentNode({
						row : currentRow.index
					});
				}
			}
			
			
			if(param.refresh){
				grid.refresh();
			}
        }
 		
		/** 
		 * Tree형 그리드 일 경우 현재 node에서 하위 자식노드 값을 가져온다. 하위 자식노드의 자식노드는 가져오지 않는다.
		 * 
		 *	샘플)
		 *	p = {
         *		id : 열(컬럼) 아이디,
         *		row : 행 번호,
		 *	}
		 *
		 * @author 장진철(zerocooldog@zen9.co.kr)
		 */
		getChildNode = (p) => {
			
			var instance = this;
			
			var grid = instance.getGrid();
			var userColumns = instance.getColumn().getColumnsMap();

			//파라메터 값을 초기화 한다.
            var param =	_.merge(true,{}, {
				row : 0,
				id	: null
			},p || {});

			var item = grid.rows[param.row].dataItem;

			var rowData = {};
			if(item && item.children && item.children.length > 0){
						
				//데이터를 새로운 객체에 담는다.
				for ( var id in item.children) {
					
					for(var columnId in userColumns){
						
						var orgValKey = instance.#common.getOrgValueKey(columnId);
						var preValKey = instance.#common.getPreValueKey(columnId);

						if(
								columnId === id || 
								id === orgValKey || 
								id === preValKey || 
								id === constant.ROW_STATUS_KEY ||
								id === constant.CHECKED_KEY ||
								id === constant.INDEX_KEY 
						){
							rowData[id] = item[id];
							break;
						}
					}
				}
				
				return item.children;
			}
			
			return null;
		}
		
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
		 * @author 장진철(zerocooldog@zen9.co.kr)
		 */
		checkedChildNode = (p) => {
			
			var instance = this;
			
			var grid = instance.getGrid();
			var userColumns = instance.getColumn().getColumnsMap();

			//파라메터 값을 초기화 한다.
			var param =	_.merge(true,{}, {
				row : 0,
				id	: null,
				checked : true,
				refresh : true
			},p || {});

			var currentGridRow = grid.rows[param.row];

			var isControlCheckbox = (param.id === constant.CHECKED_KEY) ? true : false;
			
			var column = userColumns[param.id];
			var value = (isControlCheckbox) ? param.checked : ((param.checked) ? column.checkBox.Y : column.checkBox.N);
			
			if(isControlCheckbox){
				column = userColumns[param.id];
				value =  param.checked;
			}else{
				column = userColumns[param.id];
				value = (param.checked) ? column.checkBox.Y : column.checkBox.N;
			}

			var childrenLength = function(item){
				
				if(!item){
					return;
				}
				
				var isArrayItem = item && (item instanceof Array);
				if(!isArrayItem) {
					if(isControlCheckbox){
						item[constant.CHECKED_KEY] = value;
					}else{
						instance.setValue({id : param.id, row : item[constant.INDEX_KEY], value : value, refresh : param.refresh });
					}
				}
				
				if(item && item.children || isArrayItem){

					var childrenItem =  (isArrayItem) ? item : item.children;
					var childrenItemLength = childrenItem.length;
					
					for (var i = 0; i < childrenItemLength; i++) {
						childrenLength(childrenItem[i]);
					}
				}
			};

			childrenLength(currentGridRow.dataItem.children);
			
			if(param.refresh){
				grid.refresh();
			}
        }
        
		
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
		 * @author 장진철(zerocooldog@zen9.co.kr)
		 */
		hasChildNode = (p) => {
						
			var grid = this.getGrid();

			//파라메터 값을 초기화 한다.
			var param =	_.merge(true,{}, {
				row : 0,
				id	: null
			},p || {});

			var item = grid.rows[param.row];

			if(item){
				return item.hasChildren;
			}
			
			return false;
		}

    /**
     * tree grid 일 경우에 자식이 있는 row일 경우 접어서 표현한다.
     *	샘플)
     *	p = {
     *		row 	: row 번호,	기본 값	: 0
     *	}
     * @param p 
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    collapseRow = (p) => {
        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : 0
        },p || {});
        
        var row = grid.rows[param.row];
        
        if(row){
            if(row.hasChildren){
                row.isCollapsed = true;
            }else{
                alert("하위 열을 가지고 있는 부모 열이 아닙니다.");
            }
        }
    }

    /**
     * tree grid 일 경우에 자식이 있는 row일 경우 펼처서 표현한다.
     *	샘플)
        *	p = {
        *		row 	: row 번호,	기본 값	: 0
        *	}
        * @param p 
        * @author 장진철(zerocooldog@zen9.co.kr)	 
        */
    expandRow = (p) => {

        var grid = this.getGrid();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge({}, {
            row : 0
        },p || {});
        
        var row = grid.rows[param.row];
        
        if(row){
            if(row.hasChildren){
                row.isCollapsed = false;
            }else{
                alert("하위 열을 가지고 있는 부모 열이 아닙니다.");
            }
        }
    }

    /**
     * tree grid 일 경우에 자식이 있는 모든 row는 접어서(level 0) 표현한다.
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    collapseAll = () => {
        var grid = this.getGrid();
        grid.collapseGroupsToLevel(-1);
    }

    /**
     * tree grid 일 경우에 자식이 있는 모든 접힌 row를 찾아 펼쳐서 표현한다.
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    expandAll = () => {
        var grid = this.getGrid();
        grid.collapseGroupsToLevel();
    }

    /**
     * excel 파일에 있는 내용을 grid에 추가한다.
     *	샘플)
     *	p = {
     *		columnHeader 	: columnHeader 포함 존재 여부, 기본 값	: false
     *		files 			: <input id='file' type=file> 객체의 files document.getElementById("file").files[0]
     *	}
     * @param p
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    importExcel = (p) => {

        var instance = this;
        var grid = this.getGrid();

        //파라메터 값을 초기화 한다.
        var param =	_.merge(true,{}, {
            columnHeader : false,
            files : null
        },p || {});

        //FileReader readAsBinaryString 사용 유무 체크 IE10에서는 해당 함수를 지원하지 안흠.
        var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
        
        var fixdata = function(data) {
            var o = "", l = 0, w = 10240;
            for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
            o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
            return o;
        }
        
        //chrome,firefox,ie10 이상
        var reader = new FileReader();
        var f = param.files;
        var name = f.name;
        reader.onload = function(e) {

            var data = e.target.result;
            var wb;
            if(rABS) {
                wb = XLSX.read(data, {type: 'binary'});
            } else {
                var arr = fixdata(data);
                wb = XLSX.read(btoa(arr), {type: 'base64'});
            }				
            var result = {};
            
            if(param.columnHeader === true){
                wb.SheetNames.forEach(function(sheetName) {
                    var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                    if(roa.length > 0){
                        result[sheetName] = roa;
                    }
                });
            }else{
                var csvData = [];
                wb.SheetNames.forEach(function(sheetName) {
                    var csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName],{FS:"```",RS:"|||"});
                    if(csv.length > 0){
                        csvData.push(csv);
                        result[sheetName] = csvData.join("|||").split("|||");
                    }
                });
            }
            
            //엑셀 데이터 내용을 담는다.
            var newExcelrow = [];
            
            for ( var sheetKey in result) {
                var rowLength = result[sheetKey].length;	
                
                //sheet에 내용이 들어있지 않으면  내용이 없는 것이므로 빠져나온다.
                if(rowLength == 0){
                    break;
                }

                //excel row 에 cell에 들어갈 데이터가 있다면 진행 한다.
                for (var i = 0; i < rowLength; i++) {
                    
                    var excelRow = result[sheetKey][i];
                    var addRow = {};
                    
                    if(param.columnHeader === true){
                        for ( var key in excelRow) {
                            var column = grid.columns.getColumn(key);

                            if(column){
                                addRow[key] = excelRow[key];	
                                //엑셀파일이 신규 등록 되기 때문에 row status 값과 cehckbox값을 true로 지정한다.
                                addRow[constant.ROW_STATUS_KEY] = constant.ROW_STATUS.C;
                                addRow[constant.CHECKED_KEY] = true;
                            }
                        }
                    }else{
                        var excelData = excelRow.split("```");
                        var excelDataLength = excelData.length;

                        for (var n = 0; n < excelDataLength; n++) {
                            
                            let column = grid.columns[n];

                            if(column){
                                addRow[column.binding] = excelData[n];	
                                //엑셀파일이 신규 등록 되기 때문에 row status 값과 cehckbox값을 true로 지정한다.
                                addRow[constant.ROW_STATUS_KEY] = constant.ROW_STATUS.C;
                                addRow[constant.CHECKED_KEY] = true;
                            }
                        }
                        
                    }

                    newExcelrow.push(addRow);
                }//end for (var i = 0; i < sheetLength; i++) {	

            }
            
            //collectionView에 데이터 생성
            instance.#setCollectionView(grid,newExcelrow);
        };
        

        if(rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);	
        return;

    }

    /**
     * grid에 있는 내용을 excel 파일로 내려받는다.
     *	샘플)
     *	p = {
     *		columnHeader 	: columnHeader 포함 여부, 기본 값	: true
     *		rowHeader 		: rowHeader 포함 여부,		기본 값	: false,
     *      fileName		: 엑셀 파일 명,			기본 값 	: grid id
     *	}
     * @param p
     * @author 장진철(zerocooldog@zen9.co.kr)	 
     */
    exportExcel = (p) => {
        
        var grid = this.getGrid();
        var gridId = this.getId();
        var properties = this.getConfig().properties;

        //파라메터 값을 초기화 한다.
        var param =	_.merge(true,{}, {
            columnHeader : true,
            rowHeader : false, //Deprecated
            fileName : gridId||null
        },p || {});     
        
        var result = wijmo.grid.ExcelConverter.export(grid, {
            includeColumnHeader : param.columnHeader,
            formatItem: function(args) {
                var p = args.panel, row = args.row, col = args.col, xlsxCell = args.xlsxCell, cell, color;
                if (p.cellType === wijmo.grid.CellType.Cell) {

                    //데이트 타입일 경우 포맷 지정.
                    if (p.columns[col].dataType === wijmo.DataType.Date) {
                        cell = args.getFormattedCell();
                        xlsxCell.value = cell.textContent.trim();
                    }
                }
            } 
        });		

        let blob = new Blob([ result.base64Array ]);

        let anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = param.fileName+".xlsx";
        document.body.appendChild(anchor)
        anchor.click();
        anchor.remove();
    }

    /***
     * 데이터를 검색하여 해당 row로 이동 한다.
     *	샘플)
     * 	p = {
     *		id 		: 컬럼 아이디,
     *		keyword : 검색 단어.
     *	}
     * @param p
     */
    searchRow = (p) =>{
   
        var collectionView = this.getCollectionView();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge(true,{}, {
            id : null,
            keyword : null,
        },p || {});
        
        var searchData = null;

        // gridRow filter
        collectionView.filter = function(item) {

            var value = item[param.id];
            var result = false;
            console.log(value, typeof(value))
            if(typeof(value) == "number"){
                result = (value == Number(param.keyword));
            }else{
                result = item[param.id].indexOf(param.keyword) > -1;
            }

            if (result && searchData == null) {
                searchData = item;
            }

            return true;

        };

        if(searchData != null){
            collectionView.moveCurrentTo(searchData);
        }
    }
    
    /***
     * keyword에 부합하는 row만 화면에 출력 한다.
     *	샘플)
     *	p = {
     *		id 		: 컬럼 아이디,
     *		keyword : 검색 단어.
     *	}
     * @param p
     */
    filterRow = (p) =>{
        
        var grid = this.getGrid();
        var events = this.getConfig().events;
        var collectionView = this.getCollectionView();
        
        //파라메터 값을 초기화 한다.
        var param = _.merge(true,{}, {
            id : null,
            keyword : null,
        },p || {});
        
        // CollectionView filter
        collectionView.filter = function(item) {

            var value = item[param.id];
            var result = false;
            
            if(typeof(value) == "number"){
                result = (value == Number(param.keyword));
            }else{
                if(param.id instanceof Array){

                    for (let index = 0; index < param.id.length; index++) {
                        let id = param.id[index];
                        result = item[id].indexOf(param.keyword) > -1;

                        if(result){
                            break;
                        }
                    }
                }else{
                    result = item[param.id].indexOf(param.keyword) > -1;
                }
            }
            
            if(!param.keyword || param.keyword == ""){
                result = true;
            }

            return result;

        };
        
        var filterData = [];
        var rowsLength = grid.rows.length;
        
        for (var i = 0; i < rowsLength; i++) {
            filterData.push(grid.rows[i].dataItem);
        }
        
        events.endFilter(filterData);
    }

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
    setBackgroundColor = (p) => {
        
        var controlVars = this.getControlVars();
        var common = this.#common;

        //파라메터 값을 초기화 한다.
        var param =	_.merge(true,{}, {
            row : controlVars.selectRow,
            id : null,
            color : null,
        },p || {});
        
        var item = this.getRow({
            row : param.row
        });
        
        if(item){
            
            var styleCellKey = common.getCellCustomKey(param.row, param.id);
            var styleCell = controlVars.styleCells[styleCellKey];
            
            if(!styleCell){
                styleCell = controlVars.styleCells[styleCellKey] = {};
            }
            styleCell.backColor = param.color;


        }else{
            console.warn("[row : "+param.row+"] 데이터가 존재 하지 않습니다")
        }
        
        this.refresh()
    }

    /**
     * column 객체에서 설정하지 않고 grid 함수를 이용하여 적용 한 스타일 제거.
     */
    removeCustomStyles = () => {
        var controlVars = this.getControlVars();
        controlVars.styleCells = {};
    }

    /** 초기화 */
    restore = (p) => {
        
        var grid = this.getGrid();
        var collectionView = this.getCollectionView();
        var common = this.#common;

        var orignalDatas = [];
        
        var itemLength = collectionView.items.length;
        
        //rows.dataItem이 아닌 CollectionView에 있는 items 정보를 읽어와 초기화 시작한다.
        for (var i = 0; i < itemLength; i++) {
            var item = collectionView.items[i];
            
            var newItem = {};
            
            for ( var columnId in item) {

                //원본 값이 있는지 확인하기 위해 원본 키 값 설정.
                var orgValKey = common.getOrgValueKey(columnId);
                
                if(
                    columnId == constant.ROW_STATUS_KEY || 
                    columnId == constant.CHECKED_KEY || 
                    columnId == constant.INDEX_KEY ||
                    columnId.indexOf(constant.PREFIX_ORG_VALUE) > -1  ||
                    columnId.indexOf(constant.PREFIX_PRE_VALUE) > -1
                ){
                    continue;
                }

                //원본 데이터가 존재 하면 원본 데이터를, 존재 하지 않으면 현재 값을 설정한다.
                if(item.hasOwnProperty(orgValKey)){
                    newItem[columnId] = item[orgValKey];
                }else{
                    newItem[columnId] = item[columnId];
                }
            }

            orignalDatas.push(newItem);

        }
            
        this.#reset();
        this.#setCollectionView(grid,orignalDatas);
    }

    /**
     * 그리드 내용을 새로고침(갱신) 한다.
     */
    refresh  = ()=> {
        var grid = this.getGrid();
        grid.refresh();
    }


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
    setDataOnComboBox = (p)=> {
        
        var controlVars = this.getControlVars();
        
        //파라메터 값을 초기화 한다.
        var param =	_.merge(true,{}, {
            id : null,
            row : -1,
            combo : []
        },p || {});
        
        var redefineCombos = [];
        var comboMap = {};
        
        var comboLength = param.combo.length;
        if(typeof(param.combo[0]) != "object"){
            for (let i = 0; i < comboLength; i++) {
                redefineCombos.push({id : param.combo[i]+"" , name: param.combo[i]});
            }
        }else{
            redefineCombos = param.combo;
        }

        for (let i = 0; i < comboLength; i++) {

            for (const key in param.combo[i]) {
                comboMap[param.combo[i]['id']] = param.combo[i]['name'];
            }
        }

        // alert(controlVars.comboBox[param.id]+','+param.id)
        console.log(controlVars.comboBox[param.id])

        if(controlVars.comboBox[param.id]){
            controlVars.comboBox[param.id].itemsSource = redefineCombos;
            controlVars.comboBox[param.id+'_'+param.row] = redefineCombos;
            controlVars.comboKey[param.id+'_'+param.row] = comboMap;
            console.log(controlVars.comboBox[param.id+'_'+param.row],'comboMap')
        }

        
    }
}

const createGrid = (p) => {
    return bf.grid.instance[p.id] = new HamonicaGrid(p); 
}


export {
    createGrid
}