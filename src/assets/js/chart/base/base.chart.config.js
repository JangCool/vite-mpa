const DefaultConfig = {
    preview : false, 
    id : null,
    chartType : null,
    height : "300",
    data: null, 
    xAxis : {
        type : 'category', //category, time
        timeInfo  : {
            utc : true,
            type : 'streaming', //streaming, day
            unit : 'minute',
            len : 5,
            delay : 0,
            frameRate : 0.5,
            stepSize : 2,
            pause : false
        }
    },
    yAxis : {
        min : 0,
        max : null,
        position : 'left',
        reverse : false,
        maxTicksLimit: 3 //y축 막대기 숫자(y2사용 시 동일하게 사용)
    },
    yAxis1 : {
        use : false,
        min : null,
        max : null,
        position : 'right',
        reverse : true
    },
    events:{
        clickPoint : function(){},
        beforeInit : function(){},
        afterInit : function(){},
        beforeEvent : function(){},
        resize : function(){},
        beforeDraw : function(){},
        onClick : function(){},
        endDrag : function(){}
    },
    style : {
        borderRadius: 0, //도형 모서리 반지름
        borderWidth : 1, //라인 굵기
        pointRadius : 0, //포인트 크기
        hoverRadius : 2, //타겟팅시 포인트 크기
        tension: 0.4, //라인 곡선
        drawLine : true,
        fill : {
            use : false,
            gradation : false
        },
        padding : null, //마진이나 패딩 canvas에 직접 줘버리면 resize시 엉망으로 깨짐.
    },
    options:{
        legend:{
            pointStyle:'circle',
            boxWidth:8,
            display:false,
            position:'top',
            font:null,
            style:null
        },
        animation:{
            duration : 0
        },
        idle : {
            use : false, //pie, doughnut에서만 사용(%의 경우 비어있는 영역 노출여부 결정)
            max : 100,
        },
        //grouped : true, //pie, doughnut에서만 사용(false -> 임시로 생성된 그룹 하나로 고정, true -> 그룹 입력.)
        automode :false, //없는 데이터의 경우 자동으로 추가시켜준다.
        expand : {
            bar : {
                stacked : false,
            },
            circle : {
                grouped : true
            }
        }
    },
    tooltip:{
        font:null,
        pos:null,
        formatter: (data)=>{
            return data;
        },
        events:{

        }
    },
    dragAble : false
}

export default DefaultConfig;