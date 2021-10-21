<template>

    <nav class="navbar navbar-expand navbar-top">
        <div class="container-fluid px-3">
            <!-- Drawer toggle button-->
            <button class="btn  btn-transparent-dark btn-sm pt-1" 
                id="sideMenuBarToggle" 
            >
                <i class="hi xs his-hamburger-menu"></i>
            </button>
            <a class="navbar-brand ps-3" href="#">HAMONICA</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a class="nav-item nav-link active" href="#"><i class="hi his-app-was"/></a>
                    <a class="nav-item nav-link" href="#"><i class="hi his-app-cache" /> </a>
                    <a class="nav-item nav-link" href="#"><i class="hi his-app-os" /> </a>
                    <a class="nav-item nav-link disabled" href="#"><i class="hi his-app-db"/> </a>
                </div>
            </div>
            <div class="navbar-nav-right-group">
                <ul class="navbar-nav align-items-center">
                    <!-- Navbar Search Dropdown-->

                    <li class="nav-item no-caret">
                        <a class="btn btn-transparent-dark" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="hi his-dashboard-itf sm"></i>
                        </a>
                    </li>

                    <li class="nav-item no-caret">
                        <a class="btn btn-transparent-dark" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="hi his-bells sm"></i>
                            <em class="noti"></em>
                        </a>
                    </li>

                    <li class="nav-item no-caret">
                        <a class="btn btn-transparent-dark" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="hi his-refresh sm"></i>
                        </a>
                    </li>

                    <!-- Alerts Dropdown-->
                    <li class="nav-item no-caret dropdown">
                        <a class="btn btn-transparent-dark dropdown-toggle" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="hi hir-dot-circles"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up" aria-labelledby="navbarDropdownAlerts">
                        </div>
                    </li>
                    <li class="nav-item no-caret dropdown">
                        <a class="btn pe-1 dropdown-toggle" id="navbarDropdownUser" href="javascript:void(0);" role="button" data-bs-toggle="dropdown">
                            <img src="/static/images/user/avatar.jpg" alt="image" class="img-fluid avatar-sm-v2 rounded-circle">
                        </a>
                        <div class="dropdown-menu dropdown-menu-end border-0 shadow dropdown-menu-animated" id="accordionUserSubMenu" aria-labelledby="navbarDropdownUser">
                            <a class="nav-link collapsed" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#userSubMenu">
                                <div class="nav-link-icon">
                                    <i class="hi his-theme"></i>
                                    <i class="hi hic-theme"></i>
                                </div>
                                <span class="menu-text">테마</span>
                                <div class="side-nav-collapse-arrow" />
                            </a>
                            <div class="collapse user-sub-menu" id="userSubMenu" data-bs-parent="#accordionUserSubMenu">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item active"><a href="javascript:void(0)">White</a></li>
                                    <li class="list-group-item"><a href="javascript:void(0)">Dark</a></li>
                                </ul>
                            </div>
                            <a class="nav-link collapsed" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#userAccordion">
                                <div class="nav-link-icon">
                                    <i class="hi his-language"></i><i class="hi hic-language"></i>
                                </div>
                                <span class="menu-text">언어</span>
                                <div class="side-nav-collapse-arrow" />
                            </a>
                            <div class="collapse user-sub-menu" id="userAccordion" data-bs-parent="#accordionUserSubMenu">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item active"><a href="javascript:void(0)">한국어(kr)</a></li>
                                    <li class="list-group-item"><a href="javascript:void(0)">영어(en)</a></li>
                                </ul>
                            </div>
                            <a class="nav-link" href="javascript:void(0);">
                                <div class="nav-link-icon">
                                    <i class="hi his-account"></i><i class="hi hic-account"></i>
                                </div>
                                <span class="menu-text">계정</span>
                            </a>
                            <a class="nav-link" href="javascript:void(0);">
                                <div class="nav-link-icon">
                                    <i class="hi his-setting"></i>
                                    <i class="hi hic-setting"></i>
                                </div>
                                <span class="menu-text">설정</span>
                            </a>
                            <a class="nav-link" href="javascript:void(0);">
                                <div class="nav-link-icon">
                                    <i class="hi his-logout"></i>
                                    <i class="hi hic-logout"></i>
                                </div>
                                <span class="menu-text">나가기</span>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

    </nav>
</template>

<script>
import { onMounted } from 'vue'

import { useUI } from '@/composables/use.ui.js'

export default {
    
    setup() {
        
        let {
            stopPropagationAtClick,
            setClickNavbarTopHamburger,
            toggleActiveAtNavDropdownUser,
        } = useUI();

        onMounted(() => {
            //dropdown-menu 내용 클릭시 레이어가 숨기지 않도록 한다.
            stopPropagationAtClick(".navbar-top .dropdown-menu");
            toggleActiveAtNavDropdownUser();
            setClickNavbarTopHamburger();
        })

        return {}

    }

}
</script>

<style>

.navbar-nav-right-group {
    margin-right: -5px;
}

.navbar-nav-right-group li > a{
    display: inline-flex;
    align-items: center;
    margin-right:8px;
}

.navbar-top .navbar-nav-right-group .nav-item .nav-link {
    width: auto;
    height: auto;
    padding: 0.16rem 0.7rem;
}
.navbar-top .navbar-nav-right-group .nav-item .nav-link.active {
    width: auto;
    height: auto;
    padding: 0.16rem 0.7rem;
    color: #0061FF;
    border-color: transparent;
    font-weight: 600;
}

.navbar-top .navbar-nav-right-group .nav-item .menu-text{
    padding-left:0.55rem;
}

.navbar-top .navbar-nav-right-group .nav-item .nav-link .nav-link-icon i[class^='hi his-']{
    display:block;
}

.navbar-top .navbar-nav-right-group .nav-item .nav-link .nav-link-icon i[class^='hi hic-']{
    display:none;
}

.navbar-top .navbar-nav-right-group .nav-item .nav-link:hover .nav-link-icon i[class^='hi hic-'],
.navbar-top .navbar-nav-right-group .nav-item .nav-link.active .nav-link-icon i[class^='hi hic-']{
    display:block;
}
.navbar-top .navbar-nav-right-group .nav-item .nav-link:hover .nav-link-icon i[class^='hi his-'],
.navbar-top .navbar-nav-right-group .nav-item .nav-link.active .nav-link-icon i[class^='hi his-']{
    display:none;
}

.navbar-top .navbar-nav-right-group .nav-item .nav-link.collapsed .side-nav-collapse-arrow {
  transform: rotate(45deg);
}

.navbar-top .navbar-nav-right-group .nav-item .nav-link .side-nav-collapse-arrow {
  right: 14px;
  transform: rotate(-135deg);

}


.navbar-top .navbar-nav-right-group .user-sub-menu{
    transition: height 0.3s;
    background-color: #F1F1F5;
    padding-top: 8px;
    padding-bottom: 8px;
}

.navbar-top .navbar-nav-right-group .list-group-item{
    background-color: inherit;
    border: none;
    padding: 0;
}

.navbar-top .navbar-nav-right-group .user-sub-menu > ul > li.active a {
    position: relative;
    color: #0061FF;
}

.navbar-top .navbar-nav-right-group .user-sub-menu > ul > li.active a:after {
    content: '';
    display: block;
    position: absolute;
    left: 22px;
    top: 50%;
    display: inline-block;
    padding: 4px 2px;
    margin-top: -6px;
    border: solid #0061FF;
    border-width: 0 2px 2px 0;
    transform: rotate(50deg);
}

.navbar-top .navbar-nav-right-group .user-sub-menu > ul > li a {
    text-decoration: none;
    width: auto;
    height: auto;
    padding: 9px 10px 9px 48px;
    font-size: 12px;
    line-height: 20px;
}



.navbar-top #drawerToggle {
    border-radius: 50%;
}
.navbar-top .navbar-nav-right-group a.btn {
    border-radius: 50%;
    padding: 0.4rem
}

.navbar-top .btn:focus {
  box-shadow: none;
}

.navbar-expand .navbar-nav .nav-link {
    width:2rem;
    height:2rem;
    border: 4px solid transparent;
    border-radius: 10px;
    padding: 0px;
    margin: 0;
}

.navbar-expand .navbar-nav .nav-link.active{
    border-color: #03a9f46b;
}
</style>