<template>
   <main class="content agent container-fluid p-3 px-4">
       
        <content-location
            locationName="Dashboard"
            :data="[
                {
                    menuId: '0000001',
                    menuName: 'Dashboard'
                },
                {
                    menuId: '0000002',
                    menuName: '에이전트별 캐시 사용 현황'
                },
            ]"
        ></content-location>

        <div class="hm-agent" id="agent-choice">
            <h3><b>에이전트</b><button type="button" id="hmAgentBtn"><em class="ir">열기/닫기</em></button></h3>
            <div class="ws-sch">
                <label for="ws-sch">
                    <em class="ir">검색어 입력</em>
                </label><input type="text" id="ws-sch" placeholder="검색">
            </div>
            
            <div class="ws-sel">
                <span class="slt sd">
                    <label for="selectGroup" class="ir">전체</label>
                    <select id="selectGroup">
                        <option value="serviceGroupAll">전체</option>
                        <option value="SGR0000001">fo</option>
                        <option value="SGR0000002">mo</option>
                    </select>
                </span>
            </div>
            
            <div class="chk-wrap">
                <div class="chk-all">
                    <span class="form-check">
                        <input type="checkbox" id="agchk-all" class="form-check-input">
                        <label for="agchk-all" class="form-check-label">전체선택</label>
                    </span>
                </div>
                <div class="m-sub">
                    <ul>
                        <li>
                            <span class="form-check">
                                <input type="checkbox" id="customCheck1" class="form-check-input">
                                <label for="customCheck1" class="form-check-label">fo-a86844</label>
                            </span>
                            <span class="stat green"><em class="ir">상태 좋음</em></span>
                        </li>
                        <li>
                            <span class="form-check">
                                <input type="checkbox" id="customCheck2" class="form-check-input">
                                <label for="customCheck2" class="form-check-label">fo-a86822</label>
                            </span>
                            <span class="stat yellow"><em class="ir">상태 보통</em></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12">
                <div class="row">
                    <div class="col-xl-9 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <h6 class="card-title">Cache엔진 -시스템CPU사용률<em>(%)</em></h6>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div> <!-- end card-->
                    </div> <!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                       <div class="card widget-flat shadow">
                            <div class="card-header">
                                <h6 class="card-title">읽기(get) 합<em>(건수)</em></h6>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div> <!-- end card-->
                    </div> <!-- end col-->
                </div> <!-- end row -->

                <div class="row">
                    <div class="col-xl-9 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <h6 class="card-title">Cache엔진 -시스템메모리 사용률<em>(%)</em></h6>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div> <!-- end card-->
                    </div> <!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                       <div class="card widget-flat shadow">
                            <div class="card-header">
                                <h6 class="card-title">쓰기(put) 합<em>(건수)</em></h6>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div> <!-- end card-->
                    </div> <!-- end col-->
                </div> <!-- end row -->

                <div class="row">
                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">1차 초당 평균 처리건수(GET)<em>(건수)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">1차 초당 평균 처리건수(PUT)<em>(건수)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">1차 초당 평균 처리건수(GET)<em>(건수)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div><!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">1차 초당 평균 처리건수(PUT)<em>(건수)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->
                </div><!-- end row -->

                <div class="row">
                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">1차 평균응답시간(GET)<em>(ms)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">1차 평균응답시간(PUT)<em>(ms)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">2차 평균응답시간(GET)<em>(ms)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div><!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->

                    <div class="col-xl-3 col-lg-6">
                        <div class="card widget-flat shadow">
                            <div class="card-header">
                                <div class="card-title">2차 평균응답시간(PUT)<em>(ms)</em></div>
                            </div>
                            <div class="card-body" style="position:relative">
                                <div class="widget-charts">
                                    <div class="chart-canvas" style="height: 200px; background-color:#f2f2f2"></div>
                                </div>
                            </div> <!-- end card-body-->
                        </div><!-- end card-->
                    </div><!-- end col-->
                </div><!-- end row -->
            </div>
        </div>
   </main>
</template>

<script>

import { onMounted } from 'vue'
import { useUI } from '@/composables/use.ui.js'

export default {
    setup() {
        
        let {
            setHmAgent
        } = useUI();

        onMounted(() => {
            setHmAgent();
        })

        return {}

    },
    name:'splitHeroGrid'
}
</script>

<style lang="scss">

/* AGENT RIGHT */
.hm-agent{
    overflow: hidden;
    position: fixed;
    top: 53px;
    right: 0;
    width: 40px;
    height: 100%;
    border-left: 1px solid #D8DFE8;
    padding-bottom: 12px;
    z-index: 1;
    transition: all 0.3s ease;
    background-color: #fff;
}
.hm-agent h3{
    position: relative;
    height:55px;
    min-height: 32px;
    padding: 15px 0 7px 4px;
    border-bottom: 1px solid #EDEDED;
    font-size: 15px;
    line-height: 32px;
}
.hm-agent h3 b{
    display:none;
}
.hm-agent h3 button{
    position:absolute;
    left:4px;top:15px;
    width:32px;
    height:32px;
    background:url("../../../assets/svg/icon/agent-arrow-right.svg") center center no-repeat;
}
.hm-agent .ws-sch{
    display:none;
    position:relative;
    padding:8px 12px 8px 32px;
    border-bottom:1px solid #EDEDED;
}
.hm-agent .ws-sch label{
    display:block;
    position:absolute;
    left:12px;
    top:50%;
    width:16px;
    height:16px;
    margin-top:-8px; 
    background:url("../../../assets/svg/icon/search-solid.svg") center center no-repeat;
}
.hm-agent .ws-sch input{
    width:100%;
    border:0;
    font-size:12px;
    line-height:18px;
    vertical-align: top;
}
.hm-agent .ws-sel{
    display:none;
    position:relative;
    padding:10px 12px;
    border-bottom:1px solid #EDEDED;
}
.hm-agent .chk-wrap{
    height:100%;
}
.hm-agent .chk-wrap .chk-all{
    display:none;height:24px;padding:0 12px;
}
.hm-agent .chk-wrap .chk-all .form-check{
    display:block;margin-top:16px;
}
.hm-agent .chk-wrap .chk-all .form-check label{
    position:relative;
    display:block;
    height:20px;
    font-size:12px;
    line-height:20px;
}
.hm-agent .chk-wrap .m-sub{
    overflow-y:auto;
    height:calc(100% - 54px);
    height:-webkit-calc(100% - 54px);
    transition:height 0.2s;
    padding:0 12px;
}
.hm-agent .chk-wrap .m-sub li{
    position:relative;height:20px;
}
.hm-agent .chk-wrap .m-sub li .form-check{
    display:none;margin-top:8px;
}
.hm-agent .chk-wrap .m-sub li .form-check label{
    overflow:hidden;
    display:block;
    padding-right:18px;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.hm-agent .chk-wrap .m-sub li .stat{
    position:absolute;
    right:4px;
    top:50%;
    width:8px;
    height:8px;
    margin-top:4px;
    border-radius:50%;
    -webkit-border-radius:50%;
}
.hm-agent .chk-wrap .m-sub li .stat.green{
    background-color:#00CD69
}
.hm-agent .chk-wrap .m-sub li .stat.yellow{
    background-color:#FEBD0A
}
.hm-agent .chk-wrap .m-sub li .stat.red{
    background-color:#F52312
}
.hm-agent.ag-fx{
    width:110px;
    box-shadow:0 0 10px 0 rgba(0,0,0,0.25);
}
.hm-agent.ag-fx h3{
    padding-left:36px;
}

.hm-agent.ag-fx h3 button{
    background-image:url("../../../assets/svg/icon/agent-arrow-left.svg");
}

.hm-agent.ag-fx h3 b{
    display:block;
}
.hm-agent.ag-fx .ws-sch{
    display:block;
}
.hm-agent.ag-fx .ws-sel{
    display:block;
}
.hm-agent.ag-fx .chk-wrap .chk-all{
    display:block;
}
.hm-agent.ag-fx .chk-wrap .m-sub li .form-check{
    display:block;
}
.hm-agent.ag-fx .chk-wrap .m-sub li .stat{
    margin-top:-4px;
}
.hm-agent.ag-fx .chk-wrap .m-sub{
    height:calc(100% - 140px);
    height:-webkit-calc(100% - 140px);
}
.as-right .hm-agent{
    right:64px;
}
.as-right.as-fx .hm-agent{
    right:250px;
}
</style>