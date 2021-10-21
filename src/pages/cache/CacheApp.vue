<template>
    <application-layout>
        <template v-slot:nav>
            <application-nav></application-nav>
        </template>

        <template v-slot:side>
            <application-side-menu>
                <div class="side-nav-menu-heading">실시간</div>
                <a class="nav-link collapsed" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseDashboards" aria-expanded="false" aria-controls="collapseDashboards">
                    <div class="nav-link-icon">
                        <i class="hi his-dashboards"></i>
                    </div>
                    <span class="menu-text">Dashboards</span>
                    <div class="side-nav-collapse-arrow" />
                </a>
                <div class="collapse" id="collapseDashboards">
                    <nav class="side-nav-menu-nested nav">
                        <router-link :to="'/cache/dashboard/split-hero-grid'" class="nav-link">
                            <span class="menu-text">Split Hero Grid</span>
                        </router-link>
                        <router-link :to="''" class="nav-link">
                            <span class="menu-text">Default2</span>
                        </router-link>
                        <router-link :to="''" class="nav-link">
                            <span class="menu-text">Default3</span>
                        </router-link>
                    </nav>
                </div>
                <div class="side-nav-menu-heading">분석</div>
                <a class="nav-link collapsed" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#transaction" aria-expanded="false" aria-controls="transaction">
                    <div class="nav-link-icon">
                        <i class="hi his-analysis-transaction"></i>
                    </div>
                    <span class="menu-text">트랜잭션 분석</span>
                    <div class="side-nav-collapse-arrow" />
                </a>
                <div class="collapse" id="transaction">
                    <nav class="side-nav-menu-nested">
                        <router-link :to="''" class="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#sub-transaction-2" aria-expanded="false" aria-controls="sub-transaction-2">
                            <span class="menu-text">서브메뉴</span>
                            <div class="side-nav-collapse-arrow" />
                        </router-link>
                        <div class="collapse" id="sub-transaction-2">
                            <nav class="side-nav-menu-nested">
                                <router-link :to="''" class="nav-link">
                                    <span class="menu-text">서브 서브 메뉴</span>
                                </router-link>
                                <router-link :to="''" class="nav-link">
                                    <span class="menu-text">서브 서브 메뉴1</span>
                                </router-link>
                                <router-link :to="''" class="nav-link">
                                    <span class="menu-text">서브 서브 메뉴2</span>
                                </router-link>
                            </nav>
                        </div>
                        <router-link :to="''" class="nav-link">
                            <span class="menu-text">서브 메뉴2</span>
                        </router-link>
                        <router-link :to="''" class="nav-link">
                            <span class="menu-text">서브 메뉴2</span>
                        </router-link>
                    </nav>
                </div>
                <router-link :to="''" class="nav-link">
                   <div class="nav-link-icon">
                        <i class="hi his-analysis-app"></i>
                    </div>
                    <span class="menu-text">어플리케이션 분석</span>
                </router-link>
                <router-link :to="''" class="nav-link">
                    <div class="nav-link-icon">
                        <i class="hi his-analysis-error"></i>
                    </div>
                    <span class="menu-text">에러 분석</span>
                </router-link>
                <router-link :to="''" class="nav-link">
                    <div class="nav-link-icon">
                        <i class="hi his-thread-dump"></i>
                    </div>
                    <span class="menu-text">쓰레드 덤프  분석</span>
                </router-link>

                <div class="side-nav-menu-heading">제어</div>
                <a class="nav-link collapsed" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#control" aria-expanded="false" aria-controls="control">
                    <div class="nav-link-icon">
                        <i class="hi his-analysis-transaction"></i>
                    </div>
                    <span class="menu-text">캐시 관리</span>
                    <div class="side-nav-collapse-arrow" />
                </a>
                <div class="collapse" id="control">
                    <nav class="side-nav-menu-nested">
                        <router-link :to="'/cache/control/activate'" class="nav-link">
                            <span class="menu-text">활성/비활성</span>
                        </router-link>
                        <router-link :to="''" class="nav-link">
                            <span class="menu-text">Query(SQL)</span>
                        </router-link>
                        <router-link :to="''" class="nav-link">
                            <span class="menu-text">Service</span>
                        </router-link>
                        <router-link :to="''" class="nav-link">
                            <span class="menu-text">Eviction</span>
                        </router-link>
                    </nav>
                </div>


            </application-side-menu>
        </template>

        <template v-slot:content>
            <application-content>
                <router-view :key="$route.fullPath"/>
            </application-content>
        </template>
    </application-layout>

</template>

<script>

import ApplicationLayout from '@/layout/ApplicationLayout.vue';
import ApplicationNav from '@/layout/default/ApplicationNav.vue';
import ApplicationSideMenu from '@/layout/default/ApplicationSideMenu.vue';
import ApplicationContent from '@/layout/default/ApplicationContent.vue';

export default {
    components: { 
        ApplicationLayout,
        ApplicationNav,
        ApplicationSideMenu,
        ApplicationContent
    },

}
</script>

<style>

</style>