<template>
   <main class="content agent container-fluid p-3 px-4">
       
        <content-location
            locationName="활성/비활성"
            :data="[
                {
                    menuId: '0000001',
                    menuName: '제어'
                },
                {
                    menuId: '0000002',
                    menuName: '캐시 관리'
                },
                {
                    menuId: '0000003',
                    menuName: '활성/비활성'
                }
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
                    <div class="col-xl-3 col-lg-6">
                       <div class="card main-title cache shadow">
                           main-title
                        </div> <!-- end card-->
                    </div> <!-- end col-->

                    <div class="col-xl-9 col-lg-6">
                        <div class="card shadow">
                            <div class="service-group">
                                <div class="ptabs1">
                                    <div class="swiper-container">
                                        <div class="swiper-wrapper">
                                        <swiper
                                                :slides-per-view="3"
                                                :space-between="50"
                                                @swiper="onSwiper"
                                                @slideChange="onSlideChange"
                                            >
                                            <swiper-slide class="bx">
                                                <span class="tab">
                                                   <span class="agent-icon">
                                                        <span class="ico default"></span>
                                                    </span>
                                                    <span class="agent-text">
                                                        <span class="server-name">
                                                            <em class="tit"> 전체 </em>
                                                            <em class="exp">AGENT</em>
                                                        </span>
                                                    </span>
                                                </span>
                                            </swiper-slide>
                                             <swiper-slide class="bx">
                                                <span class="tab">
                                                   <span class="agent-icon">
                                                        <span class="ico default"></span>
                                                    </span>
                                                    <span class="agent-text">
                                                        <span class="server-name">
                                                            <em class="tit"> 전체 </em>
                                                            <em class="exp">AGENT</em>
                                                        </span>
                                                    </span>
                                                </span>
                                            </swiper-slide>
                                             <swiper-slide class="bx">
                                                <span class="tab">
                                                   <span class="agent-icon">
                                                        <span class="ico default"></span>
                                                    </span>
                                                    <span class="agent-text">
                                                        <span class="server-name">
                                                            <em class="tit"> 전체 </em>
                                                            <em class="exp">AGENT</em>
                                                        </span>
                                                    </span>
                                                </span>
                                            </swiper-slide>

                                        </swiper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                      
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
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/swiper.min.css';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },

    setup() {
        
        let {
            setHmAgent,
        } = useUI();

        onMounted(() => {
            setHmAgent();
        })

        const onSwiper = (swiper) => {
            console.log(swiper);
        };

        const onSlideChange = () => {
            console.log('slide change');
        };

       return {
            onSwiper,
            onSlideChange,
        };
    },
    name:'activate'
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
    background:url("/static/img/analysis-error-solid.e39b031f.svg") center center no-repeat;
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
    background:url("/static/img/analysis-error-solid.e39b031f.svg") center center no-repeat;
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


/* PTABS1 */
.ptabs1{overflow:hidden;width:100%;padding:24px 0}
.ptabs1 .bx{overflow:hidden;display:block;position:relative;padding:0 10px;float:left;box-sizing:border-box;-webkit-box-sizing:border-box;}
.ptabs1 .bx .tab{overflow:hidden;display:block;position:relative;height:108px;padding:30px 32px;background-color:#fff;box-sizing:border-box;-webkit-box-sizing:border-box;border:1px solid #dbdbdb;border-radius:4px;-webkit-border-radius:4px;}
.ptabs1 .bx .tab:hover{box-shadow:rgba(0, 0, 0, 0.08) 3px 3px 6px;}
.ptabs1 .bx.on .tab{background-color:#eff7ff;border-color:#3493ff;transition:color .45s ease-in-out,background-color 0.45s ease-in-out, border-color 0.45s ease-in-out, box-shadow 0.45s ease-in-out;}
.ptabs1 .bx.on .tab:after{content:'';display:block;position:absolute;width:20px;height:20px;top:50%;right:20px;transform:translate(0, -50%);background:url('') 0 0 no-repeat;}
.ptabs1 .bx.on .agent-icon.server .ico{background-color:#fff;}
.ptabs1 .bx .server-num{position:absolute;right:14%;top:50%;transform:translate(-50%, -50%);height:38px;font-size:26px;line-height:38px;color:#191919;}
.ptabs1 .bx:after{content:'';width:100%;display:block;clear:both;}
.ptabs1.bx-3 .bx:nth-child(1):nth-last-child(3), .ptabs1.bx-3 .bx:nth-child(1):nth-last-child(3) ~ button{width:33.33%;}
.ptabs1.bx-3 .bx:nth-child(1):nth-last-child(4), .ptabs1.bx-3 .bx:nth-child(1):nth-last-child(4) ~ button{width:33.33%;}
.ptabs1.bx-3 .bx:nth-child(1):nth-last-child(5), .ptabs1.bx-3 .bx:nth-child(1):nth-last-child(5) ~ button{width:33.33%;}
.ptabs1.bx-4 .bx:nth-child(1):nth-last-child(3), .ptabs1.bx-4 .bx:nth-child(1):nth-last-child(3) ~ button{width:25%;}
.ptabs1.bx-4 .bx:nth-child(1):nth-last-child(4), .ptabs1.bx-4 .bx:nth-child(1):nth-last-child(4) ~ button{width:25%}
.ptabs1.bx-4 .bx:nth-child(1):nth-last-child(5), .ptabs1.bx-4 .bx:nth-child(1):nth-last-child(5) ~ button{width:25%}
.ptabs1.bx-5 .bx:nth-child(1):nth-last-child(3), .ptabs1.bx-5 .bx:nth-child(1):nth-last-child(3) ~ button{width:20%;}
.ptabs1.bx-5 .bx:nth-child(1):nth-last-child(4), .ptabs1.bx-5 .bx:nth-child(1):nth-last-child(4) ~ button{width:20%;}
.ptabs1.bx-5 .bx:nth-child(1):nth-last-child(5), .ptabs1.bx-5 .bx:nth-child(1):nth-last-child(5) ~ button{width:20%;}
.service-group .ptabs1 .bx{padding:0;}
.service-group .ptabs1 .bx .tab{height:90px;padding:21px 32px;border-radius:8px;-webkit-border-radius:8px;}
.service-group .ptabs1 .bx.on .tab{border-color:#191919;background-color:#fff;}
.service-group .ptabs1 .bx.on .tab:after{content:'';display:block;position:absolute;width:28px;height:28px;background:red url('') 0 0 no-repeat;}
.service-group .ptabs1 .bx .server-num{right:16%;height:38px;font-size:26px;line-height:38px;}
.service-group .ptabs1 .add-server .tab{background-color:#f1f1f5;cursor:pointer;}
.service-group .ptabs1 .add-server .tab .add{padding-top:26px;background-image:red url();}
.service-group .ptabs1 .bx.blank{cursor:default;}
.service-group .ptabs1 .bx.blank .tab{background-color:#F8F8F8}
.service-group .ptabs1 .bx.blank .tab:before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:56px;height:56px;background:url("") 0 0 no-repeat;}
.service-group .ptabs1 .bx.blank .tab.was:before{background-position:0 0;}
.service-group .ptabs1 .bx.blank .tab.cache:before{background-position:-56px 0;}
.service-group .ptabs1 .bx.blank .tab.db:before{background-position:-112px 0;}
.service-group .ptabs1 .bx.blank .tab.os:before{background-position:-168px 0;}
.service-group .ptabs1 .bx.blank.on .tab:after{display:none;}
.service-group.engine .ptabs1 .bx{position:relative;line-height:22px;}
.service-group.engine .ptabs1 .bx .tab{height:136px;}
.service-group.engine .ptabs1 .bx.on .tab:after{top:70%;right:32px;}
.service-group.engine .ptabs1 .bx .server-name .tit{font-size:18px;line-height:27px;}
.server-connect{overflow:hidden;position:relative;}
.server-connect .ptabs1{padding:0;padding-bottom:30px;}
.server-connect .ptabs1 .bx:disabled .tab{background-color:#fff !important;border-color:#dbdbdb !important;}
.server-connect .ptabs1 .bx:disabled .tab:after{display:none;}
.ptabs1 .bx:disabled .agent-icon.server .ico{background-color:#fff !important;}
.ptabs1 .bx:disabled .server-name , .ptabs1 .bx:disabled .server-name em, .ptabs1 .bx:disabled .server-num{color:#e0e0e0;}
.ptabs1 .bx:disabled .tab:hover{box-shadow:none;cursor:default;}

/* SERVICE GROUP */
.service-group .swiper-slide{width:250px !important;}
.service-group .swiper-slide .server-num{right:24% !important;}
.service-group .swiper-slide.large{width:310px !important;}
.service-group .swiper-slide.large .server-num{right:24% !important;}
.service-group .swiper-slide:hover .tab{box-shadow: rgba(0, 0, 0, 0.08) 3px 3px 6px;}
.service-group .swiper-slide .on{border:1px solid #191919;}
.service-group .swiper-control a{overflow:hidden;position:relative;width:40px;height:40px;margin-top:-20px;background-color:#fff;border:1px solid #dbdbdb;border-radius:20px;-webkit-border-radius:20px;}
.service-group .swiper-control a:after{content:'';position:absolute;top:8px;left:8px;width:24px;height:24px;background:red url('') center center no-repeat;}
.service-group .swiper-control .prev{position:absolute;top:50%;left:24px;}
.service-group .swiper-control .prev:after{background-position:0 0;}
.service-group .swiper-control .next{position:absolute;top:50%;right:24px;}
.service-group .swiper-control .next:after{background-position:-24px 0;}
.service-group .gbox{padding:0 84px;}

// agent-icon
.agent-icon{float:left;position:relative;}
.agent-icon .ico{display:block;float:left;position:relative;width:48px;height:48px;background-color:#f1f1f5;border:2px solid #fff;border-radius:8px;-webkit-border-radius:8px;box-sizing:border-box;-webkit-box-sizing:border-box;}

.agent-text{display:block;float:left;margin-left:16px;text-align:left;}
.agent-text .server-name{font-size:15px;line-height:22px;color:#191919;}
.agent-text .server-name{display:block;margin-top:2px;font-size:13px;line-height:18px;color:#999999;}
.agent-text .server-name .tit{display:block;font-size:15px;line-height:22px;color:#191919;}
.agent-text .server-name .exp{display:block;margin-top:2px;font-size:13px;line-height:18px;color:#999999;}
.agent-text .user-num{position:absolute;right:60px;top:35px;height:38px;font-size:26px;line-height:38px;color:#191919;}
.agent-icon .order-num{display:block;position:absolute;top:-10px;left:-10px;width:24px;height:24px;background-color:#ff4684;border-radius:50%;-webkit-border-radius:50%;text-align:center;}
.agent-icon .order-num em{display:inline-block;font-family:'roboto';color:#fff;font-size:15px;line-height:18px;font-weight:bold;vertical-align:middle;}

</style>