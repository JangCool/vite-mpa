
export function useUI() {
    return {

        /**
         * 부트스트랩 또는 사용자정의 이벤트 실행 시 이벤트 전파를 막기위해 사용한다.
         * 
         * @param {*} selector  선택자 문자열  #selector, .selector ...
         * 
         * @since 2021-08-30 10:25
         * @author 장진철(zerocooldog@pionnet.co.kr)
         */
        stopPropagationAtClick: function(selector) {

            let navbarTopDropdownMenus = document.querySelectorAll(selector);

            navbarTopDropdownMenus.forEach(element => {
               element.addEventListener("click", function(event){
                    event.stopPropagation();
                });
            });
        },
        setClickNavbarTopHamburger: function(){


            let getWrapper = () => {

                let wrapper = document.querySelector(".wrapper");
                
                if(!wrapper){
                    console.log("not found the .wrapper style class.")
                }

                return wrapper;
            }

            let hamburger = document.querySelector("#sideMenuBarToggle");
            
            if(!hamburger){
                return;
            }

            document.querySelector(".side-nav").addEventListener("mouseover", function(event){
                event.stopPropagation();
                let wrapper = getWrapper();
                
                if(hamburger.classList.contains("active")){
                    return;
                }
                
                if(wrapper){
                    if(wrapper.classList.contains("side-nav-toggled")){
                        wrapper.classList.remove("side-nav-toggled");
                    }
                }

            });

            document.querySelector(".side-nav").addEventListener("mouseout", function(event){

                event.stopPropagation();
                let wrapper = getWrapper();
                
                if(hamburger.classList.contains("active")){
                    return;
                }

                if(wrapper){
                    if(!wrapper.classList.contains("side-nav-toggled")){
                        wrapper.classList.add("side-nav-toggled");
                    }
                }
            });

            hamburger.addEventListener("click", function(event){

                event.stopPropagation();
                let wrapper = getWrapper();
                
                if(wrapper){

                    let wclassList = wrapper.classList;
                    let hclassList = hamburger.classList;

                    wclassList.toggle("side-nav-toggled");


                    if(!wclassList.contains("side-nav-toggled")){
                        hclassList.add("active");
                    }else{
                        hclassList.remove("active");
                    }
                }

            });

        },
        /**
         * 상단 메뉴 네비게이션 사용자 dropdown 메뉴 활성화 기능 설정.
         * 
         * @param {*} selector  선택자 문자열  #selector, .selector ...
         * 
         * @since 2021-08-30 10:25
         * @author 장진철(zerocooldog@pionnet.co.kr)
         */
        toggleActiveAtNavDropdownUser: function(){


            let navbarTopDropdownUser = document.querySelector("#navbarDropdownUser");

            navbarTopDropdownUser.addEventListener("click", function(){
                let parentNode = navbarTopDropdownUser.parentNode;

                parentNode.querySelectorAll(".nav-link").forEach(element => {

                    let classList = element.classList;
                    let dataset = element.dataset;

                    if(!classList.contains("collapsed") && dataset.bsToggle == "collapse"){
                        classList.remove("active")
                        classList.add("collapsed")
                    }
                });

                parentNode.querySelectorAll(".user-sub-menu").forEach(element => element.classList.remove("show"));
            });

            let navbarTopDropdownMenus = document.querySelectorAll("#navbarDropdownUser~.dropdown-menu");

            navbarTopDropdownMenus.forEach(element => {

               element.addEventListener("click", function(event){

                    event.stopPropagation();

                    let navLink = event.target.closest(".nav-link");

                    if(navLink){
                        //navLink active 클래스를 모두 제거한다.
                        navLink.parentNode
                            .querySelectorAll(".nav-link")
                                .forEach(element => element.classList.remove("active"));

                        //collapsed 접음 클래스가 있을 경우 data-bs-toggle 속성에 collapse 가 있을 경우 active 클래스 등록.
                        if(!navLink.classList.contains("collapsed")){
                            if(navLink.dataset.bsToggle == "collapse"){
                                navLink.classList.add("active");
                            }else{
                                navLink.parentNode.querySelectorAll(".user-sub-menu").forEach(element => element.classList.remove("show"));
                            }
                        // collapsed 접음 클래스가 없을 경우
                        }else{
                            navLink.classList.remove("active");
                        }
                    }

                    let listGroupItem = event.target.closest(".list-group-item");

                    if(listGroupItem){

                        //nav-link 서브 메뉴 클래스를 찾는다.
                        let userSubMenu = listGroupItem.closest(".user-sub-menu");

                        //active되어있는 기존 클래스를 제거 한다.
                        userSubMenu
                            .querySelectorAll(".list-group-item")
                                .forEach(element => element.classList.remove("active"));

                        let parentElement = userSubMenu.previousElementSibling;

                        //클릭한 list-group-item에 active 클래스를 등록한다.
                        if(!listGroupItem.classList.contains("active")){

                            listGroupItem.classList.add("active");

                            //상위 nav-link도 active하게 클래스를 추가한다.
                            if(!parentElement.classList.contains("active")){
                                parentElement.classList.add("active");
                            }

                        }else{
                            listGroupItem.classList.remove("active");
                            parentElement.classList.remove("active");
                        }
                    }
                });
            });
        },

        setHmAgent: function(){

            let agentbtn = document.querySelector("#hmAgentBtn");
            let agentBody = document.querySelector('.hm-agent');

            agentbtn.addEventListener("click", function(event){
                event.stopPropagation();

                if(!agentBody.classList.contains("ag-fx")){

                    agentBody.classList.add("ag-fx");

                }else{
                    agentBody.classList.remove("ag-fx");
                }

            });
            
            // agentbtn.addEventListener("click", function(){
            //     alert('눌렀어요');
            // });

        }


    
    }
}