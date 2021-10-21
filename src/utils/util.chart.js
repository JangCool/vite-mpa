/**
 * Front-end에서 사용할 Text 유틸 스크립트를 정의한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */

import util from './util';

const SUFFIX_SUM = '_SUM';


const isCalculatedMetrics = (metricId) => metricId.endsWith(SUFFIX_SUM);


/**
 * Chart 데이터로 변환 한다.
 * 
 * @param {*} tempData 측정지표 시간 순서대로 에이전트 데이터를 나열한 임시 데이터
 * @param {*} convertData 차트에 바로 적용할 수 있게 변환한 차트 데이터.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const setChartData = (tempData, convertData, options) => {
    
    for (const metricId in tempData) {

        //계산된 측정 지표일 경우 합산된 값을 바로 대입한다.
        if(options.sum.includes(metricId) && isCalculatedMetrics(metricId)) {

            const metricData = tempData[metricId];
            let seriesData = convertData[metricId];

            if(util.isEmpty(seriesData)){
                seriesData = convertData[metricId] = {
                    id : metricId,
                    data : metricData
                };
            }

            continue;
        }

        //개별 항목별로 데이터를 대입한다.
        if (Object.hasOwnProperty.call(tempData, metricId)) {
            const metricData = tempData[metricId];
            
            for (const aid in metricData) {
                if (Object.hasOwnProperty.call(metricData, aid)) {
                    const data = metricData[aid];
                    let seriesData = convertData[metricId];
                    if(util.array.isEmpty(seriesData)){
                        seriesData = convertData[metricId] = [];
                    }

                    seriesData.push({
                        id : aid,
                        data : data
                    });
                }
            }
        }
    }
}


/**
 * 임시로 만든 측정지표 저장 객체에 차트 데이터 형식으로 변경 추가.
 * 
 * @param {*} datetime 측정 시간.
 * @param {*} metricData 측정 지표.
 * @param {*} tempMetricData 차트 데이터 형식으로 임시 저장할 객체
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const addMetricData = (datetime, metricData, tempMetricData) => {

    for (const aid in metricData) {
        if (Object.hasOwnProperty.call(metricData, aid)) {

            const value = metricData[aid];

            let aidData = tempMetricData[aid];

            if(util.isEmpty(aidData)){
                aidData = tempMetricData[aid] = [];
            }

            aidData.push({
                x: datetime,
                y: value
            })
            
        }
    }

}


/**
 * 임시로 만든 측정지표 저장 객체에 차트 데이터 형식으로 변경 추가.
 * 
 * @param {*} datetime 측정 시간.
 * @param {*} metricData 측정 지표.
 * @param {*} tempMetricData 차트 데이터 형식으로 임시 저장할 객체
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const addSumMetricData = (datetime, metricData, tempMetricData) => {

    let sum = 0;

    for (const aid in metricData) {
        if (Object.hasOwnProperty.call(metricData, aid)) {
            sum += metricData[aid];
        }
    }

    tempMetricData.push({
        x: datetime,
        y: sum
    })
}

const getSumId = (mid) => {
    return mid + SUFFIX_SUM;
}

const chart = {
    getSumId,

    // *          data: Series data (Array Value 또는 Array Object), ex) Array Value = [[3,5,2,4,6,9],[3,5,2,4,6,9]], ex) Array Object = [{x: 1421919, y: 64},{x: 191919, y: 5 },{x: 131919, y: 4 }...]

    /**
     * 넘겨 값은 값이 빈 값인지 확인한다. 
     * ps.공백을 빈값으로 처리.
     * 
     * @param {Array} data 변경할 원본 데이터
     * @param {Object} options 계산할 옵션  { sum : [ 메트릭아이디_SUM, 메트릭아이디2_SUM, 메트릭아이디3_SUM ] }
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    convertRecordedData : (data, opt) => {
        
        let options = util.object.merge({
            sum : []    //합계를 구할 측정 지표 아이디 모음.
        }, opt);

        //아이디 재정의
        options.sum = options.sum.map( m => getSumId(m) )

        if(util.array.isEmpty(data)){
            console.warn("변환할 데이터가 존재하지 않습니다. ")
            return null; 
        }

         let tempData = {};
         let convertData = {};
         let dataLength  = data.length;

         for (let i = 0; i < dataLength; i++) {

            let datetime = data[i].datetime;
            let metrics = data[i].metrics;

            for(let mid in metrics){

                let sumId = getSumId(mid);

                //M6으로 시작하는 데이터는 측정지표보다는 상태 관련 데이터이므로 생략.
                if(mid.startsWith("M6")){
                    continue;
                }

                let metricDataByTemp = tempData[mid];

                if(util.isEmpty(metricDataByTemp)){
                    metricDataByTemp = tempData[mid] = {};
                }

                let metricData = metrics[mid];

                // 임시로 만든 측정지표 저장 객체에 차트 데이터 형식으로 변경 추가.
                addMetricData(datetime, metricData, metricDataByTemp);

                // 측정지표를 합계 처리하도록 설정 할 경우 직정지표아이디_SUM 형식으로 측정 지표 생성
                if(options.sum.includes(sumId)){

                    let sumMetricDataByTemp = tempData[sumId];

                    if(util.isEmpty(sumMetricDataByTemp)){
                        sumMetricDataByTemp = tempData[sumId] = [];
                    }
                    // 임시로 만든 측정지표 저장 객체에 차트 데이터 형식으로 변경 추가.
                    addSumMetricData(datetime, metricData, sumMetricDataByTemp);
                }

            }
         }

        //  {datetime: 1621971357071, metrics: {…}}

        setChartData(tempData, convertData, options);

        console.log('Websocket onmessage ########convertData ', convertData);
        return convertData;
    },

    convertRecordedDataIntoSumData: function(recorededData){
        console.log("######## convertRecordedDataIntoSumData ", recorededData)
    },

    /**
     * 포인트를 추가하기 위해 측정 지표를 차트 유형의 데이터로 변환  
     * 
     * @param datetime 측정 시간 
     * @param metricData 측정 지표 객체
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    convertMetricValuesToChartData : (datetime, metricData) => {

        if(util.isEmpty(metricData)){
           console.warn("변환할 데이터가 존재하지 않습니다. ")
           return null; 
        }

        let convertData = [];

        for (const aid in metricData) {
            if (Object.hasOwnProperty.call(metricData, aid)) {
                const value = metricData[aid];
                convertData.push({
                    id: aid,
                    data: {
                        x: datetime,
                        y: value
                    }
                })
                
            }
        }

        return convertData;
    },

    /**
     * 포인트를 추가하기 위해 데이터 변환  
     * 
     * @param datetime 측정 시간 
     * @param id series id
     * @param value 측정 지표 값
     * @author 장진철(zerocooldog@pionnet.co.kr)
     * @since 2020.12.01
     */
    convertValuesToChartData : (datetime, seriesId, value) => {

        return {
                id: seriesId,
                data: {
                    x: datetime,
                    y: value
                }
            };
    },
}

export default chart