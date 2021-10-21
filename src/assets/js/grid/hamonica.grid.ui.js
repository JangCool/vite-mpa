/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import constant from "./interface/grid.interface.constant";

const DATA_TYPE = constant.DATA_TYPE;
const CELL_TYPE = constant.CELL_TYPE;


class UI {

    #config;

    constructor(config) {
        // 그리드 설정 값.
        this.#config = config;
    }

    #getFirstChild = () => {
		return document.querySelector("#"+ this.#config.id +" div:first-child");
    }

    hideResultStatus = () => {
        
        var flexgridNoResult = document.querySelector("#"+ this.#config.id+"_flexgrid_no_result");
        if(flexgridNoResult){
			flexgridNoResult.remove();
        }
    }

    showNoResultStatus = () => {
		//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
		var noResult = this.#getFirstChild();
		
		if(noResult == null){
			return;
        }
        
        var flexgridNoResult = document.querySelector("#"+ this.#config.id+"_flexgrid_no_result");

        if(flexgridNoResult){
            return;  
        };

		
		var html = "";
		html += "<div id='"+this.#config.id+"_flexgrid_no_result'";
		html += "     style=\"background:url('"+this.#config.imageHome +"/grid/no_result.png') no-repeat ;margin:0;padding:0;top:50% ;left:50% ;width:99px;height:16px;translateX(-50%) translateY(-50%);position:absolute\">";
		html += "</div>";

        noResult.insertAdjacentHTML('afterend', html);
    }
    
    hideLoading = function(){
		//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
		var loadingSpinner = this.#getFirstChild();
		
		if(loadingSpinner == null){
			return;
		}
		
		var flexgridLoadingSpinner = loadingSpinner.querySelector("#flexgrid_loading_spinner");
		
		if(flexgridLoadingSpinner){
			flexgridLoadingSpinner.parentNode.removeChild(flexgridLoadingSpinner);
		}
		
    }
    
    showLoading = function(){
		//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
		var loadingSpinner = this.#getFirstChild();
		
		if(loadingSpinner == null){
			return;
		}
		
		var html = "";
		html += "<div id='flexgrid_loading_spinner'>";
		html += "	<div id='flexgrid_loading_spinner_icon'";
		html += "     style=\"background:url('"+this.#config.imageHome +"/grid/ajax-loader.gif') no-repeat ;width:32px;height:32px\">";
		html += "	</div>";
		html += "</div>";

        loadingSpinner.querySelector("div[wj-part=root]").insertAdjacentHTML('afterend', html);

        wijmo.setCss(document.querySelector("#flexgrid_loading_spinner"), {
    		position: "absolute",
    		width : "100%",
    		height : "100%",
    		backgroundColor : "rgba(102, 102, 102, 0.1411764705882353)",
            top: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            /* text-align: center; */
            left: "50%",
            margin:0,
            padding:0,
            zIndex:9999
        });
        
        wijmo.setCss(document.querySelector("#flexgrid_loading_spinner_icon"), {
    		position: "absolute",
            top: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            /* text-align: center; */
            left: "50%",
            margin:0,
            padding:0,
        });
    }
}


export default UI;
