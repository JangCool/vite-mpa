import util from '../../../utils/util';
import BaseChart from './base/base.chart';
import { BaseChartjsEvent } from './base/base.chartjs.events';
//import constant from '../../../assets/js/constant/constant';
import 'chartjs-adapter-luxon';
import ChartStreaming from 'chartjs-plugin-streaming';

import { Chart, registerables, ScatterController, BarController } from 'chart.js';
Chart.register(...registerables);
Chart.register(ChartStreaming);

//import ChartDataLabels from 'chartjs-plugin-datalabels';
//Chart.register(ChartDataLabels);

import { registChartType } from './extends/pion.chartjs.extends.js'

registChartType(Chart, {ScatterController:ScatterController, BarController:BarController});

class ChartJs extends BaseChart {
    #chart;
    #config;

    #colorChip;
    #colorIdx;

    #default = {
        groupId : 'defaultGroupId',
        backgroundColor : 'rgba(222,222,222,0.15)',
        borderColor : 'rgba(222,222,222,0.6)',
        dataIdx : 100
    };

    constructor(config){
        super(); 
        this.#config = config;
        
        this.#colorChip = [
            { name:'red', color:'ff6384', trans:1}, 
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
                BaseChartjsEvent.beforeUpdate(chart, config.getConfig());
            },
            afterUpdate: function(chart){
                BaseChartjsEvent.afterUpdate(chart, config.getConfig());
            }
        }]
            
        chartjsConfig.options.events = ['mousedown', 'mouseup', 'mousemove', 'mouseout'];
        if(['pie', 'doughnut'].indexOf(chartjsConfig.type) > -1){
            let defaultDataset = {
                label : 'default',
                data : [],
                backgroundColor : [],
                borderColor : []
            }
            defaultDataset.data[this.#default.dataIdx] = 1;
            defaultDataset.backgroundColor[this.#default.dataIdx] = this.#default.backgroundColor;
            defaultDataset.borderColor[this.#default.dataIdx] = this.#default.borderColor;

            chartjsConfig.data = {
                datasets:[defaultDataset]
            }
        }

       
        this.#chart = new Chart(chartCanvas, chartjsConfig);

        this.#chart.tooltip.formatter = config.getConfig().tooltip.formatter

        //category 타입의 차트는 원본 데이터를 가지고 있고 show, hide호출 시 isChanged 기준으로 beforeUpdate에서 chart.data를 재구성함.
        this.#chart.pion = {
            group : {
                idList : [],
                nameList : []
            },
            series : {
                idList : [],
                nameList : []
            },
            category : {
                idList : [], //idList에 맵핑되는건 labels. 
                oriIdList : [], //hide의 경우 idList에서 지워줘야 맞는 index를 구할수있음. ori는 visible관계없는 원본데이터
                oriNameList : [], //oriNameList에 맵핑되는건 oriIdList. ori는 visible관계없는 원본데이터.
                visibled : [],
                isChanged : false
            },
            datasets : [],
        }
/*
        default로 잡혀있는 그룹 사용한다. event에서 grouped이 false인경우는 예외처리
        if(!config.getConfig().options.expand.circle.grouped){
            this.addGroup({
                id : this.#default.groupId
            })
        }
*/

        if(config.getConfig().preview){
            this.#makePreviewChart(chartCanvas, chartjsConfig);
            return;
        }

        if(config.getConfig().series)
            this.addSeries(config.getConfig().series);

        if(config.getConfig().category)
            this.addCategory(config.getConfig().category);
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
        return time;
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

    #setTimeChartConfig = function(chartjsConfig, config){
        let delay = config.xAxis.timeInfo.delay;

        chartjsConfig.options.scales.x = {
            type : 'realtime',
            time: {
                parser: 'MM/DD/YYYY HH:mm:ss',
                tooltipFormat: 'HH:mm:ss',
                displayFormats: {
                    millisecond: 'HH:mm:ss.SSS',
                    second: 'ss',
                    minute: 'HH:mm',
                    hour: 'HH'
                },
                unit: config.xAxis.timeInfo.unit,
                stepSize: config.xAxis.timeInfo.stepSize,
            },
            realtime:{
                duration: this.#getTimeGap(config.xAxis.timeInfo.unit)*config.xAxis.timeInfo.len,
                frameRate : config.xAxis.timeInfo.frameRate,
                delay : delay
            },
            grid :{
                display: false
            },
            ticks: {
                autoSkip: false,
                major:{
                    enabled:true
                }
            },
        };
    }

    #set2DChartConfig = function(chartjsConfig, config){
        chartjsConfig.options.scales.y = {
            ticks: {
                maxTicksLimit: config.yAxis.maxTicksLimit,
                includeBounds : false
            },
            bounds: 'ticks'
        };
        if(config.yAxis.position) chartjsConfig.options.scales.y.position = config.yAxis.position;
        if(util.isNumber(config.yAxis.min)) chartjsConfig.options.scales.y.min = config.yAxis.min;
        if(util.isNumber(config.yAxis.max) && !config.preview) chartjsConfig.options.scales.y.max = config.yAxis.max;
        if(util.isNumber(config.yAxis.suggestedMin) && !config.preview) chartjsConfig.options.scales.y.suggestedMin = config.yAxis.suggestedMin;
        if(util.isNumber(config.yAxis.suggestedMax) && !config.preview) chartjsConfig.options.scales.y.suggestedMax = config.yAxis.suggestedMax;
        

        if(config.yAxis1.use){
            chartjsConfig.options.scales.y1 = {};
            chartjsConfig.options.scales.y1.min = config.yAxis1.min;
            chartjsConfig.options.scales.y1.max = config.yAxis1.max;
            chartjsConfig.options.scales.y1.suggestedMin = config.yAxis1.suggestedMin;
            chartjsConfig.options.scales.y1.suggestedMax = config.yAxis1.suggestedMax;
            chartjsConfig.options.scales.y1.position = config.yAxis1.position;
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

        chartjsConfig.options.interaction = {
            mode: 'index', //커서의 x축 기준으로 hover
            intersect: false
        }

        if(['bar', 'barScatter'].indexOf(config.chartType) > -1){
            if(!chartjsConfig.options.scales.x) chartjsConfig.options.scales.x = {};
            chartjsConfig.options.scales.x.stacked = config.options.expand.bar.stacked;

            if(!chartjsConfig.options.scales.y) chartjsConfig.options.scales.y = {};
            chartjsConfig.options.scales.y.stacked = config.options.expand.bar.stacked;
        }
    }

    //#makeHtmlTooltips = (context) => { // scope달라져서 필요한 테이터 접근못함.
    #makeHtmlTooltips = function(context) {
        // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');

        // 툴팁 전체 div
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.style.backgroundColor = "rgba(0,0,0,0.7)"
            tooltipEl.style.width = "200px"
            tooltipEl.style.borderRadius = "10px"
            tooltipEl.style.padding = "10px"
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            document.body.appendChild(tooltipEl);
        }

        var tooltipModel = context.tooltip;

        // 원형차트는 데이터 있는지 없는지 직접 검증해야됨
        // default데이터의 idx는 100고정
        let visible = false;
        if(Array.isArray(this.dataPoints)){
            this.dataPoints.forEach(p =>{
                if(['pie', 'doughnut'].indexOf(p.chart.config.type) == -1){
                    visible = true;
                    return true;
                }

                //pion.chartjs2.js => #default.dataIdx
                if(p.dataIndex != 100) visible = true;
            })
        }
        if(!visible){
            tooltipEl.style.opacity = 0;
            return;
        }

        // 툴팁 숨김
        
        if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
            return bodyItem.lines;
        }

        // 내용물
        if (tooltipModel.body) {
            var titleLines = tooltipModel.title || [];
            var bodyLines = tooltipModel.body.map(getBody);

            var innerHtml = '<thead>';

            let textStyle = "style='";
            textStyle += "color:white;";
            textStyle += "'";

            titleLines.forEach(function(title) {
                innerHtml += `<tr><td ${textStyle}>` + title + '</th></tr>';
            });

            
            innerHtml += '</thead><tbody>';

            const formatter = this.formatter; //사용자정의 format(y축 value값)
            bodyLines.forEach(function(body, i) {
                if(body == ": 1") return true; ///circle차트 기본데이터

                const id = "tooltip"+context.id+"_"+i;
                //gradation의 경우 canvas에서 사용하는 형태로 인식못함. 방법 찾아야됨.
                //var colors = tooltipModel.labelColors[i];
                //var style = 'background:' + colors.backgroundColor;
                //style += '; border-color:' + colors.borderColor;
                var style = 'border-width: 2px';
                style += '; margin-right: 5px';
                style += '; float: left';
                var span = '<canvas width="13" height="13" id="' + id + '" style="' + style + '"></canvas>';

                let view = body[0].split(":")[0] + " : " + formatter(parseInt(body[0].split(":")[1]));

                
                innerHtml += `<tr><td ${textStyle}>` + span + view + '</td></tr>';
            });
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;

            bodyLines.forEach(function(body, i) {
                if(body == ": 1") return true; ///circle차트 기본데이터

                const id = "tooltip"+context.id+"_"+i;
                var colors = tooltipModel.labelColors[i]; // colors.backgroundColor, colors.borderColor;
                
                const tooltipCanvas = document.getElementById(id);
                const ctx = tooltipCanvas.getContext('2d');
                ctx.fillStyle = colors.backgroundColor;
                ctx.fillRect(0, 0, 15, 15);
            });
        }

        var position = context.chart.canvas.getBoundingClientRect();

        // 툴팁 position
        tooltipEl.style.opacity = 1;
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
        tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
        tooltipEl.style.pointerEvents = 'none';
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
                    },
                    tooltip: {
                        // Disable the on-canvas tooltip
                        enabled: false,
                        external: this.#makeHtmlTooltips,
                    }
                }
            }
        };

        if(config.xAxis.type === 'time')
            this.#setTimeChartConfig(chartjsConfig, config);

        if(['doughnut', 'pie'].indexOf(config.chartType) === -1)
            this.#set2DChartConfig(chartjsConfig, config);

        return chartjsConfig;
    }

    addGroup(groupInfo){
        if(Array.isArray(groupInfo)){
            groupInfo.forEach(g => this.addGroup(g));
            return;
        }

        if(!this.#config.getConfig().options.expand.circle.grouped && this.#chart.pion.group.idList.length > 0){
            console.log(`grouped options is false`);
            return;
        }

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) == -1){
            console.log(`${this.#config.getConfig().chartType} is not supported group`);
            return;
        }

        if(this.#chart.pion.group.idList.indexOf(groupInfo.id) > -1){
            console.log(`${groupInfo.id} is exists`);
            return false;
        }

        this.#chart.data.datasets.push({
            label : groupInfo.name,
            borderColor : [],
            backgroundColor : [],
            data : []
        })

        this.#chart.pion.group.idList.push(groupInfo.id);
        this.#chart.pion.group.nameList.push(groupInfo.name);

        const idx = this.#chart.data.datasets.length - 1;
        if(idx > 0){
            //기존 그룹이 있으면 이전의 색상표를 그대로 복사해온다.
            this.#chart.data.datasets[idx].borderColor = util.object.cloneDeep(this.#chart.data.datasets[idx-1].borderColor);
            this.#chart.data.datasets[idx].backgroundColor = util.object.cloneDeep(this.#chart.data.datasets[idx-1].backgroundColor);
        }
    }

    /**
     * Series를 추가한다.
     * borderColor와 backgroundColor를 둘다 넣어주지 않으면 colorChip을 순차적으로 적용하고, 둘중하나만 있으면 해당 색상으로 둘다 적용
     * 
     * {
     *      seriesId : 'string'
     *      label : 'string'
     *      borderColor : 'string'
     *      backgroundColor : 'string'
     * }
     */

    #getDefaultDataset = (name, style) => {
        const isTimeChart = this.#config.getConfig().xAxis.type == "time";
        return {
            label : name,
            data : [],
            borderColor : (isTimeChart?style.borderColor:[style.borderColor]),
            backgroundColor : (isTimeChart?style.borderColor:[style.backgroundColor]),
            //yAxisID : (series.yAxisID?series.yAxisID:'y'),
            fill:this.#config.getConfig().style.fill.use,
            borderRadius: style.borderRadius,
            borderWidth : style.borderWidth,
            pointRadius : style.pointRadius,
            hoverRadius : style.hoverRadius,
            tension: style.tension
        };
    }

    #getSeriesStyle = (style) => {
        let seriesStyle = util.object.cloneDeep(this.#config.getConfig().style);
        if(style)
            seriesStyle = util.object.merge(style, seriesStyle);
        
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

        return seriesStyle;
    }

    addSeries = (seriesInfo) => {
        let seriesArray = util.object.cloneDeep(seriesInfo);
        if(!Array.isArray(seriesArray)) seriesArray = [seriesArray];

        let seriesData = this.#chart.pion.series;
        
        seriesArray.forEach(series=>{
            const id = series.id;
            const name = (series.name?series.name:series.id);

            let idx = seriesData.idList.indexOf(id);
            if(idx > -1){
                console.log(`seriesId[${id}] is exists`);
                return true;
            }
            seriesData.idList.push(id);
            seriesData.nameList.push(name);
            idx = seriesData.idList.indexOf(id);

            let seriesStyle = this.#getSeriesStyle(series.style);

            if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
                //labels가 전부 공통이기 때문에 group별로 series를 넣어줄 필요가 없음.
                this.#chart.data.labels[idx] = name;
    
                this.#chart.data.datasets.forEach(dataset=>{
                    dataset.borderColor[idx] = seriesStyle.borderColor;
                    dataset.backgroundColor[idx] = seriesStyle.backgroundColor;
                })

                //2차원 아닌데 필요한가? 나중에 show, hide하면서 불필요하면 제거.
                this.#chart.pion.datasets.forEach(dataset=>{
                    dataset.borderColor[idx] = seriesStyle.borderColor;
                    dataset.backgroundColor[idx] = seriesStyle.backgroundColor; 
                })
                
            }else if(['line', 'bar', 'barScatter'].indexOf(this.#config.getConfig().chartType) > -1){
                let newDataset = this.#getDefaultDataset(name, seriesStyle);
                if(series.yAxisID && series.yAxisID != '') newDataset.yAxisID = series.yAxisID;

                this.#chart.pion.datasets[idx] = util.object.cloneDeep(newDataset);
                this.#chart.data.datasets[idx] = util.object.cloneDeep(newDataset);
            }

            if(series.data){
                this.addPoint({
                    id : series.id,
                    data : series.data
                })
            }
        });

        //chartjs-plugin-streaming 타기전에 chartjs에서 update가 이뤄져야 datasets에 필요한 정보를 넣어줘서 에러가 안남.
        if(this.#config.getConfig().xAxis.type == 'time') this.update();
    }

    #realAddPointUseSeries = function(datasetsIdx, point){
        if(this.#config.getConfig().xAxis.type === 'category'){
            if(typeof point === 'object'){
                const categoryData = this.#chart.pion.category;
                let dataIdx = categoryData.idList.indexOf(point.x);

                if(dataIdx === -1){
                    if(categoryData.oriIdList.includes(point.x)){
                        //hide여서 idList에선 지워지고 oriIdList에만 남아있는 경우. 
                        let oriDataIdx = this.#chart.pion.category.oriIdList.indexOf(point.x);
                        this.#chart.pion.datasets[datasetsIdx].data[oriDataIdx] = point.y;
                        return;
                    }
                    
                    if(!this.#config.getConfig().options.automode){
                        console.log(`categoryId[${point.x}] is not exists`);
                        return;
                    }
                    this.addCategory({
                        id : point.x,
                        name : point.x
                    })
                    dataIdx = categoryData.idList.indexOf(point.x);
                }
                this.#chart.data.datasets[datasetsIdx].data[dataIdx] = point.y;

                //category를 숨기는 기능이 없기 때문에 별도로 데이터를 지니고 있는다.
                let oriDataIdx = categoryData.oriIdList.indexOf(point.x);
                this.#chart.pion.datasets[datasetsIdx].data[oriDataIdx] = point.y;
            }else{
                this.#chart.data.datasets[datasetsIdx].data.push(point);
                this.#chart.pion.datasets[datasetsIdx].data.push(point);
            }
        }else if(this.#config.getConfig().xAxis.type === 'time'){
            if(typeof point !== typeof {}){
                console.log("timeChart -> invalid point info");
                return;
            }

            this.#chart.data.datasets[datasetsIdx].data.push({
                x : this.#config.getConfig().xAxis.timeInfo.utc ? util.date.toLocalAtUTC(point.x) : new Date(point.x),
                y : point.y
            });
/*
            잉여 데이터 관리를 streaming 라이브러리에서 해주기 때문에 넣으면 안됨.
            time은 복사본이 필요하지 않은데 추후 필요한 경우 주석 살리고 제거해주는 로직 필요함.

            this.#chart.pion.datasets[datasetsIdx].data.push({
                x : util.date.toLocalAtUTC(point.x),
                y : point.y
            });
*/
        }
    }
    #addPointUseSeries = function(pointInfo){
        if(!pointInfo){
            console.log('invalid pointInfo');
            return false;
        }
        
        let idx = this.#chart.pion.series.idList.indexOf(pointInfo.id);

        if(idx === -1){
            if(!this.#config.getConfig().options.automode){
                console.log(`seriesId[${pointInfo.id}] is not exists`);
                return true;
            }
            this.addSeries({
                id : pointInfo.id,
                yAxisID : pointInfo.yAxisID
            })
            idx = this.#chart.pion.series.idList.indexOf(pointInfo.id);
        }

        if(Array.isArray(pointInfo.data)){
            pointInfo.data.forEach(p => this.#realAddPointUseSeries(idx, p));
        }else{
            this.#realAddPointUseSeries(idx, pointInfo.data);
        }
    }


    /*
    pointInfo = {
        groupId : string(groupId),
        id : string(seriesId),
        data : value -> 만약 value가 array로 들어오면 id(seriesId)안봄.
    }
    */
    #addPointUseGroup = function(pointInfo){
        if(!pointInfo){
            console.log('invalid pointInfo');
            return false;
        }
        if(Array.isArray(pointInfo)){
            pointInfo.forEach(p => this.#addPointUseGroup(p))
            return true;
        }

        let groupIdx = this.#chart.pion.group.idList.indexOf(pointInfo.groupId);
        if(!this.#config.getConfig().options.expand.circle.grouped) groupIdx = 0;//그룹 미사용이면 무조건 처음에 셋팅된 0번째 그룹

        if(groupIdx === -1){
            console.log(`groupId[${pointInfo.id}] is not exists`);
            return false;
        }

        if(Array.isArray(pointInfo.data)){
            //array로 넘어오는 경우는 해당 group에 데이터를 덮어씀.
            pointInfo.data.forEach( (d, idx) => this.#chart.data.datasets[groupIdx].data[idx] = d );
        }else{
            let seriesIdx = this.#chart.pion.series.idList.indexOf(pointInfo.id);
            if(seriesIdx === -1){
                if(!this.#config.getConfig().options.automode){
                    console.log(`seriesId[${pointInfo.id}] is not exists`);
                    return false;
                }

                this.addSeries({
                    id : pointInfo.id
                })
                seriesIdx = this.#chart.pion.series.idList.indexOf(pointInfo.id);
            }

            this.#chart.data.datasets[groupIdx].data[seriesIdx] = pointInfo.data;
        }
    }


    /*
    categoryInfo = {
        id : string
        name : string
    }
    */
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

        const idx = this.#chart.pion.category.oriIdList.indexOf(categoryInfo.id);

        if(idx !== -1){
            console.log(`x[${categoryInfo.id}] is exists`);
            return false;
        }
        
        this.#chart.data.labels.push(categoryInfo.name);

        this.#chart.pion.category.idList.push(categoryInfo.id);
        this.#chart.pion.category.oriIdList.push(categoryInfo.id);
        this.#chart.pion.category.oriNameList.push(categoryInfo.name);
        this.#chart.pion.category.visibled.push(true);
        
        //this.#chart.pion.category.isChanged = true; //카테고리 추가된건 알아서 자리잡고 들어감. update전에 데이터 동기화 안시켜도 상관없음.

        this.update();
    }

    /**
     * -----------------------points-----------------------
     * ['doughnut', 'pie'] => groupId 필수(옵션으로 단일 그룹 주는 경우 불필요.)
     *  groupId 필수. id 선택.
     *  pointInfo = {
     *      groupId : 'groupId'
     *      id : 'seriesId'
     *      data : [ 1,2,3,4... ] -> id 관계없이 해당 그룹에 순서대로 넣어준다.
     *              or 
     *      data : 3 -> id가 필수
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
            this.#addPointUseGroup(pointInfo);
        }else if(['line', 'bar', 'barScatter'].indexOf(this.#config.getConfig().chartType) > -1){
            if(Array.isArray(pointInfo)){ //clear true주고서 bar차트 제대로 나오는지 확인 필요함.
                pointInfo.forEach(p => this.addPoint(p, {update:false}));
            }else{
                this.#addPointUseSeries(pointInfo, debug);
            }
        }

        if(options && options.update) this.update();
        if(options && options.render) this.update(false);
    }

    update(renewal){
        if(this.#config.getConfig().xAxis.timeInfo.pause) this.#chart.options.scales.x.realtime.pause = false;

        if(!util.isBoolean(renewal)) renewal = true;

        if(renewal)
            this.#chart.update();
        else
            this.#chart.render();

        if(this.#config.getConfig().xAxis.timeInfo.pause) this.#chart.options.scales.x.realtime.pause = true;
    }

    getSeriesVisibled(){
        var result = {};

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            this.#chart.pion.series.idList.forEach((seriesId, idx)=>{
                result[seriesId] = this.#chart.getDataVisibility(idx);
            })
        }else{
            if(!Array.isArray(this.#chart.data.datasets)) return result;

            this.#chart.data.datasets.forEach((dataset, idx)=>{
                if(!util.isBoolean(dataset.hidden)) dataset.hidden = false;
                result[this.#chart.pion.series.idList[idx]] = !dataset.hidden;
            })
        }

        return result;
    }
    
    isSeriesVisibled = (seriesId) => {
        const seriesVisibleArr = this.getSeriesVisibled();
        return (seriesVisibleArr[seriesId]?true:false);
    }

    showSeries(seriesId){
        const seriesIdx = this.#chart.pion.series.idList.indexOf(seriesId);
        if(seriesIdx === -1){
            console.log(`${seriesId} is not exists`);
            return false;
        }

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            if(!this.#chart.getDataVisibility(seriesIdx))
                this.#chart.toggleDataVisibility(seriesIdx);
        }else{
            this.#chart.ctgData.datasets[seriesIdx].hidden = false;
            this.#chart.data.datasets[seriesIdx].hidden = false;
        }

        this.update(true);
    }

    hideSeries(seriesId){
        const seriesIdx = this.#chart.pion.series.idList.indexOf(seriesId);
        if(seriesIdx === -1){
            console.log(`${seriesId} is not exists`);
            return false;
        }

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            if(this.#chart.getDataVisibility(seriesIdx))
                this.#chart.toggleDataVisibility(seriesIdx);
        }else{
            this.#chart.pion.datasets[seriesIdx].hidden = true;
            this.#chart.data.datasets[seriesIdx].hidden = true;
        }

        this.update(true);
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

    showCategory(categoryId){
        if(this.#config.getConfig().xAxis.type !== "category" || ['pie', 'doughnut'].indexOf(this.#config.getConfig().chartType)>-1){
            console.log("this chart not use category");
            return false;
        }

        let oriIdx = this.#chart.pion.category.oriIdList.indexOf(categoryId);
        if(oriIdx === -1){
            console.log(`${categoryId} is not exists`);
            return false;
        }

        if(this.#chart.pion.category.visibled[oriIdx]) return false; //이미 show된 카테고리

        this.#chart.pion.category.visibled[oriIdx] = true;
        this.#chart.pion.category.isChanged = true;

        this.update(true);
    }

    hideCategory(categoryId){
        if(this.#config.getConfig().xAxis.type !== "category" || ['pie', 'doughnut'].indexOf(this.#config.getConfig().chartType)>-1){
            console.log("this chart not use category");
            return false;
        }

        let oriIdx = this.#chart.pion.category.oriIdList.indexOf(categoryId);
        if(oriIdx === -1){
            console.log(`${categoryId} is not exists`);
            return false;
        }

        if(!this.#chart.pion.category.visibled[oriIdx]) return false; //이미 hide된 카테고리

        this.#chart.pion.category.visibled[oriIdx] = false;
        this.#chart.pion.category.isChanged = true;

        this.update();
    }

    setPlotLine(plotPos){
        this.#chart.plotPos = plotPos;
        this.update(false)
    }

    clear(){
        this.#chart.data.datasets.forEach(dataset => {
            dataset.data = [];
        })
        if(this.#chart.ctgData){
            this.#chart.pion.datasets.forEach(dataset => {
                dataset.data = [];
            })
        }

        this.update();
    }

    #makePreviewChart(){
        let ctgCount = 10;
        let seriesIdList = [];

        const addSeriesList = function(len, y2){
            while(len--){
                let seriesInfo = { id : 'series'+(seriesIdList.length+1), name : 'series'+(seriesIdList.length+1) }
                if(y2){ seriesInfo.yAxisID = 'y1'}
                seriesIdList.push(seriesInfo)
            }
        }

        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1 && this.#config.getConfig().options.expand.circle.grouped){
            this.addGroup({ id : 'grp1', name : 'grp1' });
        }

        addSeriesList(['bar'].indexOf(this.#config.getConfig().chartType) > -1 ? 1 : 3);
        if(this.#config.getConfig().yAxis1.use){
            addSeriesList(3, true);
        }
        this.addSeries(seriesIdList);
       
        if(['doughnut', 'pie'].indexOf(this.#config.getConfig().chartType) > -1){
            let randomData = [];
            for(var i=0;i<3;i++){
                randomData.push(10+parseInt(Math.random()*10));
            }

            this.addPoint({id:'grp1', data:randomData}, {update:false});
        }else{
            if(['bar'].indexOf(this.#config.getConfig().chartType) > -1) ctgCount = 3;

            if(this.#config.getConfig().xAxis.type === 'category'){
                for(var j=0;j<ctgCount;j++)
                    this.addCategory({id:'fo'+(j+1), name:'fo'+(j+1)});
            
                seriesIdList.forEach(series=>{
                    let randomData = [];
                    for(var j=0;j<ctgCount;j++){
                        randomData.push({x:'fo'+(j+1), y:5+parseInt(Math.random()*10)});
                    }
                    this.addPoint({id:series.id, data:randomData}, {update:false})
                })
            }else if(this.#config.getConfig().xAxis.type === 'time'){
                let minTime = new Date().getTime();
                seriesIdList.forEach(series=>{
                    let randomData = [];
                    for(var j=0;j<60;j++){
                        randomData.push({x:(minTime-j*1000*10), y:5+parseInt(Math.random()*10)});
                    }
                    this.addPoint({id:series.id, data:randomData}, {update:false})
                })
            }else{
                // this.#config.getConfig().xAxis.type -> day
                let minTime = this.#chart.options.scales.x.min.getTime();
                seriesIdList.forEach(series=>{
                    let randomData = [];
                    for(var j=0;j<24;j++){
                        randomData.push({x:(minTime+j*1000*60*60), y:5+parseInt(Math.random()*10)});
                    }
                    this.addPoint({id:series.id, data:randomData}, {update:false})
                })
            }
        }

        this.update();
        this.#chart.options.scales.x.realtime.pause = true;
    }
}

export default ChartJs;