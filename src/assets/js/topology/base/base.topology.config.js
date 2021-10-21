const DefaultConfig = {
    id : null,
    chartType : null,
    height : "1000",
    data: null,
    events:{
        
    },
    style : {

    },
    options:{
        legend:{
            display:false,
            font:null,
            style:null
        },
        animation:{
            duration : 0
        },
        grouped : true, //pie, doughnut에서만 사용(false -> 임시로 생성된 그룹 하나로 고정, true -> 그룹 입력.)
        stack : false // bar에서만 사용
    },
    tooltip:{
        font:null,
        pos:null,
        formatter: (data)=>{
            console.log(data);
            //return 'html';
            return null;
        },
        events:{

        }
    }
}

export default DefaultConfig;