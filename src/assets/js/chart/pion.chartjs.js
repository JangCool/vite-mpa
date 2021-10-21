import util from '../../../utils/util';
import moment from 'moment';
import 'chartjs-adapter-moment'
import BaseChart from './base/base.chart';
import { BaseChartjsEvent } from './base/base.chartjs.events';
import constant from '../../../assets/js/constant/constant';

import { Chart, registerables, ScatterController } from 'chart.js';
Chart.register(...registerables);

import ChartDataLabels from 'chartjs-plugin-datalabels';
//Chart.register(ChartDataLabels);

import { registChartType } from './interface/pion.chartjs.extends.js'

registChartType(Chart, {ScatterController:ScatterController});

class ChartJs extends BaseChart {
    #chart;
    #config;
    #seriesIdList; 
    #groupIdList; 
    //#categoryIdList;
    #colorChip;
    #colorIdx;

    constructor(config){
        super(); 
        this.#config = config;
        this.#seriesIdList = [];
        this.#groupIdList = [];
        //this.#categoryIdList = [];
        this.#colorChip = [
            { name:'red', color:'ff6384', trans:1}, 
            //{ name:'orange', color:'ff9f40', trans:1}, 
            { name:'yellow', color:'ffcd56', trans:1}, 
            { name:'green', color:'4bc0c0', trans:1}, 
            { name:'dodgerblue', color:'1e90ff', trans:1}, 
            { name:'brown', color:'800000', trans:1},
            { name:'purle', color:'c73399', trans:1}, 
            { name:'gray', color:'c9cbcf', trans:1}, 
            { name:'indigo', color:'4b0082', trans:1}, 
        ];
        this.#colorIdx = 0;
        
        const chartCanvas = document.getElementById(config.getConfig().id);
        chartCanvas.setAttribute('height', ''+config.getConfig().height)
        //chartCanvas.style.height = config.getConfig().height+'px';

        let chartjsConfig = this.#convertConfig(this.#config.getConfig());
        chartjsConfig.plugins = [{
            beforeInit: function(chart) {
                BaseChartjsEvent.beforeInit(chart, config.getConfig());
            },
            afterInit: function (chart) {
                BaseChartjsEvent.afterInit(chart, config.getConfig());
            },
            beforeEvent: function (chart, event) {
                BaseChartjsEvent.beforeEvent(chart, event, config.getConfig());
            },
            resize: function (chart) {
                BaseChartjsEvent.resize(chart, config.getConfig());
            },
            beforeDraw: function(chart){
                BaseChartjsEvent.beforeDraw(chart, config.getConfig());
            },
            beforeUpdate: function(chart){
                if(chart.changeCtgVisibled){
                    chart.data.labels = [];
                    chart.data.datasets = [];
                    chart.viewCtgIdList = util.object.cloneDeep(chart.oriCtgIdList);
                    chart.data.datasets = util.object.cloneDeep(chart.ctgData.datasets);
        
                    chart.ctgVisibled.forEach((visible, idx) => {
                        if(visible){
                            chart.data.labels.push(chart.ctgData.labels[idx]);
                        }
                    });
        
                    for(let idx=chart.ctgVisibled.length-1;idx>=0;idx--){
                        if(!chart.ctgVisibled[idx]){
                            chart.data.datasets.forEach(dataset => {
                                if(dataset.data.length>idx) dataset.data.splice(idx, 1);
                            })
                            chart.oriCtgIdList.splice(idx, 1);
                        }
                    }
        
                    chart.changeCtgVisibled = false;
                }
            }
        }]
        if(['pie', 'doughnut'].indexOf(chartjsConfig.type) > -1){
            if(config.getConfig().previewYn === constant.BOOLEAN_FALSE)
                chartjsConfig.plugins.push(ChartDataLabels);

            chartjsConfig.options.plugins.datalabels = {
                backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                },
                borderColor: 'white',
                borderRadius: 25,
                borderWidth: 2,
                color: 'white',
                display: function(context) {
                    var dataset = context.dataset;
                    var count = dataset.data.length;
                    var value = dataset.data[context.dataIndex];
                    return value > count * 1.5;
                },
                font: {
                    weight: 'bold'
                },
                padding: 6,
                formatter: Math.round
            }
            chartjsConfig.options.plugins.tooltip = {enabled: false};

            chartjsConfig.data = {
                labels:[],
                datasets: [
                    {
                        label: 'circleChartDefaultData',
                        data: [1],
                        borderColor:['rgba(222,222,222,0.6)'],
                        backgroundColor: ['rgba(222,222,222,0.15)']
                    }
                ]
            }
        }else{
            chartjsConfig.options.interaction = {
                mode: 'index', //커서의 x축 기준으로 hover
                intersect: false
            }
        }
            
        chartjsConfig.options.events = ['mousedown', 'mouseup', 'mousemove', 'mouseout'];

        if(config.getConfig().style.colorChip){
            this.#colorChip = config.getConfig().style.colorChip;
        }
        
        //차트 미리보기
        if(config.getConfig().previewYn === constant.BOOLEAN_TRUE){
            chartjsConfig.options.plugins.tooltip = false;
            if(["pie", "doughnut"].indexOf(config.getConfig().chartType)>-1){
                this.#config.getConfig().style.fill.use = true;
                this.#config.getConfig().style.fill.gradation = true;
            }
        }

        this.#chart = new Chart(chartCanvas, chartjsConfig);

        //category 타입의 차트는 원본 데이터를 가지고 있고 show, hide호출 시 changeCtgVisibled값을 기준으로 beforeUpdate에서 chart.data를 재구성함.
        //doughnut과 pie차트는 아님.
        if(config.getConfig().xAxis.type === 'category' && ["pie", "doughnut"].indexOf(config.getConfig().chartType)===-1){
            this.#chart.ctgData = { labels:[], datasets:[] };
            this.#chart.ctgVisibled = [];
            this.#chart.oriCtgIdList = [];
            this.#chart.viewCtgIdList = [];
            this.#chart.changeCtgVisibled = false;
        }
        
        if(config.getConfig().series){
            this.setSeries(config.getConfig().series);
        }else if(["pie", "doughnut"].indexOf(config.getConfig().chartType)>-1 && !config.getConfig().options.grouped){
            this.addGroup({
                id : config.getConfig().id + "_gId",
                name : config.getConfig().id + "_gName"
            })
        }

        if(config.getConfig().categorys)
            this.addCategory(config.getConfig().categorys);

        if(config.getConfig().previewYn === constant.BOOLEAN_TRUE){
            this.#makePreviewChart();
            return;
        }
    }

    getConfig(){
        return util.object.cloneDeep(this.#config.getConfig());
    }

    #getTimeGap = function(timeUnit) {
        var time = 1000
        switch (timeUnit) {
            case 'second':
                time = 1000
                break
            case 'minute':
                time = 1000 * 60
                break
            case 'hour':
                time = 1000 * 60 * 60
                break
        }
        return time
    }

    #convertConfig = function(config){
        //chartjs에서 사용할 디폴트 옵션
        let chartjsConfig = {
            id : config.id,
            type: config.chartType,
            data: config.data,
            options : {
                maintainAspectRatio : false, //원래비율 유지시킬지 영역에 구속시킬지
                responsive : true,
                scales : {},
                borderRadius: config.style.borderRadius, //bar차트 모서리
                borderWidth : config.style.borderWidth, //라인 굵기
                pointRadius : config.style.pointRadius, //포인트 크기
                hoverRadius : config.style.hoverRadius, //타겟팅시 포인트 크기
                tension: config.style.tension,
                animation : {
                    duration: config.options.animation.duration
                },
                plugins:{
                    legend : {
                        display : config.options.legend.display,
                        position : config.options.legend.position,
                        labels : {
                            boxWidth : config.options.legend.boxWidth,
                            usePointStyle : true,
                            pointStyle : config.options.legend.pointStyle,
                        }
                    }
                }
                //grouped : config.options.grouped
            }
        };

        if(config.xAxis.type === 'time' || config.xAxis.type === 'day'){
            var timeGap = this.#getTimeGap(config.xAxis.timeUnit) * config.xAxis.timeLen

            chartjsConfig.options.scales.x = {
                //type : config.xAxis.type,
                type : 'time',
                time: {
                    parser: 'MM/DD/YYYY HH:mm:ss',
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        millisecond: 'HH:mm:ss.SSS',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH'
                    },
                    unit: config.xAxis.timeUnit,
                    stepSize: 1
                },
                ticks: {
                    autoSkip: true,
                    callback: function (dataLabel) {
                        const len = dataLabel.length;
                        const time = dataLabel.substring(len-2);
                        if(+time%2 == 0)
                            return '';
                        
                        return dataLabel;
                    }
                },
                grid :{
                    display: false
                },
                /*
                min : moment(config.xAxis.startTime).milliseconds(0).subtract(timeGap).toDate(),
                max : moment(config.xAxis.startTime).milliseconds(0).toDate(),
                timeGap : timeGap,
                updateTerm : (util.isEmpty('undefined') ? 1 : config.xAxis.updateTerm)
                */
            };
            if(config.xAxis.type === 'time'){
                chartjsConfig.options.scales.x.min = moment(config.xAxis.startTime).milliseconds(0).subtract(timeGap).toDate();
                chartjsConfig.options.scales.x.max = moment(config.xAxis.startTime).milliseconds(0).toDate();
                chartjsConfig.options.scales.x.timeGap = timeGap;
                chartjsConfig.options.scales.x.updateTerm = (util.isEmpty(config.xAxis.updateTerm) ? 2000 : config.xAxis.updateTerm);
            }else{
                chartjsConfig.options.scales.x.min = moment(config.xAxis.startTime).startOf('day').toDate();
                chartjsConfig.options.scales.x.max = moment(config.xAxis.startTime).endOf('day').toDate();
            }
            //chartjsConfig.options.scales.y = {}
        }else{
            console.log("category")
        }

        if(['doughnut', 'pie'].indexOf(config.chartType) === -1){
            chartjsConfig.options.scales.y = {
                ticks: {
                    maxTicksLimit: config.yAxis.maxTicksLimit,
                    includeBounds : false
                },
                bounds: 'ticks'
            };
            if(config.yAxis.position) chartjsConfig.options.scales.y.position = config.yAxis.position;
            if(util.isNumber(config.yAxis.min)) chartjsConfig.options.scales.y.min = config.yAxis.min;
            if(util.isNumber(config.yAxis.max) && config.previewYn === constant.BOOLEAN_FALSE) chartjsConfig.options.scales.y.max = config.yAxis.max;
            if(util.isNumber(config.yAxis.suggestedMin) && config.previewYn === constant.BOOLEAN_FALSE) chartjsConfig.options.scales.y.suggestedMin = config.yAxis.suggestedMin;
            if(util.isNumber(config.yAxis.suggestedMax) && config.previewYn === constant.BOOLEAN_FALSE) chartjsConfig.options.scales.y.suggestedMax = config.yAxis.suggestedMax;
            

            if(config.yAxis2.use){
                chartjsConfig.options.scales.y1 = {};
                chartjsConfig.options.scales.y1.min = config.yAxis2.min;
                chartjsConfig.options.scales.y1.max = config.yAxis2.max;
                chartjsConfig.options.scales.y1.position = config.yAxis2.position;
                chartjsConfig.options.scales.y1.grid = { drawOnChartArea: false  }
                chartjsConfig.options.scales.y1.ticks = { maxTicksLimit: config.yAxis.maxTicksLimit }
            }

            if(!config.style.drawLine){
                chartjsConfig.options.scales.x = util.object.merge(chartjsConfig.options.scales.x, {});
                chartjsConfig.options.scales.y = util.object.merge(chartjsConfig.options.scales.y, {});
                chartjsConfig.options.scales.x.grid = util.object.merge(chartjsConfig.options.scales.x.grid, {});
                chartjsConfig.options.scales.y.grid = util.object.merge(chartjsConfig.options.scales.y.grid, {});
                chartjsConfig.options.scales.x.ticks = util.object.merge(chartjsConfig.options.scales.x.ticks, {});
                chartjsConfig.options.scales.y.ticks = util.object.merge(chartjsConfig.options.scales.y.ticks, {});

                chartjsConfig.options.scales.x.grid.display = false;
                chartjsConfig.options.scales.x.grid.drawBorder = false;
                chartjsConfig.options.scales.x.ticks.display = false;

                chartjsConfig.options.scales.y.grid.display = false;
                chartjsConfig.options.scales.y.grid.drawBorder = false;
                chartjsConfig.options.scales.y.ticks.display = false;
            }
        }

        if('bar' === config.chartType && config.options.stack){
            chartjsConfig.options.scales.x = util.object.merge(chartjsConfig.options.scales.x, {});
            chartjsConfig.options.scales.y = util.object.merge(chartjsConfig.options.scales.y, {});

            chartjsConfig.options.scales.x.stacked = true;
            chartjsConfig.options.scales.y.stacked = true;
        }

        if(!util.isEmpty(config.style.padding)){
            chartjsConfig.options.layout = { padding : config.style.padding }
        }

        return chartjsConfig;
    }

    #getColorChip = function(){
        const colorInfo = this.#colorChip[ this.#colorIdx++ % this.#colorChip.length ];
        const color = colorInfo.color;
        const changeToNum = `${+('0x'+color[0]+color[1]).toString(10)}, ${+('0x'+color[2]+color[3]).toString(10)}, ${+('0x'+color[4]+color[5]).toString(10)}`;

        let colorValue = `rgba(${changeToNum}, ${colorInfo.trans})`;
        if(this.#config.getConfig().style.fill.use 
        && this.#config.getConfig().style.fill.gradation){
            colorValue = this.#getGradationColor(colorValue);
        }

        return colorValue;
    }

    #getGradationColor = function(color){
        let idx = color.length;
        while(color[--idx]!=',');

        const c1 = color;
        const c2 = color.substring(0, idx)+', 0.3)';
        const c3 = color.substring(0, idx)+', 0.1)';

        const chartArea = this.#chart.chartArea;
        let gradient;
        if(['pie', 'doughnut'].indexOf(this.#config.getConfig().chartType) === -1){
            gradient = this.#chart.ctx.createLinearGradient(chartArea.left, chartArea.top, chartArea.left, chartArea.bottom);

            gradient.addColorStop(0, c1);
            gradient.addColorStop(0.5, c2);
            gradient.addColorStop(1, c3);
        }else{
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            const r = Math.min(
                (chartArea.right - chartArea.left) / 2,
                (chartArea.bottom - chartArea.top) / 2
            );
            var ctx = this.#chart.ctx;
            gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
            gradient.addColorStop(0, c3);
            gradient.addColorStop(0.5, c2);
            gradient.addColorStop(1, c1);
        }

        return gradient;
    }
    
    
    /**
     * 차트를 그리기 위해 데이터를 설정 한다.
     * 
     * @param {Array} data 차트 데이터
     * [
     *      {
     *          id: Series id,
     *          name: Series 명,
     *          data: Series data (Array Value 또는 Array Object), ex) Array Value = [3,5,2,4,6,9], ex) Array Object = [{x: 1421919, y: 64},{x: 191919, y: 5 },{x: 131919, y: 4 }...]
     *      },
     *      {
     *          id: Series2 id,
     *          name: Series2 명,
     *          data: Series2 data
     *      }
     * ]
     * 
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    setSeries(data){
        // 데이터를 한번에 받아서 처리할 수 있도록 함수 제공 기능 필요.
        /*
        this.#chart.tempData = {
            labels:[],
            datasets:[]
        }
        
        this.#seriesIdList = [];
        this.#groupIdList = [];
        */

        if(!Array.isArray(data)) data = [data];

        data.forEach(d => {
            if(!d.name) d.name = d.id;
            const seriesInfo = [{
                id : d.id,
                name : d.name,
                style : d.style
            }]

            
            this.addSeries({series:seriesInfo});

            if(d.data){
                this.addPoint({
                    id : d.id,
                    value : d.data
                })
            }
        })

        this.update();
    }


    addGroup(groupInfo){
        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            if(this.#chart.data.datasets[0].label === 'circleChartDefaultData'){
                this.#chart.data.datasets.splice(0, 1);
            }

            if(this.#groupIdList.indexOf(groupInfo.id) > -1){
                console.log(`${groupInfo.id} is exists`);
                return false;
            }

            let data = [];
            if(Array.isArray(groupInfo.data)) data = groupInfo.data;
            else if(!util.isEmpty('undefined')) data = [groupInfo.data];

            this.#chart.data.datasets.push({
                id : groupInfo.id,
                label : groupInfo.name,
                data : data,
                borderColor : [],
                backgroundColor : []
            })

            //doughnut과 pie는 그룹단위로 색상이 정해지지 않고 series단위로 색상이 정해짐
            //색상은 전부 동일하게 유지
            this.#groupIdList.push(groupInfo.id);
            const idx = this.#chart.data.datasets.length - 1;
            if(idx > 0){
                this.#chart.data.datasets[idx].borderColor = util.object.cloneDeep(this.#chart.data.datasets[idx-1].borderColor);
                this.#chart.data.datasets[idx].backgroundColor = util.object.cloneDeep(this.#chart.data.datasets[idx-1].backgroundColor);
            }
        }else if(['line', 'bar'].indexOf(this.#config.getConfig().chartType) > -1){
            console.log(`${this.#config.getConfig().chartType} is not supported group`);
        }
    }

    addSeries(seriesInfo) {
        if(seriesInfo.group){
            seriesInfo.group.forEach(g=>{
                this.addGroup(g);
            })
        }

        let seriesArray = seriesInfo.series;
        if(!Array.isArray(seriesArray)) seriesArray = [seriesArray];

        seriesArray.forEach(series=>{
            const idx = this.#seriesIdList.indexOf(series.id);
            if(idx > -1){
                console.log(`seriesId[${series.id}] is exists`);
                return true;
            }
            this.#seriesIdList.push(series.id);

            let seriesStyle = util.object.cloneDeep(this.#config.getConfig().style);
            if(series.style){
                seriesStyle = util.object.merge(series.style, seriesStyle);
            }
            
            if(!util.isString(seriesStyle.borderColor) && !util.isString(seriesStyle.backgroundColor)){
                seriesStyle.borderColor = this.#getColorChip();
                seriesStyle.backgroundColor = seriesStyle.borderColor;
            }else{
                if(!util.isString(seriesStyle.borderColor))
                    seriesStyle.borderColor = seriesStyle.backgroundColor;
                else if(!util.isString(seriesStyle.backgroundColor))
                    seriesStyle.backgroundColor = seriesStyle.borderColor;

                if(this.#config.getConfig().style.fill.gradation)
                    seriesStyle.backgroundColor = this.#getGradationColor(seriesStyle.backgroundColor);
            }

            if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
                this.#chart.data.labels.push(series.name);
    
                this.#chart.data.datasets.forEach(dataset=>{
                    dataset.borderColor.push(seriesStyle.borderColor);
                    dataset.backgroundColor.push(seriesStyle.backgroundColor); 
                })
                
            }else if(['line', 'bar'].indexOf(this.#config.getConfig().chartType) > -1){
                let newDataset = {
                    id : series.id,
                    label : series.name,
                    data : [],
                    borderColor : [seriesStyle.borderColor],
                    backgroundColor : [seriesStyle.backgroundColor],
                    yAxisID : (series.yAxisID?series.yAxisID:'y'),
                    fill:this.#config.getConfig().style.fill.use,
                    borderRadius: seriesStyle.borderRadius,
                    borderWidth : seriesStyle.borderWidth,
                    pointRadius : seriesStyle.pointRadius,
                    hoverRadius : seriesStyle.hoverRadius,
                    tension: seriesStyle.tension
                };

                if(this.#config.getConfig().xAxis.type === 'category'){
                    this.#chart.ctgData.datasets.push(util.object.cloneDeep(newDataset));
                }

                this.#chart.data.datasets.push(util.object.cloneDeep(newDataset));
            }
        })
    }

    removeSeries(seriesId){
        const idx = this.#seriesIdList.indexOf(seriesId);
        if(idx === -1){
            console.log(`${seriesId} is not exists`);
            return false;
        }

        this.#seriesIdList.splice(idx, 1);
        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            this.#chart.data.labels.splice(idx, 1);
            this.#chart.data.datasets.forEach(dataset=>{
                if(dataset.data.length > idx) dataset.data.splice(idx, 1);
            })
        }else if(['line', 'bar'].indexOf(this.#config.getConfig().chartType) > -1){
            if(this.#config.getConfig().xAxis.type === 'category'){
                this.#chart.ctgData.datasets.splice(idx, 1);    
            }
            this.#chart.data.datasets.splice(idx, 1);
        }
    }

    hideSeries(seriesId){
        const seriesIdx = this.#seriesIdList.indexOf(seriesId);
        if(seriesIdx === -1){
            console.log(`${seriesId} is not exists`);
            return false;
        }

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            //this.hideCategory(seriesIdx);
            if(this.#chart.getDataVisibility(seriesIdx))
                this.#chart.toggleDataVisibility(seriesIdx);
        }else{
            if(this.#config.getConfig().xAxis.type === 'category'){
                this.#chart.ctgData.datasets[seriesIdx].hidden = true;
            }
            this.#chart.data.datasets[seriesIdx].hidden = true;
        }

        this.update(true);
    }

    showSeries(seriesId){
        const seriesIdx = this.#seriesIdList.indexOf(seriesId);
        if(seriesIdx === -1){
            console.log(`${seriesId} is not exists`);
            return false;
        }

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            if(!this.#chart.getDataVisibility(seriesIdx))
                this.#chart.toggleDataVisibility(seriesIdx);
        }else{
            if(this.#config.getConfig().xAxis.type === 'category'){
                this.#chart.ctgData.datasets[seriesIdx].hidden = false;
            }
            this.#chart.data.datasets[seriesIdx].hidden = false;
        }

        this.update(true);
    }

    isSeriesVisibled = (seriesId) => {
        const seriesVisibleArr = this.getSeriesVisibled();
        return (seriesVisibleArr[seriesId]?true:false);
    }

    getSeriesVisibled(){
        var result = {};

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            this.#seriesIdList.forEach((seriesId, idx)=>{
                result[seriesId] = this.#chart.getDataVisibility(idx);
            })
        }else{
            if(!Array.isArray(this.#chart.data.datasets)) return result;

            this.#chart.data.datasets.forEach((dataset, idx)=>{
                if(!util.isBoolean(dataset.hidden)) dataset.hidden = false;
                result[this.#seriesIdList[idx]] = !dataset.hidden;
            })
        }
        return result
    }

    setAllSeriesVisibled(visibled){
        const seriesVisibleArr = this.getSeriesVisibled();
        for(var seriesId in seriesVisibleArr){
            if(seriesVisibleArr[seriesId] !== visibled){
                if(visibled) this.showSeries(seriesId);
                else this.hideSeries(seriesId);
            }
        }
    }

    getSeriesIdByName = (seriesName)=>{
        let seriesIdList = [];

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            this.#chart.data.labels.forEach( (labelsName, idx) => {
                if(labelsName === seriesName){
                    seriesIdList.push(this.#seriesIdList[idx]);
                }
            })
        }else if(['line', 'bar'].indexOf(this.#config.getConfig().chartType) > -1){
            this.#chart.data.datasets.forEach( (dataset, idx) => {
                if(dataset.label === seriesName){
                    seriesIdList.push(this.#seriesIdList[idx]);
                }
            })
        }

        return seriesIdList;
    }

    /**
     * series존재여부를 seriesId로 확인한다.
     */
    containSeries (seriesId) {
        const idx = this.#seriesIdList.indexOf(seriesId);
        if(idx === -1)
            return false;
        return true;
    }

    /**
     * series존재여부를 seriesName으로 확인한다.
     */
    containSeriesByName (seriesName) {
        return (this.getSeriesIdByName(seriesName).length > 0);
    }

    #addPointUseGroup = function(pointInfo){
        if(!pointInfo){
            console.log('invalid pointInfo');
            return false;
        }

        const groupIdx = this.#groupIdList.indexOf(pointInfo.id);
        if(groupIdx === -1){
            console.log(`groupId[${pointInfo.id}] is not exists`);
            return false;
        }

        pointInfo.value.forEach( d => {
            if(typeof d !== typeof {}){
                this.#chart.data.datasets[groupIdx].data.push(d);
            }else{
                const seriesIdx = this.#seriesIdList.indexOf(d.id);
                if(seriesIdx === -1){
                    console.log(`seriesId[${d.id}] is not exists`);
                    return true;
                }

                this.#chart.data.datasets[groupIdx].data[seriesIdx] = d.value;
            }
        })
    }

    #makeTimeLabel = function(timeData){
        const xScales = this.#chart.options.scales.x;

        var minTime = xScales.min
        var maxTime = xScales.max

        //if(this.#config.getConfig().chartType === 'bScatter'){
            let cnt = 0;
            //while( (maxTime.getTime()+cnt*xScales.updateTerm < moment().millisecond(0).toDate().getTime()) //현재시간과 비교
            //    || maxTime.getTime()+cnt*xScales.updateTerm < timeData.toDate().getTime()) //데이터에서 들어온 시간
            //    cnt++;
            while( maxTime.getTime()+cnt*xScales.updateTerm < timeData.toDate().getTime()) //데이터에서 들어온 시간
                cnt++;
            cnt--;

            if(cnt > 0){
                xScales.preMaxTime = maxTime;
            }else{
                return false;
            }

            xScales.max = moment(maxTime).add(xScales.updateTerm*cnt, 'milliseconds').milliseconds(0).toDate();
            xScales.min = moment(minTime).add(xScales.updateTerm*cnt, 'milliseconds').milliseconds(0).toDate();
        /*
        }else{
            this.#chart.data.datasets.forEach((dataset) => {
                while (dataset.data.length > 1) {
                    if (moment(dataset.data[0].x).toDate().getTime() < minTime.getTime() &&
                            moment(dataset.data[1].x).toDate().getTime() < minTime.getTime()) {
                        dataset.data.shift()
                    } else break
                }
            })

            if(maxTime.getTime() > timeData.toDate().getTime()) return false;

            const timeGap = moment().toDate().getTime() - maxTime.getTime();
            //console.log(timeGap);
            xScales.max = moment(maxTime).add(timeGap, 'milliseconds').toDate();
            xScales.min = moment(minTime).add(timeGap, 'milliseconds').toDate();
        }
        */

        return true;
    }

    #realAddPointUseSeries = function(datasetsIdx, point){
        if(this.#config.getConfig().xAxis.type === 'category'){
            if(typeof point === 'object'){
                let dataIdx = this.#chart.viewCtgIdList.indexOf(point.x);
                if(dataIdx === -1){
                    //this.addCategory({ x:point.x, name:point.x });
                    //dataIdx = this.#chart.viewCtgIdList.indexOf(point.x);

                    //카테고리가 hide인 경우 별도로 보관되는 ctgData객체만 업데이트 시키고 종료.
                    if(this.#chart.oriCtgIdList.includes(point.x)){
                        dataIdx = this.#chart.oriCtgIdList.indexOf(point.x);
                        this.#chart.ctgData.datasets[datasetsIdx].data[dataIdx] = point.y;
                    }
                    
                    return;
                }
                this.#chart.data.datasets[datasetsIdx].data[dataIdx] = point.y;

                //category를 숨기는 기능이 없기 때문에 별도로 데이터를 지니고 있는다.
                if(this.#chart.ctgData && this.#chart.oriCtgIdList.includes(point.x)){
                    let oriDataIdx = this.#chart.oriCtgIdList.indexOf(point.x);
                    this.#chart.ctgData.datasets[datasetsIdx].data[oriDataIdx] = point.y;
                }
            }else{
                this.#chart.data.datasets[datasetsIdx].data.push(point);
                if(this.#chart.ctgData){
                    this.#chart.ctgData.datasets[datasetsIdx].data.push(point);
                }
            }
        //}else if(this.#config.getConfig().xAxis.type === 'time'){
        }else if(this.#chart.options.scales.x.type === 'time'){
            const timeData = moment(point.x);

            //일단 day의 경우 makeTimeLabel 안타게.
            //이후에 들어온 데이터의 x단위가 max를 넘어가면 하루 단위로 갱신되게 makeTimeLabel 수정 필요함.
            if(this.#config.getConfig().xAxis.type === 'time')
                this.#makeTimeLabel(timeData);

            this.#chart.data.datasets[datasetsIdx].data.push({
                x : timeData,
                y : point.y
            });
        }
    }
    #addPointUseSeries = function(pointInfo, debug){
        if(!pointInfo){
            console.log('invalid pointInfo');
            return false;
        }

        if(debug) console.log(pointInfo)
        
        const idx = this.#seriesIdList.indexOf(pointInfo.id);

        if(idx === -1){
            console.log(`seriesId[${pointInfo.seriesId}] is not exists`);
            return true;
        }

        if(Array.isArray(pointInfo.value)){
            pointInfo.value.forEach(p => this.#realAddPointUseSeries(idx, p));
        }else{
            this.#realAddPointUseSeries(idx, pointInfo.value);
        }
    }

    
    /**
     * -----------------------points-----------------------
     * ['doughnut', 'pie'] => groupId 필수
     *  groupId 필수. seriesId 선택.
     *  pointInfo = {
     *      group : {
     *          id : 'groupId'
     *      }, 
     *      data : [ 1,2,3,4... ] 
     *              or 
     *      data : [ {id:'seriesId', value:1}, {id:'seriesId', value:2}... ]
     *  }
     * 
     * ['line', 'bar'] => seriesId 필수
     *  seriesId 필수. y축에 대한 값이 필수로 있어야함.
     *  
     * 
     * -----------------------options-----------------------
     * {
     *      clear : 'boolean', 추가 전 데이터를 제거한다.
     *      update : boolean', 좌표값을 갱신하며 화면을 다시 그린다.
     *      render : boolean'  좌표값 갱신 없이 화면만 다시 그린다.
     * }
     */
    addPoint(pointInfo, options, debug) {
        options = util.object.merge({clear:false, update:true, render:false}, options)

        if(options && options.clear) this.clear();
        
        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            const config = this.#config.getConfig();
            if(!config.options.grouped){
                pointInfo.id = config.id + "_gId";
            }
            
            this.#addPointUseGroup(pointInfo);
        }else if(['line', 'bar'].indexOf(this.#config.getConfig().chartType) > -1){
            if(Array.isArray(pointInfo)){
                pointInfo.forEach(p => this.addPoint(p, {update:false}));
            }else{
                this.#addPointUseSeries(pointInfo, debug);
            }
        }
        
        if(options && options.update) this.update();
        if(options && options.render) this.render();
    }

    setPlotLine(plotPos){
        this.#chart.plotPos = plotPos;
        BaseChartjsEvent.drawPlotLine(this.#chart);
    }

    removePlotLine() {
        this.#chart.plotPos = undefined;
        let plotDiv = document.querySelector("#"+this.#config.getConfig().id).parentNode.querySelector(".plot");
        if(plotDiv !== null) plotDiv.remove();
    }

    clear(){
        this.#chart.data.datasets.forEach(dataset => {
            dataset.data = [];
        })
        if(this.#chart.ctgData){
            this.#chart.ctgData.datasets.forEach(dataset => {
                dataset.data = [];
            })
        }
    }

    #circleChartBeforeUpdate(){
        //기본으로 잡혀있는 기존데이터 삭제
        if(this.#chart.data.datasets[0].label === 'circleChartDefaultData'){
            this.#chart.data.datasets.splice(0, 1);
        }

        this.#chart.data.datasets.forEach(dataset => {
            const idx = dataset.backgroundColor.indexOf('rgba(222,222,222,0.15)');

            const idleUse = this.#config.getConfig().options.idle.use;
            let checkValue = false;
            let idle = this.#config.getConfig().options.idle.max;
            if(idleUse){
                dataset.data.forEach( d => {
                    idle -= d;
                })
            }else{
                dataset.data.forEach((d, idx) => {
                    if(dataset.backgroundColor[idx] === 'rgba(222,222,222,0.15)') 
                    return true;

                    if(d > 0){
                        checkValue = true;
                        return false;
                    }
                })
            }

            if (!checkValue) {
                if(idx === -1){
                    dataset.backgroundColor.push('rgba(222,222,222,0.15)');
                    dataset.borderColor.push('rgba(222,222,222,0.6)');
                    dataset.data[dataset.backgroundColor.length-1] = (idleUse?idle:1);
                }else{
                    dataset.data[idx] = (idleUse?idle:1);
                }
            }else if(idx !== -1){
                dataset.backgroundColor.splice(idx, 1);
                dataset.borderColor.splice(idx, 1);
                dataset.data.splice(idx, 1);
            }
        })

        //console.log(util.object.cloneDeep(this.#chart.data.datasets))
    }

    update(renewal, updateTime){
        if(!util.isBoolean(renewal)) renewal = true;

        if(['pie', 'doughnut'].indexOf(this.#config.getConfig().chartType) > -1)
            this.#circleChartBeforeUpdate();

        if(updateTime && this.#config.getConfig().xAxis.type != 'category'){
            let test = moment(util.date.toLocalAtUTC(updateTime).getTime());
            this.#makeTimeLabel(util.object.cloneDeep(test));
        }

        if(renewal){
            this.#chart.update();
        }else
            this.#chart.render();
        
        if(this.#chart.loadingbar.isBlock){
            this.#chart.loadingbar.hide()
        }
    }

    addCategory(categoryInfo){
        if(this.#config.getConfig().xAxis.type !== 'category'
        || ['pie', 'doughnut'].indexOf(this.#config.getConfig().chartType) > -1){
            console.log("this chart not use addCategory");
            return false;
        }

        if(Array.isArray(categoryInfo)){
            categoryInfo.forEach(p=>this.addCategory(p));
            return;
        }

        if(!this.#chart.data.labels) this.#chart.data.labels = [];
        const idx = this.#chart.viewCtgIdList.indexOf(categoryInfo.x);

        if(idx !== -1){
            console.log(`x[${categoryInfo.x}] is exists`);
            return false;
        }
        this.#chart.viewCtgIdList.push(categoryInfo.x);
        this.#chart.data.labels.push(categoryInfo.name);

        if(this.#chart.ctgData){
            this.#chart.oriCtgIdList.push(categoryInfo.x);
            this.#chart.ctgData.labels.push(categoryInfo.name)
            this.#chart.ctgVisibled.push(true)
        }
    }

    removeCategory(xId){
        if(this.#config.getConfig().xAxis.type !== 'category'
        || ['pie', 'doughnut'].indexOf(this.#config.getConfig().chartType) > -1){
            console.log("this chart not use removeCategory");
            return false;
        }

        //hide 이후 remove하는 경우 this.#categoryIdList에는 id가 없음. 원본데이터 먼저 확인 필요.
        //파이랑 도넛은 시리즈로 관리되기때문에 여기로 안옴. show, hide만 동일로직이라 넘어옴.
        if(this.#chart.ctgData){
            const ctgDataIdx = this.#chart.oriCtgIdList.indexOf(xId);
            if(ctgDataIdx === -1){
                console.log(`${xId} is not exist`);
                return false;
            }

            this.#chart.oriCtgIdList.splice(ctgDataIdx, 1);
            this.#chart.data.labels.splice(ctgDataIdx, 1);
            this.#chart.ctgData.datasets.forEach(datasets => {
                if(datasets.data.length > ctgDataIdx) datasets.data.splice(ctgDataIdx, 1);
            })
        }

        const idx = this.#chart.viewCtgIdList.indexOf(xId);
        
        this.#chart.viewCtgIdList.splice(idx, 1);
        this.#chart.data.labels.splice(idx, 1);
        this.#chart.data.datasets.forEach(datasets => {
            if(datasets.data.length > idx) datasets.data.splice(idx, 1);
        })
    }

    hideCategory(categoryId){
        //show, hide 내용이 처음과 달라져서 나중에 함수 분리 필요함.
        if(this.#config.getConfig().xAxis.type !== "category"){
            console.log("time chart not use");
            return false;
        }

        let idx;

        if(util.isNumber(categoryId)) idx = categoryId;
        else idx = this.#chart.viewCtgIdList.indexOf(categoryId);

        if(idx === -1){
            console.log(`${categoryId} is not exists`);
            return false;
        }

        if(this.#chart.ctgData){
            //도넛, 파이를 제외한 category 유형차트.
            this.#chart.data.labels.splice(idx, 1);
            this.#chart.data.datasets.forEach(dataset => {
                if(dataset.data.length > idx) dataset.data.splice(idx, 1);                
            })
            
            this.#chart.viewCtgIdList.splice(idx, 1);
            this.#chart.ctgVisibled[idx] = false;
            //this.#chart.changeCtgVisibled = true; //show 할때만 원본데이터가 필요.
        }else{
            if(this.#chart.getDataVisibility(idx)){
                this.#chart.toggleDataVisibility(idx);
                //this.#chart.data.labels.splice(idx, 1)
            }
        }

        this.update(true);
    }

    showCategory(categoryId){
        if(this.#config.getConfig().xAxis.type !== "category"){
            console.log("time chart not use");
            return false;
        }

        if(this.#chart.ctgData){
            let idx;
            if(util.isNumber('number')) idx = categoryId;
            else idx = this.#chart.oriCtgIdList.indexOf(categoryId);

            if(idx === -1){
                console.log(`${categoryId} is not exists`);
                return false;
            }

            this.#chart.ctgVisibled[idx] = true;
            this.#chart.changeCtgVisibled = true;
        }else{
            //도넛, 파이의 경우 series에서 index를 미리 찾아서 여기로 넘어옴.
            let idx;
            if(util.isNumber('number')) idx = categoryId;
            else idx = this.#chart.viewCtgIdList.indexOf(categoryId);

            if(idx === -1){
                console.log(`${categoryId} is not exists`);
                return false;
            }

            if(!this.#chart.getDataVisibility(idx))
                this.#chart.toggleDataVisibility(idx);
        }

        this.update(true);
    }

    isCategoryVisibled = (categoryId) => {
        if(this.#config.getConfig().xAxis.type !== "category"){
            console.log("time chart not use");
            return false;
        }

        const categoryVisibledObj = this.getCategoryVisibled();
        return (categoryVisibledObj[categoryId]?true:false);
    }

    getCategoryVisibled = () => {
        let result = {};

        if(!this.#chart.viewCtgIdList){
            console.log("this chart not use category");
            return result;
        }

        /*
        if(this.#chart.viewCtgIdList){
            this.#chart.ctgIdList.forEach( (category, idx) => {
                result[category] = (this.#chart.ctgVisibled[idx]);
            })
        }else{
        */
        
        this.#chart.viewCtgIdList.forEach( (category, idx) => {
            result[category] = (this.#chart.getDataVisibility(idx));
        })

        return result;
    }

    setAllCategoryVisibled(visibled) {
        const categoryVisibledObj = this.getCategoryVisibled();
        for(var category in categoryVisibledObj){
            if(categoryVisibledObj[category] !== visibled){
                if(visibled) this.showCategory(category);
                else this.hideCategory(category);
            }
        }
    }

    setColorChip(colorChip){
        this.#colorChip = util.object.cloneDeep(colorChip);
        this.#colorIdx = 0;

        if(['pie','doughnut'].indexOf(this.#config.getConfig().chartType)> -1){
            let color = [];
            for(var i=0;i<this.#chart.data.labels.length;i++)
                color.push(this.#getColorChip());
                this.#chart.data.datasets.forEach(dataset => {
                    dataset.borderColor = util.object.cloneDeep(color);
                    dataset.backgroundColor = util.object.cloneDeep(color);
                });
        }else{
            this.#chart.data.datasets.forEach(dataset => {
                const color = this.#getColorChip();
                dataset.borderColor = [color]
                dataset.backgroundColor = [color]
            })
        }
    }

    #makePreviewChart(){
        let ctgCount = 10;
        let seriesIdx = 0;
        let seriesIdList = [];

        const addSeriesList = function(len, y2){
            while(len--){
                let seriesInfo = { id : 'series'+seriesIdx, name : 'series'+seriesIdx }
                if(y2){ seriesInfo.yAxisID = 'y1'}
                seriesIdList.push(seriesInfo)
                seriesIdx++;
            }
        }

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1 && this.#config.getConfig().options.grouped){
            this.addGroup({ id : 'grp1', name : 'grp1' });
        }

        addSeriesList(['bar'].indexOf(this.#config.getConfig().chartType) > -1 ? 1 : 3);
        if(this.#config.getConfig().yAxis2.use === constant.BOOLEAN_TRUE){
            addSeriesList(3, true);
        }
        this.addSeries({ series : seriesIdList });
       
        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            let randomData = [];
            for(var i=0;i<3;i++){
                randomData.push(10+parseInt(Math.random()*10));
            }

            this.addPoint({id:'grp1', value:randomData});
        }else{
            if(['bar'].indexOf(this.#config.getConfig().chartType) > -1) ctgCount = 3;

            if(this.#config.getConfig().xAxis.type === 'category'){
                for(var j=0;j<ctgCount;j++)
                    this.addCategory({x:'fo'+(j+1), name:'fo'+(j+1)});
            
                seriesIdList.forEach(series=>{
                    let randomData = [];
                    for(var j=0;j<ctgCount;j++){
                        randomData.push({x:'fo'+(j+1), y:5+parseInt(Math.random()*10)});
                    }
                    this.addPoint({id:series.id, value:randomData})
                })
            }else if(this.#config.getConfig().xAxis.type === 'time'){
                let minTime = this.#config.getConfig().xAxis.startTime.getTime();
                seriesIdList.forEach(series=>{
                    let randomData = [];
                    for(var j=0;j<60;j++){
                        randomData.push({x:(minTime-j*1000*10), y:5+parseInt(Math.random()*10)});
                    }
                    this.addPoint({id:series.id, value:randomData})
                })
            }else{
                // this.#config.getConfig().xAxis.type -> day
                let minTime = this.#chart.options.scales.x.min.getTime();
                seriesIdList.forEach(series=>{
                    let randomData = [];
                    for(var j=0;j<24;j++){
                        randomData.push({x:(minTime+j*1000*60*60), y:5+parseInt(Math.random()*10)});
                        console.log(moment(minTime+j*1000*60*60))
                    }
                    this.addPoint({id:series.id, value:randomData})
                })
            }
        }

        this.update(true);
    }
}


//pion.chart.js에 선언되어 있어야만 정상적으로 작동.
//일단 거기서 pion.chartjs.js로 보내는 것이라 당연함.
//이런 방식으로 하면 일단 다중상속처럼 series랑 category 구현은 가능함.
//series와 category의 기본함수 형태는 pion.chart.js처럼 pion.chartjs.js에 동일하게 작성?
/*
let mixinTest = {
    setColorChip(){
        console.log("mixin colorchip", this.getCategoryVisibled());
    },
    test(){
        console.log("test");
    }
}

Object.assign(ChartJs.prototype, mixinTest);
*/

export default ChartJs;