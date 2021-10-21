<template>
        <div id="side-nav-wrapper" class="side-nav-wrapper shadow-right-sm">
            <nav class="side-nav">
                <div class="side-nav-header">
                    <div class="side-nav-menu-title-wrap">
                        <i class="hi his-app-cache"></i>
                        <span class="side-nav-menu-title pt-1">CACHE</span>
                    </div>
                </div>
                <div class="side-nav-menu">
                    <div class="nav">
                        <a class="nav-link active" href="javascript:void(0);">
                            <div class="nav-link-icon">
                                <i class="hi his-home"></i>
                            </div>
                            <span class="menu-text">홈</span>
                        </a>

                        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <div class="nav-link-icon">
                                <i class="hi his-bell"></i>
                            </div>
                            <span class="menu-text">알림</span>
                        </a>
                        <div class="dropdown-menu">
                            <a href="#" class="dropdown-item">Action</a>
                            <a href="#" class="dropdown-item">Another action</a>
                            <a href="#" class="dropdown-item">Separated link</a>
                        </div>

                        <div class="dropdown-menu" style=""> <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <a class="dropdown-item" href="#">Something else here</a>
                            <a class="dropdown-item" href="#">Separated link</a>
                        </div>

                        <a class="nav-link" href="javascript:void(0);">
                            <div class="nav-link-icon">
                                <i class="hi his-bookmark"></i>
                            </div>
                            <span class="menu-text">북마크</span>
                        </a>
                        <a class="nav-link" href="javascript:void(0);">
                            <div class="nav-link-icon">
                                <i class="hi his-add-dashboard"></i>
                            </div>
                            <span class="menu-text">대시보드 추가</span>
                        </a>
                        <slot></slot>
                        <div class="side-nav-menu-heading">단독 페이지</div>
                        <a href="/application-choice"  class="nav-link">
                            <div class="nav-link-icon">
                                <i class="hi his-card"></i>
                            </div>
                            <span class="menu-text">모니터링 선택</span>
                        </a>
                        <a href="/login"  class="nav-link">
                            <div class="nav-link-icon">
                                <i class="hi his-card"></i>
                            </div>
                            <span class="menu-text">로그인</span>
                        </a>
                        <a href="/join"  class="nav-link">
                            <div class="nav-link-icon">
                                <i class="hi his-card"></i>
                            </div>
                            <span class="menu-text">회원가입</span>
                        </a>
                        <div class="side-nav-menu-heading">UI TOOLKIT</div>
                        <a class="nav-link collapsed" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseComponents">
                            <div class="nav-link-icon">
                                <i class="hi his-card"></i>
                            </div>
                            <span class="menu-text">Components</span>
                            <div class="side-nav-collapse-arrow" />
                        </a>
                        <div class="collapse" id="collapseComponents">
                            <nav class="side-nav-menu-nested nav">
                                <router-link :to="'/components/accordions'" class="nav-link">
                                    <span class="menu-text">Accordions</span>
                                </router-link>
                                <router-link :to="'/components/avatars'" class="nav-link">
                                    <span class="menu-text">Avatars</span>
                                </router-link>
                                <router-link :to="'/components/bedges'" class="nav-link">
                                    <span class="menu-text">Bedges</span>
                                </router-link>
                                <router-link :to="'/components/buttons'" class="nav-link">
                                    <span class="menu-text">Buttons</span>
                                </router-link>
                                <router-link :to="'/components/cards'" class="nav-link">
                                    <span class="menu-text">Cards</span>
                                </router-link>
                                <router-link :to="'/components/dropdowns'" class="nav-link">
                                    <span class="menu-text">Dropdowns</span>
                                </router-link>
                                <router-link :to="'/components/embed-video'" class="nav-link">
                                    <span class="menu-text">Embed Video</span>
                                </router-link>
                                <router-link :to="'/components/forms'" class="nav-link">
                                    <span class="menu-text">Forms</span>
                                </router-link>
                                <!-- <router-link :to="'/components/form-advenced'" class="nav-link">
                                    <span class="menu-text">Form Advenced</span>
                                </router-link> -->
                                <router-link :to="'/components/form-validation'" class="nav-link">
                                    <span class="menu-text">Form Validation</span>
                                </router-link>
                                <router-link :to="'/components/list-group'" class="nav-link">
                                    <span class="menu-text">List Group</span>
                                </router-link>
                                <router-link :to="'/components/modals'" class="nav-link">
                                    <span class="menu-text">Modals</span>
                                </router-link>
                                <router-link :to="'/components/offcanvas'" class="nav-link">
                                    <span class="menu-text">Offcanvas</span>
                                </router-link>
                                <router-link :to="'/components/pagination'" class="nav-link">
                                    <span class="menu-text">Pagination</span>
                                </router-link>
                                <router-link :to="'/components/placeholder'" class="nav-link">
                                    <span class="menu-text">PlaceHolder</span>
                                </router-link>
                                <router-link :to="'/components/spinner'" class="nav-link">
                                    <span class="menu-text">Spinner</span>
                                </router-link>
                                <router-link :to="'/components/popovers'" class="nav-link">
                                    <span class="menu-text">Popovers</span>
                                </router-link>
                                <router-link :to="'/components/progress'" class="nav-link">
                                    <span class="menu-text">Progress</span>
                                </router-link>
                                <router-link :to="'/components/tabs'" class="nav-link">
                                    <span class="menu-text">Tabs</span>
                                </router-link>
                                <router-link :to="'/components/tooltips'" class="nav-link">
                                    <span class="menu-text">Tooltips</span>
                                </router-link>
                                <router-link :to="'/components/typography'" class="nav-link">
                                    <span class="menu-text">Typography</span>
                                </router-link>
                                <router-link :to="'/components/widgets'" class="nav-link">
                                    <span class="menu-text">Widgets</span>
                                </router-link>
                            </nav>
                        </div>
                        <a class="nav-link collapsed" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseModules">
                            <div class="nav-link-icon">
                                <i class="hi his-maximize"></i>
                            </div>
                            <span class="menu-text">Modules</span>
                            <div class="side-nav-collapse-arrow" />
                        </a>
                        <div class="collapse" id="collapseModules">
                            <nav class="side-nav-menu-nested nav">
                                <router-link :to="'/modules/date-range-picker'" class="nav-link">
                                    <span class="menu-text">Date Range Picker</span>
                                </router-link>
                            </nav>
                        </div>


                        <div class="side-nav-menu-heading">DEMO</div>

                        <router-link :to="'/demo/dashboard'" class="nav-link">
                            <div class="nav-link-icon">
                                <i class="hi his-theme"></i>
                            </div>
                            <span class="menu-text">Demo Dashboard</span>
                        </router-link>
                        <router-link :to="'/demo/social-feed'" class="nav-link">
                            <div class="nav-link-icon">
                                <i class="hi his-card"></i>
                            </div>
                            <span class="menu-text">Social Feed</span>
                        </router-link>
                    </div>
                </div>
            </nav>
        </div>
</template>

<script>
export default {

}
</script>

<style>
    .side-nav-toggled .side-nav .dropdown-menu.show{transform:translate(64px, 164px)! important;}
    .side-nav .dropdown-menu.show{transform:translate(248px, 164px)! important;}
</style>