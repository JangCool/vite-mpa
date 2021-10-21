/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import constant from "./interface/grid.interface.constant";
import util from '../../../utils/util.js'

const DATA_TYPE = constant.DATA_TYPE;
const CELL_TYPE = constant.CELL_TYPE;


class GridEvent {

    #controlVars;

    #config;

    #common;

    #column;

    #instance;

    #grid;


    constructor(p) {

        this.#instance = p.instance;
        this.#controlVars = p.controlVars;
        this.#config = p.config;
        this.#common = p.common;
        this.#column = p.column;
        this.#grid = p.grid;
        
        this.#initEvents(p.grid);
    }

    #initEvents = (grid) => {

        var instance = this.#instance;
        var controlVars = this.#controlVars;
        var events = this.#config.events;
        var common = this.#common;
        var column = this.#column;
        var properties = this.#config.properties;

        var contextMenuItems = [];
		//contextMenu
		grid.addEventListener(grid.hostElement, 'contextmenu', function(e) {
			e.stopPropagation();
			var ht = grid.hitTest(e);

			var gcolumn = grid.columns[ht.col],
		 	columnId = gcolumn.binding,
            userColumns = column.getColumnsMap(),
		 	userColumn = userColumns[columnId];
			
		  	if (ht.panel == grid.cells) {
			
				var row = instance.getRow({row : ht.row});
				var rc = grid.getCellBoundingRect(ht.row, ht.col);
				var cellElement = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
	                
				var opv = common.setOrgAndPreValue(columnId, row); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}
	
				var cell = {
					id : columnId,
					row : ht.row,
					value: row[columnId] || null,
					rowData : row,
					preValue : opv.preValue,
					orgValue : opv.orgValue,
					left: rc.left,
					top: rc.top,
					right: (rc.left + rc.width),
					bottom: (rc.top + rc.height),
					html : cellElement.innerHTML,
					text : cellElement.innerText,
					dataType : userColumn.dataType
				};
			    	
              events.cell.rightClick(cell);
		      e.preventDefault();
		      
		    }else if(ht.cellType == wijmo.grid.CellType.ColumnHeader){
                

                var contextId = instance.getId()+"_header_menu";

                var html = "<div id='"+contextId+"' style=\"left:"+ e.pageX+ "px;top : "+ e.pageY+ "px;\" />";

                var contextLayer = document.querySelector("#"+contextId);
                if (contextLayer != null) {
                    contextLayer.remove();
                }

                document.querySelector("body").insertAdjacentHTML('beforeend', html);

                var importExcelId = instance.getId()+"-import-excel";

			        // create the menu
			        var menu = new wijmo.input.Menu(document.getElementById(contextId), {
			            displayMemberPath: 'header',
			            selectedValuePath: 'cmd',
			            dropDownCssClass: 'columnheader-ctx-menu',
			            itemsSource: [
			                { header: '열 고정', cmd: 'frozen' },
			                { header: '행 숨기기', cmd: 'column-hide'},
			                { header: '행 숨기기 취소', cmd: 'cancel-column-hide', items : contextMenuItems},
			                { header: '<label for="'+importExcelId+'" style="cursor:pointer">Excel 가져오기<input type="file" id="'+importExcelId+'" class="import-excel-input-file" /></label>', cmd: 'import' },
			                { header: 'Excel 내보내기', cmd: 'export' },
			                { header: '<span class="wj-separator"></span>' },
			                { header: '초기화', cmd: 'restore' }
			            ],
			            itemClicked: function(s,e) {

			                var frozenColumnIndex = ht.col+1;
			            	var columnVisible = grid.columns[ht.col].visible;
	
			                if(menu.selectedValue == "frozen" && grid.columns.frozen == frozenColumnIndex){
			                	grid.frozenColumns = 0;
			                }else if(menu.selectedValue == "frozen" && grid.columns.frozen != frozenColumnIndex){
			                	grid.frozenColumns = frozenColumnIndex;
			                }else if(menu.selectedValue == "column-hide"){
		                		instance.hideColumn({id:columnId});
		                		s.itemsSource[s.selectedIndex+1].items.push({header : column.header ,id : columnId});
			                }else if(menu.selectedValue == "cancel-column-hide"){
                                
		                		var items = menu.selectedItem.items;
		                		
		                		for (var i = 0; i < items.length; i++) {
		                			if(items[i].id){
                                        instance.showColumn({ id: items[i].id});
                                        items.splice(i,1);
		                			}
								}
		                		
			                }else if(menu.selectedValue == "import"){
                                var element = document.querySelector("#"+importExcelId);

                                element.click();
			                	element.addEventListener('change', function(e) {
			                		instance.importExcel({files : this.files[0]});
                                });
                                
			                }else if(menu.selectedValue == "export"){
		                		instance.exportExcel();
			                }else if(menu.selectedValue == "restore"){
		                		instance.restore();
			                }
			            },
			            itemFormatter : function(index, cmd){
	
			            	var frozenColumnIndex = ht.col+1;
			            	var columnVisible = grid.columns[ht.col].visible;
	
			            	if(cmd == "열 고정" && grid.columns.frozen === frozenColumnIndex){
			            		return "열 고정 취소";
			            	}
	
			            	return cmd;
			            }
			            
                    });
                    
                menu.showDropDownButton = false;
                menu.isDroppedDown  = true;
                
                console.log(menu)
	            menu.owner = wijmo.closest(e.target, '.wj-colheaders');
	            if (menu.owner) {
	                e.preventDefault();
                }
                
                e.preventDefault();
                e.stopPropagation();
		        
		    }
		});

		//클릭 이벤트 등록
		grid.addEventListener(grid.hostElement, 'click', function(e) {
			var ht = grid.hitTest(e);
			if (ht.panel == grid.cells) {

				var gColumn = grid.columns[ht.col],
				 	columnId = gColumn.binding,
				 	userColumns = column.getColumnsMap(),
				 	userColumn = userColumns[columnId];
				
				var row = instance.getRow({row : ht.row});
				var rc = grid.getCellBoundingRect(ht.row, ht.col);
				var cellElement = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
                console.log(ht.panel)
                    
				var opv = common.setOrgAndPreValue(columnId, row); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}

				// var isDetail = wijmo.hasClass(ht.panel._activeCell.children[0], "wrap-master-detail");
                // console.log(ht.panel._activeCell,'ht.panel._activeCell')

				var cell = {
					id : columnId,
					row : ht.row,
					value: row[columnId] || null,
					rowData : row,
					preValue : opv.preValue,
					orgValue : opv.orgValue,
					left: rc.left,
					top: rc.top,
					right: (rc.left + rc.width),
					bottom: (rc.top + rc.height),
					html : cellElement.innerHTML,
					text : cellElement.innerText,
					dataType : userColumn.dataType
					// isDetail : isDetail
				};
				
				events.cell.click(cell);

			} 
		}, true); // get the event before the grid does
		
		//더블 클릭 이벤트 등록
		grid.addEventListener(grid.hostElement, 'dblclick', function(e) {
			
			var ht = grid.hitTest(e);
			if (ht.panel == grid.cells) {
				
				var gColumn = grid.columns[ht.col],
				 	columnId = gColumn.binding,
				 	userColumns = column.getColumnsMap(),
				 	userColumn = userColumns[columnId];
				
				var row = instance.getRow({row : ht.row});
				var rc = grid.getCellBoundingRect(ht.row, ht.col);
				var cellElement = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
                    
				var opv = common.setOrgAndPreValue(columnId, row); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}

                // console.log(ht.panel._activeCell,'ht.panel._activeCell')
				// var isDetail = wijmo.hasClass(ht.panel._activeCell.children[0], "wrap-master-detail");

				var cell = {
					id : columnId,
					row : ht.row,
					value: row[columnId] || null,
					rowData : row,
					preValue : opv.preValue,
					orgValue : opv.orgValue,
					left: rc.left,
					top: rc.top,
					right: (rc.left + rc.width),
					bottom: (rc.top + rc.height),
					html : cellElement.innerHTML,
					text : cellElement.innerText,
					dataType : userColumn.dataType,
					// isDetail : isDetail
				};
				
				events.cell.dblClick(cell);
				e.preventDefault();
			} 
		}, true); // get the event before the grid does

        /**
         * CollectionView에 데이터가 설정 되거나, collectionView.refresh()를 하게 되면 해당 이벤트를 호출 한다.
         */
		grid.loadedRows.addHandler(function(sender, e) {

            var rowLength = sender.rows.length;
            var userColumns = column.getColumnsMap();

			for (var i = 0; i < rowLength; i++) {
				
				// 내용에 따라 row 크기 자동 변환 여부가 true 일 경우 처리. ps. 나중에 확인해보고 필요없으면 제거.
				if(properties.autoRowResize){
					common.setAutoRowResize(grid,i);
				}
				
				var item = sender.rows[i].dataItem;
				
				//데이터를 모두 로드 시 CHECKED_KEY속성이 존재 하지 않으면 전부 false로 설정 한다.
				if(!item.hasOwnProperty(constant.CHECKED_KEY)){
					item[constant.CHECKED_KEY] = false;
				}
				
				if(!item[constant.ROW_STATUS_KEY]){
					item[constant.ROW_STATUS_KEY] = constant.ROW_STATUS.N;
				}

				if(!item[constant.INDEX_KEY]){
					item[constant.INDEX_KEY] = i;
                }

                //tree 모드 그리드일 경우 편집이 가능하게 한다.
				if(properties.tree != null){
					sender.rows[i].isReadOnly = false;
				}
				
				//grid에서 설정한 컬럼 아이디가 서버에서 전송받은 데이터에 존재 하지 않는다면 null값으로 원본 값 설정.
				//값이 존재하면 존재 한 값을  원본 값으로 설정.
				for ( var columnId in userColumns) {
				//원본 데이터 값 설정.
					common.setOrgAndPreValue(columnId, item)
				}
				
				events.row.rowAdded(instance.getRow({
					row : i
				}), i);
			}
			
			//총계 합을 cell 하단에  출력 한다.
			if(controlVars.isAggregate && properties.grandTotal == constant.GRANDTOTAL_POSITION.NONE){

                var flex = sender,
					items = flex.collectionView.items,
					index = flex.rows.length,
					group = new wijmo.grid.GroupRow();
				group.cssClassAll = "grand-total"
				sender.rows.push(group);
				
				for ( let columnId in userColumns) {
					let aggregate = userColumns[columnId].aggregate;
					if(aggregate != null){
						sender.setCellData(index, columnId, wijmo.getAggregate(aggregate, items, columnId));
					}
				}
			}

        });

        /**
         * 무한 스크롤.
         */
        grid.scrollPositionChanged.addHandler(function(sender, e) {

            if (sender.viewRange.bottomRow >= sender.rows.length - 1) {
                let view = sender.collectionView;
                let index = 0;

                if(!view) {
                    return;
                }

                index = view.currentPosition; // keep position in case the view is sorted
                
                events.infiniteScroll(index);
            }
        });
        
        var beforeValue = null;
		
		// 셀 내용 편집 전 내용 등록.
		grid.beginningEdit.addHandler(function(sender, e) {
			
			var id = sender.cells.columns[e.col].binding,
				item = sender.rows[e.row].dataItem,
                currVal = sender.getCellData(e.row, e.col);
                
            var userColumns = instance.getColumn().getColumnsMap();
			var userColumn = userColumns[id];
            
            var isEditable = common.isEditable(sender, e.row, e.col, id);

            // cell 편집이 가능한 상태가 아니면 편집모드 진행을 취소한다.
            if(!isEditable){
				e.cancel = true;
				return;
            }


					
			//cellEditEnded 셀 편집 함수 종료 이후 값이 변하였는지 판단하기 위하여 편집 시작 전 값을 읽어와 설정한다.
			controlVars.beforeEditValue = currVal;

			//DateTime 형식일 때 값이 없을 경우에는 pc 현재 시간, 있을 경우에는 원래 있던 값을 선택 하도록 한다.
			if(userColumn.dataType == DATA_TYPE.Date && CELL_TYPE.DATE_TIME == userColumn.cellType && controlVars.dateTime[id]){
				if(util.text.isBlank(currVal)){
					controlVars.dateTime[id].value = new Date();
				}else{
					controlVars.dateTime[id].value = new Date(currVal);

				}
			}else if(userColumn.dataType == DATA_TYPE.Date && controlVars.date[id]){
				if(util.text.isBlank(currVal)){
					controlVars.date[id].value = new Date();
				}else{
					controlVars.date[id].value = new Date(currVal);

				}
			 }			
			
			
			//해당 컬럼이 버튼인지 검증.
			var isButton = CELL_TYPE.BUTTON === userColumn.cellType || CELL_TYPE.BUTTON_HTML === userColumn.cellType;

			//만약 로우 상태 컬럼이라면 진행하지 않는다.
			if(
					CELL_TYPE.FILE === userColumn.cellType || 
					CELL_TYPE.IMAGE === userColumn.cellType || 
					CELL_TYPE.IMAGE_BUTTON === userColumn.cellType || 
					isButton === true 
			){
				e.cancel = true;
				return;
			}
		

			var opv = common.setOrgAndPreValue(id, item); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}

			var cellElement = common.getCellElement(grid, e.row, e.col);
			
			var beginData = {
					id : id,
					row : e.row,
					value : currVal,
					preValue : opv.preValue,
					orgValue : opv.orgValue,
					html : cellElement.innerHTML,
					text : cellElement.innerText,
					dataType : userColumn.dataType
				};
			

            events.cell.beginEdit(beginData);

		});

        grid.cellEditEnding.addHandler(function(sender, e) {

        });
        
		// 셀 내용 편집시 내용 등록.
		grid.cellEditEnded.addHandler(function(sender, e) {

            var userColumns = instance.getColumn().getColumnsMap();
			var column = sender.cells.columns[e.col];
			var isEditRange = sender.editRange; //편집 모드 여부.

			var id = column.binding,
				userColumn = userColumns[id],
				dataType = userColumn.dataType,
				item = sender.rows[e.row].dataItem,
				currVal = controlVars.beforeEditValue;
				
			var orgValKey = common.getOrgValueKey(id);
			var preValKey = common.getPreValueKey(id);
			var orgValue = item[orgValKey];
            var newVal = null;
			
			
			// CustomGridEditor 사용시 activeEditor객체가 보이지 않는다.
			// 해당 객체가 있을 경우에 처리한다.
			if(!util.text.isEmpty(sender.activeEditor)){
				newVal = common.castingDataType(dataType, sender.activeEditor.value);
			}else{
				
				//컴보박스 일 경우. 선택된 id 값을 저장 한다.
				if(CELL_TYPE.COMBO_BOX === userColumn.cellType && controlVars.comboBox[id]){
                    newVal = controlVars.comboBox[id].selectedItem.id;
                    if(dataType === wijmo.DataType.Number){
                        newVal = parseInt(newVal);
                    }
				}else{
                    newVal = grid.getCellData(e.row, e.col, false);
				}
				
				//자동완성 검색일 때 선택된 항목이 없을 경우 원본 값으로 초기화 한다.
				if(CELL_TYPE.AUTO_COMPLETE === userColumn.cellType && controlVars.autoComplete[id]){
					if(controlVars.autoComplete[id].selectedIndex < 0 ){
						newVal = orgValue;
						grid.setCellData(e.row, e.col, orgValue);
					}
				}
				
				//Date형일 경우 getTime()으로 값을 처리한다.
				if(wijmo.isDate(newVal)){
					newVal = newVal.getTime();
				}
			}
			//Date형일 경우 getTime()으로 값을 처리한다.
			if(wijmo.isDate(currVal)){
				currVal = currVal.getTime();
			}
			
				
			var isChange = false;
			var isUpdate = (item[constant.ROW_STATUS_KEY] !== constant.ROW_STATUS.C && item[constant.ROW_STATUS_KEY] !== constant.ROW_STATUS.D);
			
			//마스크일 경우 특스문자 제거한다.
			if(CELL_TYPE.MASK === userColumn.cellType){
				if(currVal != null){
					currVal = currVal.replace( /[^(a-zA-Z0-9)]/ig,"").replace(/[\(\)\@\\\_]/g,"")
				}
				if(newVal != null){
					newVal = newVal.replace( /[^(a-zA-Z0-9)]/ig,"").replace(/[\(\)\@\\\_]/g,"")
				}
			}
			
			
			//현재 값과 신규 값이 다르면 변경 된 것으로 판단.
			if(currVal !== newVal){
				isChange = true;
			}
			
			//CHECK_BOX일 경우 해당 컬럼에 데이터 Y,N 값이 없을 때 checked 하지 않았더라도 데이터가 변경 되었다고 출력 된다
			//이를 방지 하고자 데이터가 없을 경우에는 N 값으로 설정한다
			if(CELL_TYPE.CHECK_BOX === userColumn.cellType && orgValue == null && newVal === userColumn.checkBox.N){
				newVal = null;
			}
			//원본 값과 신규 값이 같으면 변경되지 않은 것으로 판단.
			if(orgValue === newVal){

				isChange = false;
			}
			
			for ( var key in item) {
				
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

				var itemValue = (id === key) ? newVal : item[key];
				
				if(item.hasOwnProperty(validOrgValKey) && item[validOrgValKey] !== itemValue){
					isChange = true;
					break;
				}
			}

			//1. 신규나, 삭제 상태 값을 가지고 있는 데이터는 처리하지 않는다.
			//2. 값이 변경 되었다면 업데이트 상태를 가리키는 U와 체크박스는 true, 아니라면 변화가 없다는 N과 체크박스는 false를 설정하고 changedCell이벤트를 호출한다.
			if(isUpdate){

				if(isChange){
					
					//새로운 값을 등록한다.
					item[id] = newVal;
					item[preValKey] = currVal;
					item[constant.CHECKED_KEY] = true;
					item[constant.ROW_STATUS_KEY] = constant.ROW_STATUS.U;

					//원본값이 아닌 새로운 값으로 변경 되었다면 changedCellByNewValue 이벤트 발생.
					events.cell.changedCellByNewValue({
						id : sender.cells.columns[e.col].binding,
						row : e.row,
						value : newVal,
						preValue : currVal,
						orgValue : orgValue,
						dataType : userColumn.dataType
					});

				}else{
					item[constant.ROW_STATUS_KEY] = constant.ROW_STATUS.N;
					item[constant.CHECKED_KEY] = false;
					item[preValKey] = currVal;
				}
				
			}
			
			//원본 값 일치여부 상관없이 무조건 changedCell 이벤트 발생.
			events.cell.changedCell({
				id : sender.cells.columns[e.col].binding,
				row : e.row,
				value : newVal,
				preValue : currVal,
				orgValue : orgValue,
				dataType : userColumn.dataType
			});
			
			//COMBO_BOX형일 경우 수정한 데이터가 편집이 끝나기 전까지 코드 값이 반영이 안되는 경우가 있다. (ID 값이 아닌 NAME 값 저장됨)
			//_BOX형일 경우 무조건 값을 변경 해준다.			
			if(CELL_TYPE.COMBO_BOX === userColumn.cellType && controlVars.comboBox[id]){
				item[id] = newVal;
			}
			
			var cellElement = common.getCellElement(grid, e.row, e.col);
			
			var endData = {
					id : id,
					row : e.row,
					value : newVal,
					preValue : currVal,
					orgValue : orgValue,
					html : cellElement.innerHTML,
					text : cellElement.innerText,
					dataType : userColumn.dataType
				};
			
            events.cell.endEdit(endData);
			
			//편집 이전 값과 변경 값 비교가 끝났으면 해당 속성을 초기화 한다.
			controlVars.beforeEditValue = null;

			//상태값이 변하지 않는 경우가 있는데 값이 변경 되었으면 refresh를 해준다.
			instance.getGrid().refresh();
		});
		
		
		var selectRow = -1;
		

		grid.selectionChanging.addHandler(function(sender, e) {		
			//e.row가 0 이하 값일 경우 0번째로 기본 설정.
			var row = (e.row ==-1) ? 0 : e.row;
			
			controlVars.selectRow = row;
			controlVars.selectColumn = sender.cells.columns[e.col].binding;
		});
		
		/***
		 * row 선택 변경 시 발생 하는 이벤트.
		 * 
		 * row 선택을 변경 하면 현재 선택된 row번호를 controlVars.selectRow 값에 설정.
		 */
		grid.selectionChanged.addHandler(function(sender, e) {
			
			
			// cell 클릭이벤트가 우선 적용되도록 timeout 설정
			setTimeout(function() {
				//e.row가 0 이하 값일 경우 0번째로 기본 설정.
				var row = controlVars.selectRow;
				
				
				// row가 변경 되면 셋팅.
				// selectRow 와 e.row 값이 -1값이 아닐 경우 비교 조건 가능 상태가 된다. 
				// selectRow -1은 row 변경이 이루어지지 않은 상 이고 e.row가 -1인 경우는 비정상적인 상태임.
				var isValidRow = (controlVars.selectRow > -1 && e.row > -1) ; 
				
				// isValidRow가 true인 비교 가능한 상태가 되면 현재 row와 이전 row번호가 다른지 비교 한다.
				// e.row 와 controlVars.selectRow값이 다르다면 row 선택이 변경된 것임으로 rowChanged이벤트 발생.
				if ( isValidRow && controlVars.prevSelectRow != controlVars.selectRow) {
					
					var prevRow = instance.getRow({
						row : ( controlVars.selectRow == -1 ) ? row : controlVars.prevSelectRow
					});
					var currentRow = instance.getRow({
						row : row
					});
					
					events.row.selectedRowChanged(prevRow, currentRow);
					
				}
				
				//이전 선택 로우 값 저장
				controlVars.prevSelectRow = e.row;
			}, 200);
		});
    }


}


export default GridEvent;
