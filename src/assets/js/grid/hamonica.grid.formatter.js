/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import axios from '../common/hamonica.axios.js'
import constant from "./interface/grid.interface.constant";
import column from "./interface/grid.interface.column";
import util from '../../../utils/util.js'

const DATA_TYPE = constant.DATA_TYPE;
const CELL_TYPE = constant.CELL_TYPE;

class Formatter {

    #instance;

    #controlVars;

    #config;

    #common;

    #column;


    constructor(p) {

        this.#instance = p.instance;
        this.#controlVars = p.controlVars;
        this.#config = p.config;
        this.#common = p.common;
        this.#column = p.column;
    }

    /***
     * wijmo에서 제공하는 customeditor를 사용하기 위해 설정한다.
     *
     * @param grid 그리드 객체
     */
    setCustomEditor = function(instance, grid){

        var userColumns = this.#column.getColumnsMap();
        var events = this.#config.events;
        var controlVars = this.#controlVars;
        var common = this.#common;

        for ( let columnId in userColumns) {
            
            var userColumn = userColumns[columnId];
            var dataType = userColumn.dataType;
            var cellType = userColumn.cellType;

            
            if(CELL_TYPE.COMBO_BOX === userColumn.cellType){
                
                var redefineCombos = [];
                
                if(typeof(userColumn.combo[0]) != "object"){
                    var comboLength = userColumn.combo.length;
                    for (var i = 0; i < comboLength; i++) {
                        redefineCombos.push({id : userColumn.combo[i]+"" , name: userColumn.combo[i]})
                    }
                }else{
                    redefineCombos = userColumn.combo;
                }
                

                controlVars.comboKey[columnId] = {};
                
                for (let i = 0; i < redefineCombos.length; i++) {
                    let redefineCombo = redefineCombos[i];
                    let key = redefineCombo.id+"";
                    controlVars.comboKey[columnId][key] = redefineCombo.name;
                }
                // createCustomEditor = function(grid, binding, wjInput, p) {
                // 콤보박스 컨트롤 추가
                common.createEditor(instance, grid.columns.getColumn(columnId), wijmo.input.ComboBox, 
                    {
                        itemsSource: redefineCombos,
                        headerPath: 'name',
                        displayMemberPath: 'name',
                        isEditable: false
                    }, 
                    (input, cell) => {
                        controlVars.comboBox[columnId] = input;
                       			
                        var combo = (controlVars.comboBox[cell.id+'_'+cell.row]) ? (controlVars.comboBox[cell.id+'_'+cell.row]) : input.itemsSource;
                        var comboLength = combo.length;
                        //콤보 박스 컬럼에 아무런값이 없다면 콤보박스 선택을 초기화 시킨다. 숫자형일 경우 Number타입으로 넘어와 제대로된 비교가 안된다. 문자열을 연결하여 타입을 변형한다.
                        if(util.text.isBlank(cell.value+"")){
                            input.selectedIndex = 0;
                        }else{
                            //combobox일 경우 편집 시작 시 원래 있던 값을 선택 하도록 한다.
                            for (var i = 0; i < comboLength; i++) {

                                if(combo[i].id === cell.value){
                                    input.selectedIndex = i;
                                }
                            }
                        }
                    }
                );
                
                // controlVars.comboBox[columnId] = multiColumnEditor;
                
            }else if(CELL_TYPE.MULTI_SELECT === userColumn.cellType){

                // let redefineCombos = [];
                
                // if(typeof(userColumn.combo[0]) != "object"){
                //     let comboLength = userColumn.combo.length;
                //     for (let i = 0; i < comboLength; i++) {
                //         redefineCombos.push({id : userColumn.combo[i] , name: userColumn.combo[i]})
                //     }
                // }else{
                //     redefineCombos = userColumn.combo;
                // }
                

                // controlVars.multiSelectKey[columnId] = {};
                
                // for (let i = 0; i < redefineCombos.length; i++) {
                //     let redefineCombo = redefineCombos[i];
                //     let key = redefineCombo.id;
                //     controlVars.multiSelectKey[columnId][key] = redefineCombo.name;
                // }

                // // 콤보박스(다중 선택-멀티셀렉트) 컨트롤 추가
                // let multiColumnEditor = new CustomGridEditor(grid, columnId, wijmo.input.MultiSelect, {
                //     itemsSource: redefineCombos,
                //     headerPath: 'name',
                //     displayMemberPath: 'name',
                //     checkedMemberPath: '$checked',
                //     isEditable: false,
                //     showSelectAllCheckbox : true,
                //     formatItem : function(s,e){
                //         return "asdf";
                //     },
                //     checkedItemsChanged : function(sender) {

                //         var itemsSource = sender.itemsSource;
                //         var itemsSourceLength = itemsSource.length;
                        
                //         var allItems = [];
                //         var checkedItems = [];
                //         var unCheckedItems = [];
                        
                //         for (var i = 0; i < itemsSourceLength; i++) {
                            
                //             var itemSource = itemsSource[i];
                            
                //             allItems.push({id : itemSource.id , name : itemSource.name, checked : itemSource.$checked });
                            
                //             if(itemSource.$checked){
                //                 checkedItems.push({id : itemSource.id , name : itemSource.name });
                //             }else{
                //                 unCheckedItems.push({id : itemSource.id , name : itemSource.name });
                //             }
                            
                //         }
                        
                //         events.cell.checkedMultiItemsChanged({ 
                //             row : controlVars.selectRow,
                //             id : controlVars.selectColumn, 
                //             items : allItems, 
                //             checked : checkedItems,
                //             unChecked :  unCheckedItems
                //         });
                //     }
                // });
                
                // controlVars.multiSelect[columnId] = multiColumnEditor;
                
            }else if(dataType == wijmo.DataType.Date && cellType == CELL_TYPE.DATE_TIME){

                if(util.text.isEmpty(userColumn.format)){
                    console.error("Date 형식일 경우 format을 지정해 주셔야 합니다.");
                }
                // 날짜 컨트롤 추가
                common.createEditor(instance, grid.columns.getColumn(columnId), wijmo.input.InputDateTime, 
                    {
                        format: userColumn.format
                    }, 
                    (input, cell) => {
                        controlVars.dateTime[columnId] = input;
                    }
                );
                
            }else if(dataType == wijmo.DataType.Date){

                if(util.text.isEmpty(userColumn.format)){
                    console.error("Date 형식일 경우 format을 지정해 주셔야 합니다.");
                }
                // 날짜 컨트롤 추가
                common.createEditor(instance, grid.columns.getColumn(columnId), wijmo.input.InputDate, 
                    {
                        format: userColumn.format
                    }, 
                    (input) => {
                        // input.value = 
                        controlVars.date[columnId] = input;
                    }
                );

            }else if(dataType == wijmo.DataType.Number && userColumn.editable){

                // 숫자 컨트롤 추가
                var numberConfig = {
                    format: userColumn.format,
                    max : userColumn.number.max,
                    min : userColumn.number.min,
                    step : userColumn.number.step
                };
               
                // 날짜 컨트롤 추가
                common.createEditor(instance, grid.columns.getColumn(columnId), wijmo.input.InputNumber, numberConfig, 
                    (input) => {
          
                    }
                );
                
            }else if(CELL_TYPE.MASK === userColumn.cellType){

                // 날짜 컨트롤 추가
                common.createEditor(instance, grid.columns.getColumn(columnId), wijmo.input.InputMask, 
                    {
                        mask : userColumn.mask
                    }, 
                    (input, cell) => {
                        input.value = cell.value;
                    }
                );

            }else if(CELL_TYPE.AUTO_COMPLETE === userColumn.cellType){
            
                // 자동 완성 추가
                common.createEditor(instance, grid.columns.getColumn(columnId), wijmo.input.AutoComplete, 
                    {
                        minLength : userColumn.autoComplete.minLength,
                        placeholder: userColumn.autoComplete.placeholder,
                        displayMemberPath: userColumn.autoComplete.displayField,
                        itemsSourceFunction: function(query, max, callback){

                            //서버에 넘길 파라메터 설정.
                            var params = userColumn.autoComplete.params({ 
                                row : controlVars.selectRow,
                                id : controlVars.selectColumn
                            }, instance);
                            
                            if(!params){
                                params = {};
                            }
                            
                            params[controlVars.selectColumn] = query;
                            
                            // let ajax = (config.method == "get") ? axios.get(config.url, { params : params}) : axios.post(config.url, params);
                            let ajax = axios.get(userColumn.autoComplete.url, { params : params});

                            //서버에 그리드 및 파라메터 데이터를 전송한다.
                            ajax
                            .then(function (response){
                                if( response.data != null ){
                                    if(typeof(data) === "string" ){
                                        data = JSON.parse(response.data);
                                    }
                                    callback(response.data);
                                }
                            })
                            .catch(function(e) {
                                console.log(e);
                            });
                        },
                        selectedIndexChanged : function(sender){
                            
                            if(sender.selectedItem){
                                events.cell.changeItemByAutoComplete({ 
                                    row : controlVars.selectRow,
                                    id : controlVars.selectColumn, 
                                    item : sender.selectedItem, 
                                });
                            }
                        }
                    
                    }, 
                    (input, cell) => {
                        controlVars.autoComplete[columnId] = input;
                    }
                );
                
                

            }

            
        }
    }

    formatter = (value, format) => {
		var fs = format.split("");
		var r = "";
		var i = 0;
		_.each(fs, function(c, x) {
			if (fs[x] == "#") {
				if (typeof(value[i]) != "undefined") {
					r += value[i];
				}
				;
				i++;
			} else {
				r += fs[x];
			}
			;
		});
		if (i != value.length) {
			r += value.substring(i);
		}
		;
		return r;
	}

    /**
     * 어떠한 조건과 상관없이 모든 상황에 적용 되어야 할 항목 설정.
     * @param panel
     * @param row row 번호
     * @param col 컬럼 번호
     * @param cell dom 객체
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    formatterInit = (panel, row, col, cell) => {
        var id = panel.grid.cells.columns[col].binding;
    }


    /**
     * ROW STATE 값 변경.
     * @param panel
     * @param row row 번호
     * @param col 컬럼 번호
     * @param cell dom 객체
     * @param item row 데이터
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    rowStatus = (panel,row,col,cell,item) => {

        //row 데이터가 존재 하지 않으면 진행하지 않는다.
        if(!item){
            return;
        }

        let config = this.#config;

        var gridColumn = panel.grid.columns[col];

        var rowStatus = item[constant.ROW_STATUS_KEY];
    
        var statusName = "";
        if (rowStatus == constant.ROW_STATUS.N) {
            statusName += "read";
        } else if (rowStatus == constant.ROW_STATUS.C) {
            statusName += "create";
        } else if (rowStatus == constant.ROW_STATUS.U) {
            statusName += "update";
        } else if (rowStatus == constant.ROW_STATUS.D) {
            statusName += "delete";
        } else {
            statusName += "read";
        };
        
        cell.innerHTML = '<div class ="butterfly-controll-icon" style="background-image: url(\''+config.imageHome +'\/grid/icon_'+statusName+'.png\')"></div>';
            
    }

    /**
     * Controll Checkbox 값 변경.
     * @param panel
     * @param row row 번호
     * @param col 컬럼 번호
     * @param cell dom 객체
     * @param item row 데이터
     * @author 장진철(zerocooldog@zen9.co.kr)
     */
    rowCheckBox = (panel, row, col, cell, item) => {

        //row 데이터가 존재 하지 않으면 진행하지 않는다.
        if(!item){
            return;
        }

        let selfCommon = this.#common;
        let grid = panel.grid;
        let events = this.#config.events;
        var checked = item[constant.CHECKED_KEY];

        cell.innerHTML = '<div class="butterfly-controll-icon"><input type="checkbox" '+ ((checked === true) ? "checked" : "") +'/></div>';
        //클릭 할 때 상태를 item에 저장한다.
        cell.querySelector("input[type=checkbox]").onclick = function(e){

            var opv = selfCommon.setOrgAndPreValue(constant.CHECKED_KEY, item); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}
            var preValKey = selfCommon.getPreValueKey(constant.CHECKED_KEY);
            item[preValKey] = item[constant.CHECKED_KEY];
            item[constant.CHECKED_KEY] = this.checked;

            var rc = grid.getCellBoundingRect(row, 1);
            var cell = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
                

            var cellObject = {
                id : constant.CHECKED_KEY,
                row : row,	
                rowData : item,	
                value: item[constant.CHECKED_KEY],
                preValue : item[preValKey],
                orgValue : opv.orgValue,
                left: rc.left,
                top: rc.top,
                right: (rc.left + rc.width),
                bottom: (rc.top + rc.height),
            };

            events.cell.clickControlCheckBox(cellObject);	

            //grid 새로 고침.
            panel.grid.refresh();

        };
    }

    /***
     * 일반 cell 내용을 중간 위치로 설정 한다. merge 컬럼일 경우 더욱 뚜렷하게 보임.
     * 성능을 생각 하여 공통적인 요소는 wijmo.theme.normal.css 에 클래스로 정의.
     * 동적으로 변화가 필요한 경우 cssText를 이용하여 한번에 적용한다.
     * 
     * @param cell cell 엘리먼트
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    setCellStyle = (p) => {

        var panel = p.panel;
        var cell = p.cell;
        var userColumn = p.userColumn;
        var rowObject = p.rowObject;
        var styleObject = p.styleObject;
        var row = p.row;
        var col = p.col;
        var editRange = panel.grid.editRange;

        // cell 편집 상태가 아닐 경우 <div> 테그를 감싸서 vertical-align을 middle로 처리. 중간 정렬.
        if (!(editRange && editRange.col === col && editRange.row === row)) {
            if(userColumn.dataType !== wijmo.DataType.Boolean){
                cell.innerHTML = '<div class="butterfly-wj-cell-child">' + cell.innerHTML + '</div>';
            }
        }
        
        var controlVars = this.#controlVars;

        var styleCells = controlVars.styleCells;
        var styleCellKey = null;

        if(styleObject.item && styleObject.item.hasOwnProperty(constant.INDEX_KEY)){
            styleCellKey = this.#common.getCellCustomKey(styleObject.item[constant.INDEX_KEY], userColumn.id);
        }

        
        var isSetCellStyle = false; 
        var cellStyleText = cell.style.cssText;
        
        //background-color가 있는지 찾는 정규 표현식. ex) background-color :#f3f3f or background-color :reg(213,123,434)
        var regex = /background-color ?: ?#?(rgb?)?\(?(,?[0-9])*\)?[a-z0-9]*;?/ig;
        
        //cell 배경색 값이 존재하고 해당 컬럼아이디 값이 같으면 배경색을 적용한다.
        //단 셀이 병합되어 있을 경우 주변 cell 에 색상이 번지기 때문에 배경색을 설정하지 않았지만 backgroud-color 스타일이 적용되어 있을 경우
        //배경색을 없애준다.

        var isCssBackColor = (userColumn.backColor != null && userColumn.backColor.charAt(0) == ".");
        
        
        //배경색 설정 함수.
        var getBackColor = function(){
            if(styleCells[styleCellKey] && styleCells[styleCellKey].backColor && styleCells[styleCellKey].backColor !=""){
                return styleCells[styleCellKey].backColor;
            }else{
                return userColumn.backColor;
            }
        };
        
        
        if((getBackColor() != null) && userColumn.id == styleObject.id){
            //backgroud-color 스타일이 적용되어 있을 경우. 값을 추가하지 않고 기존에 있는 설정 값을 교체한다.
            //적용되어 있지 않다면 새로 추가.
            if(!isCssBackColor){
                isSetCellStyle = true;
                cellStyleText += "background-color :"+getBackColor();
            }

        //주위 cell 배경색 영향을 주지 않기 위해 backColor값이 없으면 배경색을 없애준다.
        }else if(!isCssBackColor && getBackColor() == null && cell.style.backgroundColor != ""){
            isSetCellStyle = true;
            cellStyleText = cellStyleText.replace(regex,"");
        }

        //cell 스타일 정의가 있을 경우에만 cssText를 적용.
        if(isSetCellStyle){
            cell.style.cssText = cellStyleText
        }

        //cell 안에 있는 html테그를 지정. 보통 div를 선택.
        var ch = cell.children[0];

        var isSetChildStyle = false;
        var styleText = ";"

        var rc = panel.getCellBoundingRect(row, col);                   
        var opv = this.#common.setOrgAndPreValue(userColumn.id, rowObject); // 원본 값과, 수정 이전 값 속성이 없다면 추가 시켜준다. return { orgValue : 원본 값, preValue : 수정 되기 전 값.}

        var cellData = {
            id : userColumn.id,
            row : row,
            value: rowObject[userColumn.id] || null,
            rowData : rowObject,
            preValue : opv.preValue,
            orgValue : opv.orgValue,
            left: rc.left,
            top: rc.top,
            right: (rc.left + rc.width),
            bottom: (rc.top + rc.height),
            dataType : userColumn.dataType
            // isDetail : isDetail
        };
        
 
        //사용자 정의 컬럼이 존재 하면 설정 값에 따라 스타일을 적용한다.
        if(styleObject.isCell && userColumn){


            if(userColumn.underline){
                if(this.#config.events.style.beforeUnderline(cellData, userColumn.underline)){
                    isSetChildStyle = true;
                    styleText +=";text-decoration:underline"
                }
            }
            if(userColumn.bold){
                isSetChildStyle = true;
                styleText +=";font-weight:bold"
            }
            if(userColumn.italic){
                isSetChildStyle = true;
                styleText +=";font-style:italic"

            }
            if(userColumn.color){
                isSetChildStyle = true;
                styleText +=";color:"+userColumn.color;
            }
            if(userColumn.fontSize){
                isSetChildStyle = true;
                styleText +=";font-size:"+userColumn.fontSize;
            }
            if(userColumn.foreColor){
                isSetChildStyle = true;
                styleText +=";background-color:"+userColumn.foreColor;
            }
        }
        
        //cell 하위에 자식 노드가 존재할 경우에만 진행한다.
        if(ch != null){
            if(isSetChildStyle){
                ch.style.cssText=styleText;
            }
        }
    }

    /***
     * 셀별 편집 여부 조작 할 키 설정.
     * 행번호_컬럼명 조합
     * 
     * @param index index 번호
     * @param id 컬럼명
     * @return String ex) _OV_KEY
     * @author 장진철(zerocooldog@zen9.co.kr)
     */
    getCellCustomKey (index, id){

        var key = index;
        if(index > -1 && id != ""){
            key = index + "_" + id;
        }
        
        return key;
    }
}


export default Formatter;
