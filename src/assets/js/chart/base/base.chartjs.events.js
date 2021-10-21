/**
 * chartjs 기본 이벤트
 */
import util from '@/utils/util';
import { blockUi } from '@/composables/use.common';

function drawPlotLine(chart, config){
    if(config.xAxis.type === 'time'){
        if(typeof chart.plotPos !== 'number') return;

        var cnavasId = chart.canvas.getAttribute('id');

        const minTime = chart.scales.x.min;
        const maxTime = chart.scales.x.max;
        const plotTime = chart.plotPos;

        const timeLen =  maxTime - minTime;
        const timePlot = plotTime - minTime;

        let plotDiv = document.querySelector("#"+cnavasId).parentNode.querySelector(".plot");
        if(plotDiv !== null) plotDiv.remove();

        if(timePlot <= 0) return;

        plotDiv = document.createElement('div');
        plotDiv.className = 'plot';
        plotDiv.style.zIndex = '1';
        plotDiv.style.position = 'absolute';
        plotDiv.style.borderLeft = '1px solid red';

        plotDiv.style.height = chart.canvas.style.height
        plotDiv.style.top = (chart.canvas.offsetTop + chart.chartArea.top) + 'px'
        plotDiv.style.left = (chart.chartArea.left + chart.canvas.offsetLeft + (timePlot/timeLen)*chart.chartArea.width) + 'px'
        plotDiv.style.width = '1px'
        plotDiv.style.height = chart.chartArea.height + 'px'

        document.querySelector("#"+cnavasId).parentNode.append(plotDiv);
    }
}

//datasets이 100개가 넘지 않는다는 전제로 작성
function setDefaultData(chart, config){
    const chartType = config.chartType;
    if(["pie", "doughnut"].indexOf(chartType) == -1) return;

    //처음에 설정된 defaultdata
    //그룹 미사용인 경우는 자르지말고 default dataset을 그대로 사용한다.
    if(chart.data.datasets[0].label == "default" && config.options.expand.circle.grouped) chart.data.datasets.splice(0, 1); 

    const lastIdx = 100;
    chart.data.datasets.forEach(dataset=>{
        let needDefaultData = true;
        dataset.data.forEach((d, idx)=>{
            if(idx >= chart.data.labels.length) return false; //임시데이터가 1로 측정되서 update연달아 타는경우 판단 제대로 못함
            if(d > 0 && chart.getDataVisibility(idx)) needDefaultData = false;
        })

        if(needDefaultData){
            dataset.data[lastIdx] = 1;
            dataset.backgroundColor[lastIdx] = 'rgba(222,222,222,0.15)';
            dataset.borderColor[lastIdx] = 'rgba(222,222,222,0.6)';
        }else
            dataset.data[lastIdx] = 0;
    })
}

/*
function removeScatterBarData(chart){
    if(!chart.pion) return;

    const length = chart.pion.series.idList.length;
    while(chart.data.datasets.length > length) chart.data.datasets.pop();
}

function addScatterBarData(chart){
    if(!chart.pion) return;

    removeScatterBarData(chart);

    const length = chart.pion.series.idList.length;
    for(let i=0;i<length;i++){
        chart.data.datasets.push({});
        chart.data.datasets[i+length].type = "line";
        chart.data.datasets[i+length].label = "scatter"
        chart.data.datasets[i+length].data = util.object.cloneDeep(chart.data.datasets[i].data)
        chart.data.datasets[i+length].backgroundColor = "black"
        chart.data.datasets[i+length].borderColor = "black"
    }
}
*/


const BaseChartjsEvent = {
    beforeInit: function(chart, config) {
        chart.loadingbar = blockUi({
            id: config.id,
            type: 'in-box',
            pos: 'beforebegin'
        })
        //chart.loadingbar.show();

        if(!util.isEmpty(config.events) && util.isFunction(config.events.beforeInit))
            config.events.beforeInit(chart);
    },
    afterInit: function (chart, config) {
        var id = chart.canvas.getAttribute('id')
        if (config.type === 'hScatter') {
            var canvasScatter = chart.canvas.cloneNode()
            canvasScatter.setAttribute('id', id+'View')
            canvasScatter.style.position = 'absolute'
            canvasScatter.style.top = chart.canvas.offsetTop + 'px'
            canvasScatter.style.left = chart.canvas.offsetLeft + 'px'
            canvasScatter.style.zIndex = 1
            canvasScatter.style.pointerEvents = 'none';
            chart.canvas.after(canvasScatter)

            canvasScatter.width = canvasScatter.offsetWidth
            canvasScatter.height = canvasScatter.offsetHeight
            chart.canvasScatter = canvasScatter
        }
        if (config.dragAble) {
            chart.dragInfo = [false, 0, 0, 0, 0]

            var canvasDrag = chart.canvas.cloneNode()
            canvasDrag.setAttribute('id', id+"Drag")
            canvasDrag.style.position = 'absolute'
            canvasDrag.style.top = chart.canvas.offsetTop + 'px'
            canvasDrag.style.left = chart.canvas.offsetLeft + 'px'
            canvasDrag.style.zIndex = 2
            canvasDrag.style.pointerEvents = 'none';
            chart.canvas.after(canvasDrag)

            canvasDrag.width = canvasDrag.offsetWidth
            canvasDrag.height = canvasDrag.offsetHeight
            chart.canvasDrag = canvasDrag

            chart.renderDrag = () => {
                var ctx = chart.canvasDrag.getContext('2d')
                ctx.clearRect(0, 0, chart.canvasDrag.width, chart.canvasDrag.height)

                if (chart.dragInfo[0]) {
                    var dragInfo = chart.dragInfo
                    var xp = Math.min(dragInfo[1], dragInfo[3])
                    var yp = Math.min(dragInfo[2], dragInfo[4])
                    var xl = Math.max(dragInfo[1], dragInfo[3]) - xp
                    var yl = Math.max(dragInfo[2], dragInfo[4]) - yp
                    if (xp !== -1 && yp !== -1) {
                        ctx.save()
                        ctx.lineWidth = 1
                        ctx.strokeStyle = 'rgba(255, 0, 0, 1)'
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)'
                        ctx.strokeRect(xp, yp, xl, yl)
                        ctx.fillRect(xp + ctx.lineWidth, yp + ctx.lineWidth, xl - ctx.lineWidth * 2, yl - ctx.lineWidth * 2)
                        ctx.restore()
                    }
                }
            }
        }

        chart.canvas.style.zIndex = 900;

        chart.loadingbar.hide()

        if(!util.isEmpty(config.events) && util.isFunction(config.events.afterInit))
            config.events.afterInit(chart);
    },
    beforeEvent: function (chart, event, config) {
        var e = event.event
        var type = e.type

        // replay(True if this event is replayed from Chart.update)
        if (!event.replay && config.dragAble) {
            if (type === 'mousedown') {
                chart.dragInfo = [true, e.x, e.y, -1, -1]
            }
            if (type === 'mouseup') {
                if (chart.dragInfo[0]) {
                    var chartArea = chart.chartArea
                    var minX = Math.min(chart.dragInfo[1], chart.dragInfo[3]) - chartArea.left
                    var maxX = Math.max(chart.dragInfo[1], chart.dragInfo[3]) - chartArea.left
                    var minY = Math.min(chart.dragInfo[2], chart.dragInfo[4]) - chartArea.top
                    var maxY = Math.max(chart.dragInfo[2], chart.dragInfo[4]) - chartArea.top

                    var minXVal, maxXVal
                    if (config.xAxis.type === 'time') {
                        console.log(chart.scales.x);
                        const timeGap = chart.scales.x.max - chart.scales.x.min;
                        minXVal = new Date(chart.scales.x.min + (timeGap * (minX / chartArea.width)))
                        maxXVal = new Date(chart.scales.x.min + (timeGap * (maxX / chartArea.width)))
                    } else {
                        //x축이 labels로 이루어진경우 return값이 애매함.
                        console.log("not support")
                    }
                    var minYVal = chart.scales.y.max - (chart.scales.y.max - chart.scales.y.min) * (maxY / chartArea.height)
                    var maxYVal = chart.scales.y.max - (chart.scales.y.max - chart.scales.y.min) * (minY / chartArea.height)

                    var pos = { minX: minX, minY: minY, maxX: maxX, maxY: maxY }
                    var val = { minXVal: minXVal, minYVal: minYVal, maxXVal: maxXVal, maxYVal: maxYVal }
                    if (!util.isEmpty(config.events) && util.isFunction(config.events.endDrag)) {
                        config.events.endDrag(pos, val)
                    }
                }
                chart.dragInfo = [false, -1, -1, -1, -1]
            }
            if (type === 'mousemove') {
                if (chart.dragInfo[0]) {
                    chart.dragInfo[3] = e.x
                    chart.dragInfo[4] = e.y
                }
            }
            if (type === 'mouseout') {
                chart.dragInfo = [false, -1, -1, -1, -1]
            }

            chart.renderDrag()
        }

        if(!util.isEmpty(config.events) && util.isFunction(config.events.beforeEvent))
            config.events.beforeEvent(chart);

        if (type === 'mouseup')
            this.onClick(e, config);
    },
    resize: function (chart, config) {
        if (!util.isEmpty(chart.canvasDrag)) {
            chart.canvasDrag.style.width = chart.canvas.style.width
            chart.canvasDrag.style.height = chart.canvas.style.height
            chart.canvasDrag.style.top = chart.canvas.offsetTop + 'px'
            chart.canvasDrag.style.left = chart.canvas.offsetLeft + 'px'
            chart.canvasDrag.width = chart.canvasDrag.offsetWidth
            chart.canvasDrag.height = chart.canvasDrag.offsetHeight
        }
        if (!util.isEmpty(chart.canvasScatter)) {
            chart.canvasScatter.style.width = chart.canvas.style.width
            chart.canvasScatter.style.height = chart.canvas.style.height
            chart.canvasScatter.style.top = chart.canvas.offsetTop + 'px'
            chart.canvasScatter.style.left = chart.canvas.offsetLeft + 'px'
            chart.canvasScatter.width = chart.canvasScatter.offsetWidth
            chart.canvasScatter.height = chart.canvasScatter.offsetHeight
        }

        if(!util.isEmpty(config.events) && util.isFunction(config.events.resize))
            config.events.resize(chart);
    },
    beforeDraw: function(chart, config){
        drawPlotLine(chart, config);
        
        if(!util.isEmpty(config.events) && util.isFunction(config.events.beforeDraw))
            config.events.beforeDraw(chart);
    },
    beforeUpdate: function(chart, config){
        if(chart.pion && chart.pion.category.isChanged){
            let ctgInfo = chart.pion.category;
            
            ctgInfo.idList = util.object.cloneDeep(ctgInfo.oriIdList);
            chart.data.labels = util.object.cloneDeep(ctgInfo.oriNameList);
            //chart.data.datasets = util.object.cloneDeep(chart.pion.datasets);
            chart.data.datasets.forEach( (dataset, idx) => {
                dataset.data = util.object.cloneDeep(chart.pion.datasets[idx].data);
            })

            for(let idx=ctgInfo.visibled.length-1;idx>=0;idx--){
                if(!ctgInfo.visibled[idx]){
                    chart.data.datasets.forEach(dataset => {
                        if(dataset.data.length>idx) dataset.data.splice(idx, 1);
                    })
                    ctgInfo.idList.splice(idx, 1);
                    chart.data.labels.splice(idx, 1);
                }
            }

            chart.pion.category.isChanged = false;
        }   

        //if(config.options.expand.bar.scatter)
        //    addScatterBarData(chart);


        setDefaultData(chart, config);

        if(!util.isEmpty(config.events) && util.isFunction(config.events.beforeUpdate))
            config.events.beforeUpdate(chart);
    },
    afterUpdate : function(chart, config){
        //removeDefaultData(chart, config.chartType);
        //if(config.options.expand.bar.scatter)
        //    removeScatterBarData(chart);

        if(!util.isEmpty(config.events) && util.isFunction(config.events.beforeUpdate))
            config.events.beforeUpdate(chart);
    }, 
    onClick : function(e, config){
        const chart = e.chart;
        if(config.xAxis.type === 'time'){
            const minTime = chart.scales.x.min;
            const maxTime = chart.scales.x.max;

            let timeGap = maxTime - minTime;
            var chartArea = chart.chartArea
            var xp = Math.min(e.x) - chartArea.left

            const plotPos = minTime + (timeGap * (xp / chartArea.width));

            if(!util.isEmpty(config.events) && util.isFunction(config.events.onClick))
                config.events.onClick(e, plotPos);
        }
    }
}

export {
    BaseChartjsEvent
}