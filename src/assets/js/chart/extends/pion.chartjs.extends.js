/**
 * 차트 확장 bScatter, hSactter
 */

const registChartType = function(Chart, controller) {

    class BarScatter extends controller.BarController{
        #scatterDraw(meta, ctx){
            if(!meta && !Array.isArray(meta.data)) return;

            meta.data.forEach(d => {
                const x = parseInt(d.x);
                const y = parseInt(d.y);
                const r = parseInt(d.width*0.06);

                ctx.save();
                
                ctx.fillStyle = "yellow";
                ctx.strokeStyle = "orange"

                ctx.beginPath();
                
                ctx.arc(x, y, r, 0, 2*Math.PI);
                ctx.fill();
                ctx.stroke()

                ctx.restore();
            })
        }

        draw() {
            super.draw(arguments);

            const me = this;
            const meta = me._cachedMeta;

            this.#scatterDraw(meta, me._ctx);
        }
    }
    BarScatter.id = 'barScatter'
    BarScatter.defaults = controller.BarController.defaults;
    Chart.register(BarScatter);

/*
    class HamonicaChart extends controller.ScatterController {
        //draw() {}
        getMaxOverflow () {}
    }
    HamonicaChart.defaults = {
        plugins: {
            tooltip: {
                intersect: false, // not redraw when empty chart area
                enabled: false
            }
        }
    }

    class HamonicaScatter extends HamonicaChart {
        draw () {
            if(typeof this.chart.captureData !== typeof {}){
                this.chart.captureData = { 
                    chartArea : util.object.cloneDeep(this.chart.chartArea),
                    preMinTime : this.chart.scales.x.min
                };
            }
            if (this.chart.isResize) {
                for(const key in this.chart.chartArea){
                    this.chart.captureData.chartArea[key] = this.chart.chartArea[key];
                }
            }else{
                this.chart.captureData.chartArea['right'] = Math.max(this.chart.captureData.chartArea['right'], this.chart.chartArea['right']);
                this.chart.captureData.chartArea['width'] = Math.max(this.chart.captureData.chartArea['width'], this.chart.chartArea['width']);
            }

            var canvas = this.chart.canvasScatter
            var ctx = canvas.getContext('2d')
            var scales = this.chart.scales
            var chartArea = this.chart.captureData.chartArea
            var minX = scales.x.options.min.getTime()
            var maxX = scales.x.options.max.getTime()
            var minY = scales.y.min
            var maxY = scales.y.max

            var capture = this.chart.captureData
            var preImage = ctx.getImageData(0, 0, canvas.width, canvas.height)
            // clearCanvas(canvas, ctx)
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (!this.chart.isResize) {
                if(typeof this.chart.gap === 'undefined')
                    this.chart.gap = 0;

                let gap = 0;
                if (capture.preMinTime !== this.chart.scales.x.min) {
                    this.chart.gap += (chartArea.width / (maxX - minX) * (this.chart.scales.x.min - capture.preMinTime))
                    gap = parseInt(this.chart.gap);
                    this.chart.gap -= gap;
                }

                ctx.putImageData(preImage, -gap, 0)
                ctx.clearRect(0, 0, chartArea.left, canvas.height)
            }

            var cnt = 0
            this.chart.data.dataScatter.forEach((posData) => {
                cnt = cnt + posData.data.length
                ctx.strokeStyle = posData.borderColor
                ctx.lineWidth = posData.borderWidth
                ctx.fillStyle = posData.backgroundColor

                posData.data.forEach((d) => {
                    if (this.chart.isResize || (typeof d.xp === 'undefined' || typeof d.yp === 'undefined')) {
                        var xTime = moment(d.x).milliseconds(0).toDate().getTime()
                        //이미지로 바꿔서 붙이다보니 잘리는부분이 그대로 카피됨.
                        d.xp = chartArea.left + chartArea.width * ((xTime - minX) / (maxX - minX)) - ctx.lineWidth
                        d.yp = chartArea.bottom - chartArea.height * ((d.y - minY) / (maxY - minY))

                        const rotation = this.chart.options.elements.point.rotation
                        const radius = this.chart.options.elements.point.radius
                        const rad = (rotation || 0) * Math.PI / 180 + Math.PI / 4

                        ctx.beginPath()
                        var xOffset = Math.cos(rad) * radius
                        var yOffset = Math.sin(rad) * radius
                        ctx.moveTo(parseInt(d.xp) - xOffset, parseInt(d.yp) - yOffset)
                        ctx.lineTo(parseInt(d.xp) + xOffset, parseInt(d.yp) + yOffset)
                        ctx.moveTo(parseInt(d.xp) + yOffset, parseInt(d.yp) - xOffset)
                        ctx.lineTo(parseInt(d.xp) - yOffset, parseInt(d.yp) + xOffset)
                        ctx.closePath()

                        if (this.chart.options.elements.point.borderWidth > 0) {
                            ctx.stroke()
                        }
                    }
                })
            })

            this.chart.captureData.preMinTime = this.chart.scales.x.min;
            this.chart.isResize = false;
        }

        initialize () {
            super.initialize(arguments)
            // datasets에 들어있으면 불필요한 로직이 너무 많이타서 느림(스캐터의 경우 뿌려주는 데이터 많기에 데이터 따로 관리)
            this.chart.data.dataScatter = util.object.cloneDeep(this.chart.data.datasets)
        }

        update (mode) {
            if (mode === 'resize') {
                this.chart.isResize = true
            }
        }
    }
    HamonicaScatter.id = 'hScatter'
    Chart.register(HamonicaScatter)

    class BlockScatter extends HamonicaChart {
        #drawRoundRect = function (ctx, x, y, width, height, radius, fill, stroke) {
            if (typeof stroke === 'undefined') {
                stroke = true
            }
            if (typeof radius === 'undefined') {
                radius = 5
            }
            if (typeof radius === 'number') {
                radius = { tl: radius, tr: radius, br: radius, bl: radius }
            } else {
                var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
                for (var side in defaultRadius) {
                    radius[side] = radius[side] || defaultRadius[side]
                }
            }
            ctx.beginPath()
            ctx.moveTo(x + radius.tl, y)
            ctx.lineTo(x + width - radius.tr, y)
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
            ctx.lineTo(x + width, y + height - radius.br)
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
            ctx.lineTo(x + radius.bl, y + height)
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
            ctx.lineTo(x, y + radius.tl)
            ctx.quadraticCurveTo(x, y, x + radius.tl, y)
            ctx.closePath()
            if (fill) {
                ctx.fill()
            }
            if (stroke) {
                ctx.stroke()
            }
        }

        draw () {
            var ctx = this.chart.ctx
            ctx.save()
            ctx.lineJoin = 'round'
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)'
            ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'
            ctx.lineWidth = 1

            var chartArea = this.chart.chartArea // top, bottom, left, right, width, height
            var options = this.chart.options
            var data = this.chart.data

            var xCnt = options.xCnt
            var yCnt = options.yCnt
            var xLen = chartArea.width / xCnt
            var yLen = chartArea.height / yCnt

            var dataBlock = data.dataBlock
            if (Array.isArray(dataBlock)) {
                for (var x = 0; x < dataBlock.length; x++) {
                    for (var y = 0; y < dataBlock[0].length; y++) {
                        if (dataBlock[x][y].cnt > 0) {
                            // ctx, x, y, width, height, radius, fill, stroke)
                            var xp = chartArea.left + xLen * x
                            var yp = chartArea.top + yLen * y
                            this.#drawRoundRect(ctx, xp, yp, xLen, yLen, 2, true)
                        }
                    }
                }
            }

            ctx.restore()
        }

        initialize () {
            super.initialize(arguments)

            var xCnt = this.chart.options.scales.x.timeGap / this.chart.options.updateTerm
            var yCnt = 25
            this.chart.options.xCnt = xCnt // len / updateTerm
            this.chart.options.yCnt = yCnt

            this.chart.data.dataBlock = [];
            var dataBlock = this.chart.data.dataBlock
                
            for (var x = 0; x < xCnt; x++) {
                let newArr = [];
                for(let i=0;i<yCnt;i++)
                    newArr.push({cnt:0});
                dataBlock.push(newArr)
            }
        }
    }
    BlockScatter.id = 'bScatter'
    BlockScatter.defaults = HamonicaChart.default
    Chart.register(BlockScatter)
    */
}

export {
    registChartType
}