import _ from "lodash";

const consoleValidation = {
    
    isArray: (data) => {
        if(!Array.isArray(data)){
            console.warn('Only Array type is supported. ')
        }
    }
}

/**
 * reflow연산이 이루어지지 않게 documentFragment 객체로 엘리먼트를 붙인다.
 * 
 * @param {Element} target 
 * @param {Element} source 
 * @return DocumentFragment
 */
const appendDocumentFragment = (target, source) => {

    let docFrag = document.createDocumentFragment();

    docFrag.appendChild(target);
    source.appendChild(docFrag);

    return docFrag;
}

const isSameCharacter = (conditionValue, value) => {
    return conditionValue.substr(0, value.length) == value;
}

class AutoComplete {


    #config;

    #data;

    #currentFocus;

    constructor(p){

        this.#config = _.merge({
            id: null,
            class: null,
            width: '100%',
            height: '100%',
            itemsHeight: 200,
            valueKey: 'id',
            displayKey: 'name',
            caseSensitive: false,
            startsWith: false,
            showMessageNoResults: true,
            message : {
                noResult : '검색 항목이 없습니다.'
            },
            data: null,
            events: {
                selectedItem : function(e, data){
                    console.log('auto complete item selectedItem ', e, data );
                },
                activeItem: function(e, data){
                    console.log('auto complete item selectedItem ', e, data);
                },
                showItems: function(e, data){
                    console.log('auto complete item openItems ', e, data);
                }
            }
        }, p);

        consoleValidation.isArray(this.#config.data);

        this.#data = this.#config.data;

        //auto complete 레이아웃 설정.
        this.#initLayout();
        this.#initEvent();
    }

    #getWrapperId() {
        return (this.#config.id || '') + '-autocomplete-wrapper';
    }

    #getDummyInputId() {
        return (this.#config.id || '') + '-autocomplete-dummy-input';
    }

    #getAutoCompleteListId() {
        return (this.#config.id || '') + '-autocomplete-list';
    }

    #getId(){
        return this.#config.id;
    }

    #getWrapper() {
        return document.querySelector("#" + this.#getWrapperId());
    }

    #getElement() {
        return document.querySelector("#" + this.#config.id);
    }

    #getDummyElement() {
        return document.querySelector("#" + this.#getDummyInputId());
    }

    setData(data){

        if(Array.isArray(data)){
            this.#data = data;
        } else{
            consoleValidation.isArray(data);
        }
    }

    getData(){
        return this.#data;
    }

    #createAutoCompleteWrapper () {
       
        let html = `
            <div id="${this.#getWrapperId()}" class="hamonica-autocomplete" style="width:${this.#config.width};height:${this.#config.height};">
                <input type="text" id="${this.#getDummyInputId()}" >
            </div>
        `;

        return html;
    }

    #initLayout() {
        
        let element = this.#getElement();

        if(!element){
            return;
        }

        element.setAttribute("type","hidden");

        //input 태그 위치에 wrapper클래스를 추가한다.( 형재노드 )
        element.insertAdjacentHTML('beforebegin', this.#createAutoCompleteWrapper());

        let wrapper = this.#getWrapper();

        if(!wrapper){
            return;
        }

        let dummy = this.#getDummyElement();
        //브라우저 기본 autoComplete 기능 끔.
        dummy.setAttribute("autocomplete","off");
        dummy.setAttribute("class", element.getAttribute("class") || '');
        dummy.setAttribute("style", element.getAttribute("style") || '');
 

        //input 엘리먼트를 wrapper엘리먼트에 이동 시킨다.
        appendDocumentFragment(element, wrapper)
    }

    #drawAutoComplete(parentNode, element, value) {

        let self = this;
        let dummy = this.#getDummyElement();

        //이미 열려 있는 자동완성 목록 닫기.
        this.#removeAutoCompleteItem();

        //입력값이 존재하지 않으면 더이상 진행하지 않는다.
        if (!value) { return false;}

        this.#currentFocus = -1;  

        let autoCompleteList = document.createElement("DIV");
        autoCompleteList.setAttribute("id", this.#getAutoCompleteListId());
        autoCompleteList.setAttribute("class", "hamonica-autocomplete-items");
        autoCompleteList.setAttribute("style", `max-height:${this.#config.itemsHeight}px;`);

        //input 옆에 아이템 항목을 출력하기 위한 div 엘리먼트를 등록.
        appendDocumentFragment(autoCompleteList, parentNode);

        let data = self.#data;
        let dataLength = self.#data.length;

        this.#config.events.showItems({
            items : data,
        });
        

        let isEmpty = true;

         /*for each item in the array...*/
        for (let i = 0; i < dataLength; i++) {
            /* 입력값하고 목록에 있는 데이터 문자가 일치하면 강조 처리 해준다. */

            let isObject = typeof data[i] === 'object' && data[i] !== null

            let displayValue = (isObject) ? data[i][this.#config.displayKey] : data[i];
            let inputValue = (isObject) ? data[i][this.#config.valueKey] : data[i];


            let isExist = false;

            if(this.#config.startsWith === true){
                isExist = this.#config.caseSensitive === false ? isSameCharacter(displayValue.toLowerCase() , value.toLowerCase()) : isSameCharacter(displayValue, value);
            }else{
                isExist  = this.#config.caseSensitive === false ? displayValue.toLowerCase().indexOf(value.toLowerCase() ) > -1 : displayValue.indexOf(value) > -1;
            }

            if (isExist) {

                isEmpty = false;

                let character = displayValue.substr(0, value.length);
                let div = document.createElement("DIV");

                let printValue = `<strong>${character}</strong>${displayValue.substr(value.length)}`;

                if(this.#config.startsWith === false){
                    printValue = displayValue.replaceAll(value,`<strong>${value}</strong>`);
                }

                /*
                    강조 처리.
                    현재 항목의 값을 보관할 입력 필드를 삽입
                */
                div.innerHTML = `
                    ${printValue}
                    <input type='hidden' value="${inputValue}" display="${displayValue}">
                `;

                //아이템 선택 시 값을 input에 등록하고
                //이미 열려 있는 자동완성 목록 닫기.
                div.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    element.value = this.getElementsByTagName("input")[0].value;
                    dummy.value = this.getElementsByTagName("input")[0].getAttribute("display");
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/  
                    self.#removeAutoCompleteItem();
                    self.#config.events.selectedItem(e, {
                        index: i,
                        item : data[i],
                        value : element.value
                    });
                });

                appendDocumentFragment(div, autoCompleteList);

            }
        }

        if(this.#config.showMessageNoResults === true && isEmpty){

            let div = document.createElement("DIV");

            /*
                강조 처리.
                현재 항목의 값을 보관할 입력 필드를 삽입
            */
            div.innerHTML = `
                <span>${this.#config.message.noResult}</span>
            `;

            appendDocumentFragment(div, autoCompleteList);
        }
    }

    #initEvent() {

        let element = this.#getElement();
        let dummy = this.#getDummyElement();

        if(!element){
            return;
        }

        const self = this;

        dummy.addEventListener('input', (e) => {
            
            e.preventDefault();

            let value = e.target.value;

            this.#drawAutoComplete(this.#getWrapper(), element, value);

        });


        function addActive(e, x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);

            //키보드로 위, 아래 동작시 방향 순환하도록 포지션 값 변경.
            if (self.#currentFocus >= x.length) self.#currentFocus = 0;
            if (self.#currentFocus < 0) self.#currentFocus = (x.length - 1);

            /*add class "autocomplete-active":*/
            x[self.#currentFocus].classList.add("hamonica-autocomplete-active");

            self.#config.events.activeItem(e, {
                index: self.#currentFocus,
                item : self.#config.data[self.#currentFocus]
            });
        }

          function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
              x[i].classList.remove("hamonica-autocomplete-active");
            }
        }
          
        dummy.addEventListener('keydown', (e) => {

            var x = document.getElementById(self.#getAutoCompleteListId());
            if (x) x = x.getElementsByTagName("div");

            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                self.#currentFocus++;
                /*and and make the current item more visible:*/
                addActive(e, x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                self.#currentFocus--;
                /*and and make the current item more visible:*/
                addActive(e, x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (self.#currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[self.#currentFocus].click();
                }
            }
        });
    }

    #removeAutoCompleteItem() {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = this.#getWrapper().getElementsByClassName("hamonica-autocomplete-items");

        if(x){
            for (var i = 0; i < x.length; i++) {
                x[i].remove();
            }
        }

    }

    showItems() {

        let element = this.#getElement();
        this.#drawAutoComplete(this.#getWrapper(), element, element.value);

    }

    hideItems(){
        this.#removeAutoCompleteItem();
    }
}

const createAutoComplete = (p) => {
    return new AutoComplete(p);
};

export {
    createAutoComplete
};