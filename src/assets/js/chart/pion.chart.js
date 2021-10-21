import util from '../../../utils/util';
import BaseChart from './base/base.chart';
//import ChartJs from './pion.chartjs';
import ChartJs from './pion.chartjs2';
import DefaultConfig from './base/base.chart.config'

class ChartFactory {
    static createChart(factory, p) {
        return factory.createChart(p); 
    }
}

class ChartJsFactory { 
    static createChart (p) { 
        return new ChartJs(p); 
    }
}

class Config {
    #originalConfig; //차트 초기설정
    #config;         //차트 현재설정

    constructor(p){
        const defaultConfig = util.object.cloneDeep(DefaultConfig);
        const mergeConfig = util.object.merge(defaultConfig, p);
        this.#originalConfig = util.object.cloneDeep(mergeConfig);
        this.#config = util.object.cloneDeep(mergeConfig);
    }

    getOriginalConfig(){
        return this.#originalConfig;
    }

    getConfig(){
        return this.#config;
    }
}

class PionChart extends BaseChart{
    #chart;
    #config;

    constructor(p){
        super();
        this.#config = new Config(p);
        this.#chart = ChartFactory.createChart(ChartJsFactory, this.#config);
    }
    
    /**
     * 차트를 그리기 위해 시리즈 데이터를 설정 한다.
     * 기존에 해당 함수 호출 시 기존의 데이트를 초기화한다.
     * 
     * @param {Array} data 차트 데이터
     * [
     *      {
     *          id: Series id,
     *          name: Series 명,
     *          data: Series data (Array Value 또는 Array Object), ex) Array Value = [[3,5,2,4,6,9],[3,5,2,4,6,9]], ex) Array Object = [{x: 1421919, y: 64},{x: 191919, y: 5 },{x: 131919, y: 4 }...]
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
    setSeries = (data) => {
        this.#chart.setSeries(data);
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
    addSeries = (seriesInfo) => {
        this.#chart.addSeries(seriesInfo);
    }

    getConfig = () => {
        return this.#chart.getConfig();
    }

    /**
     * seriesId에 해당하는 series를 삭제한다.
     */
    removeSeries = (seriesId) => {
        this.#chart.removeSeries(seriesId);
    }

    /**
     * seriesId에 해당하는 series를 숨긴다.
     */
    hideSeries = (seriesId) => {
        this.#chart.hideSeries(seriesId);
    }

    /**
     * seriesId에 해당하는 series를 보여준다.
     */
    showSeries = (seriesId) => {
        this.#chart.showSeries(seriesId);
    }
    
    /**
     * 입력받은 seriesId의 visible 여부를 리턴한다.
     */
    isSeriesVisibled = (seriesId) => {
        return this.#chart.isSeriesVisibled(seriesId);
    }

    /**
     * seriesId별 visible 여부를 리턴한다.
     */
    getSeriesVisibled = () => {
        return this.#chart.getSeriesVisibled();
    }

    setAllSeriesVisibled = (visibled) => {
        this.#chart.setAllSeriesVisibled(visibled);
    }

    /**
     * series존재여부를 seriesId로 확인한다.
     */
    containSeries = (seriesId) => {
        this.#chart.containSeries(seriesId);
    }

    /**
     * series존재여부를 seriesName으로 확인한다.
     */
    containSeriesByName  = (seriesName) => {
        this.#chart.containSeriesByName(seriesName);
    }

    /**
     * seriesName에 해당하는 seriesId를 array로 리턴한다.
     */
    getSeriesIdByName = (seriesName) => {
        return this.#chart.getSeriesIdByName(seriesName);
    }
    
    /**
     * 차트의 그룹을 추가한다.
     * groupInfo : {
     *      groupId : 'string'
     *      groupName : 'string'
     *      data : value or array
     * }
     */
    addGroup = (groupInfo) => {
        this.#chart.addGroup(groupInfo);
    }

    /**
     *  차트에 데이터를 넣어준다.
     * {
     *      id : 'string' //series id
     *      value : [ ('value' or {}), ('value' or {}), ... ]
     * }
     */
    addPoint = (point, options, addAuto) => {
        this.#chart.addPoint(point, options, addAuto);
    }

    setPlotLine = (plotPos) => {
        this.#chart.setPlotLine(plotPos);
    }

    removePlotLine  = () => {
        this.#chart.removePlotLine();
    }

    clear = () => {
        this.#chart.clear();
    }

    /**
     *  차트화면을 갱신한다.
     */
    update = (renewal, updateTime) => {
        this.#chart.update(renewal, updateTime);
    }

    setColorChip = (colorChip) => {
        this.#chart.setColorChip(colorChip);
    }

    addCategory = (categoryInfo) => {
        this.#chart.addCategory(categoryInfo)
    }

    removeCategory = (categoryId) => {
        this.#chart.removeCategory(categoryId)
    }

    /**
     * category를 숨긴다.(x축이 default에 2차원 차트만 제공)
     */
    hideCategory =  (categoryId) => { 
        this.#chart.hideCategory(categoryId)
    }

    /**
     * category를 보여준다.(x축이 default에 2차원 차트만 제공)
     */
    showCategory = (categoryId) => { 
        this.#chart.showCategory(categoryId);
    }

    /**
     * category의 노출되고 있는지 보여준다.
     */
    isCategoryVisibled = (categoryId) => {
        return this.#chart.isCategoryVisibled(categoryId);
    }

    /**
     * 전체 category의 노출여부를 리턴한다.
     */
    getCategoryVisibled = () => {
        return this.#chart.getCategoryVisibled();
    }

    /**
     * 전체 category의 노출여부를 수정한다.
     */
    setAllCategoryVisibled = (visibled) => {
        return this.#chart.setAllCategoryVisibled(visibled);
    }

    /**
     * 생성된 데이터가 랜덤으로 들어있는 차트를 보여준다.
     */
    makePreviewChart = () => {
        return this.#chart.makePreviewChart();
    }
}

const createChart = function(p){
    return new PionChart(p);
}
export { createChart }