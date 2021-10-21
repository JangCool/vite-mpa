class BaseChart {

    addSeries() {
        console.log("addSeries is not implements");
    }
    removeSeries() {
        console.log("removeSeries is not implements");
    }
    hideSeries(){
        console.log("hideSeries is not implements");
    }
    showSeries(){
        console.log("showSeries is not implements");
    }
    isSeriesVisibled(){
        console.log("isSeriesVisibled is not implements");
    }
    getSeriesVisibled(){
        console.log("getSeriesVisibled is not implements");
    }
    setAllSeriesVisibled(){
        console.log("setAllSeriesVisibled is not implements");
    }
    getSeriesIdByName() {
        console.log("getSeriesIdByName is not implements");
    }
    addGroup() {
        console.log("addGroup is not implements");
    }
    addPoint() {
        console.log("addPoint is not implements");
    }
    removePoint() {
        console.log("removePoint is not implements");
    }
    /**
     * 차트를 그리기 위해 데이터를 설정 한다.
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
    setSeries(data) {
        console.log("setSeries is not implements ", data);
    }
    setPlotLine() {
        console.log("setPlotLine is not implements");
    }
    removePlotLine() {
        console.log("removePlotLine is not implements");
    }
    update() {
        console.log("update is not implements");
    }
    clear() {
        console.log("clear is not implements");
    }
    reset() {
        console.log("reset is not implements");
    }
    addCategory() {
        console.log("addCategory is not implements");
    }
    removeCategory() {
        console.log("removeCategory is not implements");
    }
    hideCategory() {
        console.log("hideCategory is not implements");
    }
    showCategory() {
        console.log("showCategory is not implements");
    }
    isCategoryVisibled() {
        console.log("isCategoryVisibled is not implements");
    }
    getCategoryVisibled() {
        console.log("getCategoryVisibled is not implements");
    }
    setAllCategoryVisibled() {
        console.log("setAllCategoryVisibled is not implements");
    }
    setColorChip(){
        console.log("setColorChip is not implements");
    }
}

export default BaseChart;
