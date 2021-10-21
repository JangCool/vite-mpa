/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import util from '@/utils/util.js'
import constant from "./interface/grid.interface.constant";
import column from "./interface/grid.interface.column";

const DATA_TYPE = constant.DATA_TYPE;
const CELL_TYPE = constant.CELL_TYPE;
const ROW_STATUS = constant.ROW_STATUS;


class Common {

    #controlVars;

    #config;

    #column;

    constructor(p) {

        // 그리드 설정 값.
        this.#controlVars = p.controlVars;
        this.#config = p.config;
        this.#column = p.column;
    }

    /***
     *  객체 값 비교.
     *  compare( 5, 5 ) = true
     *  compare( "abc", "abc" ) = true
     *  compare( null, null ) = true
     *  compare( false, false ) = true
     *  compare( [5,1], [5,1] ) = true
     *  compare( [{a:3,b:5},{a:3,b:6}], [{a:3,b:5},{a:3,b:6}] ) = true
     *  compare( [5,[1,2],4], [5,[1,2],4] ) = true
     *  compare( {a:[5,[1,2],4],b:3,c:"aaa",d:{a:3,b:5}}, {a:[5,[1,2],4],b:3,c:"aaa",d:{a:3,b:5}}) = true
     *  출처 : https://www.bsidesoft.com/?p=1402
     */
    compare = (a, b) => {
        var i = 0, j;
        if(typeof a == "object" && a){
            if(Array.isArray(a)){
                if(!Array.isArray(b) || a.length != b.length) return false;
                for(j = a.length ; i < j ; i++) if(!compare(a[i], b[i])) return false;
                return true;
            }else{
                for(j in b) if(b.hasOwnProperty(j)) i++;
                for(j in a) if(a.hasOwnProperty(j)){
                    if(!compare(a[j], b[j])) return false;
                    i--;
                }
                return !i;
            }
        }
        return a === b;
    }

    /**
     * cell Dom element를 가져온다.
     * 
     *  - wijmo 최신 버전은 getCellElement 함수를 지원하나 지금 사용하는 버전이 구형 버전이기에 따로 함수를 구현하였다.
     *  - 최신버전에서 호출 방법 : grid.cells.getCellElement(e.row, e.col);
     * 
     * @param {Object} grid 
     * @param {Number} row 
     * @param {Number} col 
     * @return DOM Element
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    getCellElement = (grid, row, col) => {
        var rc = grid.getCellBoundingRect(row, col);
        return document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
    }

    /***
     * 셀별 편집 여부 조작 할 키 설정.
     * 행번호_컬럼명 조합
     * 
     * @param index index 번호
     * @param id 컬럼명
     * @return String ex) _OV_KEY
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    getCellCustomKey = (index, id) => {
        var key = index;
        if(index > -1 && id != ""){
            key = index + "_" + id;
        }
        
        return key;
    }
                
    isEditable = (grid, index, col, columnId) => {
       
        var userColumns = this.#column.getColumnsMap();
        var userColumn = userColumns[columnId];
        var controlVars = this.#controlVars;
        
        var cellEditableKey = this.getCellCustomKey(index,columnId);
        var editableCells = controlVars.editableCells;

        let gColumn = grid.columns.getColumn(columnId);
        
        var rowEditable = true;
        var colEditable =  !gColumn.isReadOnly;
        var cellEditable = !editableCells[cellEditableKey] ? userColumn.editable : editableCells[cellEditableKey].editable; // editableCells 값이 없을 때는 userColumn.editable 속성 정보로 판단한다.

        grid.rows.forEach(function(item){

            if (index == item.index) {
                rowEditable = !item.isReadOnly;
                return false;
            }
        });
        
        //row, column, cell, 모두 true일 경우 편집 가능.
        return rowEditable && colEditable && cellEditable;

    }

    /***
     * item(data)에서 원본 값 읽을 때 필요한 속성 값(key or property)
     * @param key 원본 key
     * @return String ex) _OV_KEY
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    getOrgValueKey = (key) => {
        return constant.PREFIX_ORG_VALUE+key;
    }

    /***
     * item(data)에서 데이터 변경 이전 값 읽을 때 필요한 속성 값(key or property)
     * @param key 원본 key
     * @return String ex) _PV_KEY
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    getPreValueKey = (key) => {
        return constant.PREFIX_PRE_VALUE+key;
    }

    /***
     * 원본 값과 변경 되기 이전 값 필드를 정의한다.
     * @param id 아이디
     * @param row row 객체
     * @return {orgValue :{} , preValue: {}}
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    setOrgAndPreValue = (id, row) => {
        
        //메타 데이터 키는 진행하지 않는다.
        if(
            id == constant.ROW_STATUS_KEY || 
//				id == constant.CHECKED_KEY || 
            id == constant.INDEX_KEY || 
            id.indexOf(constant.PREFIX_ORG_VALUE) > -1  ||
            id.indexOf(constant.PREFIX_PRE_VALUE) > -1
        ){
            return;
        }
        

        var orgValKey = this.getOrgValueKey(id);
        var preValKey = this.getPreValueKey(id);
        var orgVal = null;
        var preVal = null;

        //원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다.
        if(!row.hasOwnProperty(orgValKey)){
            orgVal = row[orgValKey] = (row[id]===undefined) ? null : row[id];
        }else{
            orgVal = row[orgValKey];
        }

        if(!row.hasOwnProperty(preValKey)){
            preVal = row[preValKey] = (row[id]===undefined) ? null : row[id];
        }else{
            preVal = row[preValKey];
        }
        
        return {
            orgValue : orgVal,
            preValue : preVal
        };
    }

    /***
     * row word-wrap 처리
     * @param grid grid객체
     * @param row row 번호
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    setAutoRowResize = (grid, row) => {
        grid.rows[row].wordWrap = true;
        grid.autoSizeRow(row);
    }

    /***
     * 데이터가 변경 될 경우 기본 적으로 문자열로 값이 변경 된다.
     * 이때 같은 값이어도 변경 되기전 값이 Number형이고 변경된 값이 문자열로 인식 되어 다른 값으로 판단할 경우가 있는데
     * 이를 방지 하기 위해 columns에서 선언한 dataType에 따라 형 변환 하여 반환 한다.
     * 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    castingDataType = (dataType, value) => {
        
        if(dataType == DATA_TYPE.Number){
            value = Number(value);
        }else if(dataType == DATA_TYPE.Boolean){
            value = Boolean(value);
        }
        return value;
    }
        
    /***
     * row 객체의 메타데이터를 모두 제거 한다.
     * 
     * @param row 데이터
     * @param isMetadata 메타 데이터 제거 여부.
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    deleteRowMetaData = (item, isMetadata) => {
        
        if(isMetadata === false){
            
            for ( var key in item) {
                
                var orgValKey = this.getOrgValueKey(key);
                var preValKey = this.getPreValueKey(key);

                delete item[orgValKey];
                delete item[preValKey];
            }
            
            delete item[constant.ROW_STATUS_KEY];
            delete item[constant.CHECKED_KEY];
            delete item[constant.INDEX_KEY];				
            delete item[constant.GRID_INDEX_KEY];			
            delete item[constant.PREVIEW_IMAGE_KEY];

        }
        
    }
    
    /**
     * row 상태 값에 따라 row값을 가져온다.
     * metatdata 값이 false 이면 _로 시작하는 필드는 모두 제거한다.
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    setRowsStatusContition = (rows, item, status, isArrayOfStatus, isMetadata, excludeColumn) => {
        
        var mergeItem = Object.assign({}, item);
        
        //메타 데이터 제거 유무에 따라 ROW객체에 있는 _로 시작하는 필드는 모두 제거한다.
        this.deleteRowMetaData(mergeItem, isMetadata);

        
        //excludeColumn 컬럼 제거.
        for (const key in mergeItem) {

            if(excludeColumn.includes(key)){
                delete mergeItem[key];
            }
        }

        if(status === ROW_STATUS.A || isArrayOfStatus && (status.indexOf(ROW_STATUS.A) > -1)) {
            rows.push(mergeItem);
        }else{
            
            if(isArrayOfStatus){
                if(status.indexOf(item[constant.ROW_STATUS_KEY]) > -1){					
                    rows.push(mergeItem);
                }
            }else{
                if(item[constant.ROW_STATUS_KEY]== status) {
                    rows.push(mergeItem);								
                }
            }
        }
    }

    /***
     * 업로드 할 파일명 만 추출 한다.
     * 
     * @param val 업로드할 파일 경로
     * @return String 파일 명
     * @author 장진철(zerocooldog@zen9.co.kr)
     */
    getFileName = (val) => {
        var tmpStr = val;
        
        if(tmpStr == null || tmpStr == ""){
            return null;
        }
        
        var cnt = 0;
        // eslint-disable-next-line no-constant-condition
        while(true){
            cnt = tmpStr.indexOf("/");
            if(cnt == -1) break;
            tmpStr = tmpStr.substring(cnt+1);
        }
        // eslint-disable-next-line no-constant-condition
        while(true){
            cnt = tmpStr.indexOf("\\");
            if(cnt == -1) break;
            tmpStr = tmpStr.substring(cnt+1);
        }
        
        return tmpStr;
    }
    

    /***
     * 값 필수 여부
     * @param value 값
     * @param p 별도로 처리 할 값.
     * @return boolean
     * @author 장진철(zerocooldog@zen9.co.kr)
     */
    isRequired = ( value, p ) => {
        
        if(util.text.isBlank(value)){
            if(p.alert){
                alert("그리드 [ 행 : "+(p.row+1)+", 열 : "+p.header+" ("+p.id+") ]의 빈 값을 허용하지 않습니다." );						
            }
            return false;
        }
        
        return true;
    }

    /**
     * grid에서 트리구조로 표현하기 위해 tree node 형식으로 변경한다.
     * 
     * @param items 계층 정보가 담겨져 있는 데이터
     * @param parentKey tree만들때 기준이 될 부모 속성(key)
     * @param idKey tree만들때 기준이 될 id 속성(key)
     */
    convertTree  = (items, parentKey,idKey) => {
        var rootNodes = [];
        var traverse = function (nodes, item, index, parentValue) {
            if (nodes instanceof Array) {
                return nodes.some(function (node) {
                    if (node[idKey] === item[parentKey]) {
                        node.children = node.children || [];
                        return node.children.push(items.splice(index, 1)[0]);
                    }

                    return traverse(node.children, item, index, parentValue);
                });
            }
        };

        var parentValue = items[0][parentKey];
        
        while (items.length > 0) {
            items.some(function (item, index) {
                if (item[parentKey] === parentValue) {
                    return rootNodes.push(items.splice(index, 1)[0]);
                }

                return traverse(rootNodes, item, index, parentValue);
            });
        }

        return rootNodes;
    }

	/**
	 * 그리드 properties 속성 중 pageable이 true 일 경우 페이징 엘리먼트를 초기 설정한다.
	 * @param instance grid 객체
	 */
	initPaging = (instance) => {
		
		var properties = instance.getConfig().properties;
		var events = instance.getConfig().events;
		var controlVars = instance.getControlVars();

		var pagingElement = document.querySelector("#"+instance.getId());

        var loopCount = 0 ;

        while(loopCount < 5){
            pagingElement = pagingElement.parentNode;
            let searchElement = pagingElement.querySelector(".grid-paging");
            let isPagingElement =  (searchElement != null);
            if(isPagingElement){
                pagingElement = searchElement;
                break;
            }
        }


        if(!pagingElement){
            console.warn(".paging 클래스명을 가진 영역을 찾을 수 없습니다.");
            return;
        }

		
		var rowsPerPageElement = pagingElement.parentNode.querySelector(".grid-rows-per-page");
		if(!rowsPerPageElement){
			rowsPerPageElement = pagingElement.parentNode.parentNode.querySelector(".grid-rows-per-page");
			rowsPerPageElement.style.cssText = ";height:26px;border-radius:2px;display:inline-block;border:1px solid #333333"
		}

		controlVars.paging.rowsPerPageComboBox = new wijmo.input.ComboBox(rowsPerPageElement, {
			selectedIndexChanged : function(e){
				
				var queryData = controlVars.paging.queryData;
				var rowsPerPageComboBox = controlVars.paging.rowsPerPageComboBox;
				
				if(queryData != null){
					//페이지 설정
					if(queryData.params != null){
						queryData.params["rowsPerPage"] = e.selectedValue;
					}else{
						queryData.params = { rowsPerPage : e.selectedValue };
					}

					//rowsPerPage컴보박스 선택이 변경되면 이벤트 발생.
					events.paging.changeRowsPerPage(e.selectedValue);
					instance.doQuery(queryData);
				}
			},
	        itemsSource: properties.rowsPerPage
	    });

		
		// rowsPerPageElement.style.cssText=rowsPerPageElement.style.cssText+";width:"+properties.rowsPerPageWidth+"px";

        
        var pagingHtml = "";
        
        pagingHtml += '<div class="paging pager">';
        pagingHtml += '		<span>';
        pagingHtml += '		    <a href="javascript:void(0)" class="first grid-paging-first" aria-label="처음 페이지" disabled ></a>';
        pagingHtml += '		    <a href="javascript:void(0)" class="prev  grid-paging-previous" aria-label="이전 페이지" disabled></a>';
        pagingHtml += '		    <span class="num grid-current-page"><b>1</b> / 7</span>';
        pagingHtml += '		    <a href="javascript:void(0)" class="next grid-paging-next" aria-label="다음 페이지" disabled></a>';        
        pagingHtml += '		    <a href="javascript:void(0)" class="last grid-paging-last" aria-label="마지막 페이지" disabled></a>';
        pagingHtml += '		</span>';
		pagingHtml += '</div>';
		
		// pagingHtml += '<div class="wj-control wj-content wj-pager">';
		// pagingHtml += '	<div class="wj-input-group">';
		// pagingHtml += '		<span class="wj-input-group-btn">';
		// pagingHtml += '			<button class="wj-btn wj-btn-default grid-paging-first" type="button" disabled>';
		// pagingHtml += '				<span class="wj-glyph-left" style="margin-right: -4px;"></span>';
		// pagingHtml += '				<span class="wj-glyph-left"></span>';
		// pagingHtml += '			</button>';
		// pagingHtml += '		</span>';
		// pagingHtml += '		<span class="wj-input-group-btn">';
		// pagingHtml += '			<button class="wj-btn wj-btn-default grid-paging-previous" type="button" disabled>';
		// pagingHtml += '				<span class="wj-glyph-left"></span>';
		// pagingHtml += '			</button>';
		// pagingHtml += '		</span>';
		// pagingHtml += '		<button type="button" class="wj-form-control btn btn-default grid-current-page" disabled="" style="width:100px">1/1</button>';
		// pagingHtml += '		<span class="wj-input-group-btn">';
		// pagingHtml += '			<button class="wj-btn wj-btn-default grid-paging-next" type="button" disabled>';
		// pagingHtml += '				<span class="wj-glyph-right"></span>';
		// pagingHtml += '			</button>';
		// pagingHtml += '		</span>';
		// pagingHtml += '		<span class="wj-input-group-btn">';
		// pagingHtml += '			<button class="wj-btn wj-btn-default grid-paging-last" type="button" disabled>';
		// pagingHtml += '				<span class="wj-glyph-right" style="margin-right: -4px;"></span>';
		// pagingHtml += '				<span class="wj-glyph-right"></span>';
		// pagingHtml += '			</button>';
		// pagingHtml += '		</span>';
		// pagingHtml += '	</div>';
		// pagingHtml += '</div>';
		
		pagingElement.innerHTML = pagingHtml;
		
		// var pager = pagingElement.querySelector(".paging.pager");
		// pager.style.cssText = pager.style.cssText+";position:absolute;transform:translateX(-50%);left:50%";

		
		var firstButtons = pagingElement.querySelector(".grid-paging-first");
		var previousButtons = pagingElement.querySelector(".grid-paging-previous");

		var nextButtons = pagingElement.querySelector(".grid-paging-next");
		var lastButtons = pagingElement.querySelector(".grid-paging-last");

		firstButtons.addEventListener('click', function (e) {

			var className =  this.className;
            var page = this.getAttribute("page");
            var disabled = this.getAttribute("disabled");

            if(disabled == 'disabled'){
                return;
            }

			var queryData = controlVars.paging.queryData;
			var rowsPerPageComboBox = controlVars.paging.rowsPerPageComboBox;

			//페이지 설정
			if(queryData.params != null){
				queryData.params["pageNum"] = parseInt(page);
				queryData.params["rowsPerPage"] = rowsPerPageComboBox.selectedValue;
			}else{
				queryData.params = { pageNum : parseInt(page) };
			}

			events.paging.changeRowsPerPage({
				isFirst : true,
				isPrevious : false,
				isNext : false,
				isLast : false,
				param  : queryData.params
            });
            
			instance.doQuery(queryData);
			
        }); //end dropTarget.addEventListener('dragover', function (e) {
		
		previousButtons.addEventListener('click', function (e) {

			var className =  this.className;
			var page = this.getAttribute("page");
            var disabled = this.getAttribute("disabled");

            if(disabled == 'disabled'){
                return;
            }

			var queryData = controlVars.paging.queryData;
			var rowsPerPageComboBox = controlVars.paging.rowsPerPageComboBox;

			//페이지 설정
			if(queryData.params != null){
				queryData.params["pageNum"] = parseInt(page);
				queryData.params["rowsPerPage"] = rowsPerPageComboBox.selectedValue;
			}else{
				queryData.params = { pageNum : parseInt(page) };
			}

			events.paging.changeRowsPerPage({
				isFirst : false,
				isPrevious : true,
				isNext : false,
				isLast : false,
				param  : queryData.params
			});
			
			instance.doQuery(queryData);
			
        }); //end dropTarget.addEventListener('dragover', function (e) {
		
		nextButtons.addEventListener('click', function (e) {

			var className =  this.className;
			var page = this.getAttribute("page");
            var disabled = this.getAttribute("disabled");

            if(disabled == 'disabled'){
                return;
            }

			var queryData = controlVars.paging.queryData;
			var rowsPerPageComboBox = controlVars.paging.rowsPerPageComboBox;

			//페이지 설정
			if(queryData.params != null){
				queryData.params["pageNum"] = parseInt(page);
				queryData.params["rowsPerPage"] = rowsPerPageComboBox.selectedValue;
			}else{
				queryData.params = { pageNum : parseInt(page) };
			}

			events.paging.changeRowsPerPage({
				isFirst : false,
				isPrevious : false,
				isNext : true,
				isLast : false,
				param  : queryData.params
			});
			
			instance.doQuery(queryData);
			
        }); //end dropTarget.addEventListener('dragover', function (e) {
		
		lastButtons.addEventListener('click', function (e) {

			var className =  this.className;
			var page = this.getAttribute("page");
            var disabled = this.getAttribute("disabled");

            if(disabled == 'disabled'){
                return;
            }
			
			var queryData = controlVars.paging.queryData;
			var rowsPerPageComboBox = controlVars.paging.rowsPerPageComboBox;

			//페이지 설정
			if(queryData.params != null){
				queryData.params["pageNum"] = parseInt(page);
				queryData.params["rowsPerPage"] = rowsPerPageComboBox.selectedValue;
			}else{
				queryData.params = { pageNum : parseInt(page) };
			}

			events.paging.changeRowsPerPage({
				isFirst : false,
				isPrevious : false,
				isNext : false,
				isLast : true,
				param  : queryData.params
			});
			
			instance.doQuery(queryData);
			
        }); //end dropTarget.addEventListener('dragover', function (e) {
		
		
    }
    
	/**
	 * 서버에서 내려받은 페이징 정보들을 설정 한다.
	 * @param gridId 그리드 아이디
	 * @param gridData 서버에서 넘겨받은 그리드 데이터 및 페이징 정보
	 */
	setPaging = (gridId, gridData) => {
		
		//페이징 처리.
		var gridWrapElement = document.querySelector("#"+gridId).parentNode.parentNode;

		var currentPage = gridWrapElement.querySelector(".grid-current-page");
		var next = gridWrapElement.querySelector(".grid-paging-next");
		var last = gridWrapElement.querySelector(".grid-paging-last");
		var previous = gridWrapElement.querySelector(".grid-paging-previous");
		var first = gridWrapElement.querySelector(".grid-paging-first");

		if(gridData.hasNext === true){
			next.removeAttribute("disabled");
			next.setAttribute("page",gridData.pageNum+1);
			last.removeAttribute("disabled");
			last.setAttribute("page",gridData.totalPages);
		}else{
			next.setAttribute("disabled","disabled");
			next.removeAttribute("page");
			last.setAttribute("disabled","disabled");
			last.removeAttribute("page");
		}
		
		if(gridData.hasPrevious === true){
			previous.removeAttribute("disabled");
			previous.setAttribute("page",gridData.pageNum-1);
			first.removeAttribute("disabled");
			first.setAttribute("page",1);

		}else{
			previous.setAttribute("disabled","disabled");
			previous.removeAttribute("page");
			first.setAttribute("disabled","disabled");
			first.removeAttribute("page");
		}
		
		currentPage.innerHTML = (gridData.pageNum) + ' / ' + gridData.totalPages;
		
	}
    
    createEditor = (instance, editColumn, wjInput, p, callback) => {
        var grid = editColumn.grid;
    
        grid.formatItem.addHandler(function (s, e) {
            var editRange = grid.editRange,
                column = e.panel.columns[e.col];
            // check whether this is an editing cell of the wanted column
            if (!(e.panel.cellType === wijmo.grid.CellType.Cell && column === editColumn && editRange && editRange.row === e.row && editRange.col === e.col)) {
                return;
            }
    
            // hide standard editor (don't remove!)
            if (e.cell.firstChild) {
                if(e.cell.firstChild.style) {
                    e.cell.firstChild.style.display = 'none';
                }else{
                    e.cell.innerHTML="";
                }
            }
    
            // add custom editor
            var editorRoot = document.createElement('div');
            editorRoot.id="wjEditor";
            var input = new wjInput(editorRoot, p);
            
            if(callback && typeof(callback) == "function"){
                callback(input, instance.getCell({ id : column.binding, row: e.row}));
            }
    
            e.cell.appendChild(editorRoot);
    
            if(input instanceof wijmo.input.InputNumber){
                try {
                    input.value = grid.getCellData(e.row, e.col, false);
                }catch(e) {
                    input.value = 0;
                }
            }
    
    
            // cellEditEnding that updates cell with user's input
            var editEndingEH = function (s, args) {
                grid.cellEditEnding.removeHandler(editEndingEH);
                if (!args.cancel) {
                    args.cancel = true;
                    //rawValue
                    if(input instanceof wijmo.input.InputMask){
                        grid.setCellData(args.row, args.col, input.rawValue);
                    }else{
                        grid.setCellData(args.row, args.col, input.value);
                    }
                }
            };
    
            // subscribe the handler to the cellEditEnding event
            grid.cellEditEnding.addHandler(editEndingEH);
        });
    }
}


export default Common;
