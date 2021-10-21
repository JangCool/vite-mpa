<template>
    <default-layout>
        <div class="applications-choice">

                <div class="application-integrated shadow d-flex bd-highlight">
                    <div class="flex-grow-1">
                            <i class="hi lg his-app-int"></i>
                            <div>
                                <h3 class="h3-sm title">통합 대시보드</h3>
                                <span class="explain">실시간 모니터링을 통합으로 시스템 관리</span>
                            </div>

                    </div>
                    <div class="d-flex align-items-end">
                        <button type="button" class="btn btn-primary"><span>실행하기</span></button>

                    </div>
                </div>


                <div class="application-list">
                    <h5 class="h5-sm application-list-tile">어플리케이션 목록</h5>
                    <ul class="list-group shadow">
                        <li class="list-group-item d-flex justify-content-between gap-3" aria-current="true">
                            <i class="hi his-app-was"></i>
                            <div class="d-flex align-self-center w-100">
                                <div>
                                    <h5 class="title h5-sm mb-0">WAS</h5>
                                    <p class="explain mb-0">실시간 모니터링을 통합.</p>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary"><span>실행하기</span></button>
                        </li>
                        <li class="list-group-item d-flex gap-3" aria-current="true">
                            <i class="hi his-app-cache"></i>
                            <div class="d-flex align-self-center w-100">
                                <div>
                                    <h5 class="title h5-sm mb-0">CACHE</h5>
                                    <p class="explain mb-0">캐시 모니터링 현황</p>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary"><span>실행하기</span></button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between gap-3" aria-current="true">
                            <i class="hi his-app-os"></i>
                            <div class="d-flex align-self-center w-100">
                                <div>
                                    <h5 class="title h5-sm mb-0">OS</h5>
                                    <p class="explain mb-0">실시간 모니터링을 통합.</p>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary"><span>실행하기</span></button>
                        </li>
                        <li class="list-group-item d-flex gap-3" aria-current="true">
                            <i class="hi his-app-db"></i>
                            <div class="d-flex align-self-center w-100">
                                <div>
                                    <h5 class="title h5-sm mb-0">DB</h5>
                                    <p class="explain mb-0">캐시 모니터링 현황</p>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary"><span>라이센스 설치</span></button>
                        </li>
                    </ul>

                </div>

                <div class="application-always">
                    <div class="form-check form-check-input-lg mb-2">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            id="customCheckcolor2"
                            checked="">
                        <label class="form-check-label" for="customCheckcolor2">선택된 서비스로 항상 접근합니다.<span> (현재화면은 더이상 나타나지 않습니다.)</span></label>
                    </div>                  
                </div>
            </div>
    </default-layout>
</template>

<script>

import DefaultLayout from '@/layout/DefaultLayout.vue'

export default {
    name: "applicationChoice",
    components: { 
        DefaultLayout
    },
    
}

</script>

<style lang="scss" scoped>


</style>