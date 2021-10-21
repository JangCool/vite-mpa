// import util from '../../../../utils/util';
import BaseTimeline from '../base/base.timeline';

// import defaultOptions from './pion.cytoscape.default';
// import defaultStyle from './pion.cytoscape.style';

import { DataSet, Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import util from '@/utils/util';
// import Handlebars from 'Handlebars';

const Handlebars = require("handlebars");

const dateFormat = {
    year: 'YYYY',
    month: 'M',
    weekday: 'MM/D',
    day: 'MM/D',
    hour: 'HH:mm',
    minute: 'HH:mm'
}

const templates = {
    timeMarker: Handlebars.compile('<div class="container"><div class="row"><div class="col-md-12"><h2>{{id}}</h2><p>Donec id elit non mi porta gravida at eget metus.</p><p><a class="btn btn-secondary" onclick="onClick({{id}})" role="button">View details »</a></p></div></div></>')
    // timeMarker: Handlebars.compile(`<div class="tl-timemarker-content"><div class="tl-timemarker-media-container"><span class="tl-icon-image"></span></div><div class="tl-timemarker-text"><h2 class="tl-headline" style="-webkit-line-clamp: 3;">A Musical Heritage</h2></div></div>`)

}
class Vis extends BaseTimeline {
    #timeline;
    #config;
    // #templates;

    constructor(p) {
        super();

        this.#config = p;
        let timelineConfig = this.#convertConfig(this.#config.getConfig());
        
        let dataObj = {
            incidents: new DataSet(this.#createItems(this.#config.getConfig().incidents)),
            groups:  new DataSet(this.#createGroups(this.#config.getConfig().groups))
        }

        // this.#timeline = new Timeline(timelineConfig.id, dataObj.incidents, dataObj.groups, timelineConfig.options);
        this.#timeline = new Timeline(timelineConfig.id, dataObj.incidents, timelineConfig.options);
        this.#timeline.pion = dataObj;

        if(dataObj.groups.length > 0) this.#timeline.setGroups(dataObj.groups);
    }

    // loadingScreenTemplate

    #convertConfig = function(config){
        let timelineConfig = {
            id : document.getElementById(config.id),
            // data: new DataSet(this.#createItems(config.incidents)),
            // groups: new DataSet(this.#createGroups(config.groups)),
            options : {
                // align: 'auto',  // auto(default), center, left, right
                // autoResize: true,
                // clickToUse: false,
                // dataAttributes: false, // string[] or 'all' - tag의 data- 속성 필드 선택
                // editable: false, // bolean or Object
                // start: null,   // Date or Number or String or Moment
                // end: null,     // Date or Number or String or Moment
                // format: null,  // Object or Function - custom date formatting
                // groupOrder: 'order', // string or function
                // groupTemplate: null, // function - 사이드 헤더 틀
                // height: '',    // number or string
                // minHeight: '300px',  // number or string
                // maxHeight: '300px',  // number or string
                // width: '',     // number or string
                template: function(item, element, data) {
                    console.log("!!!!!!!!!!! ", item, element, data);
                    let strTemplate = '';
                    
                    if(item.template ?? false) {
                        let template = templates[item.template];
                        strTemplate = template(item)
                    }else {
                        strTemplate = item.content;
                    }
                    console.log(strTemplate);

                    return strTemplate;
                }, //function
                // // timeAxis: '',   // object
                // type: 'point',     // box, point, range, backgroud
                zoomMax: 7884000000, // 7884000000 milliseconds = 3 months
                zoomMin: 3600000,  // 3600000 milliseconds = 60 minutes
                // timeAxis: { scale: 'day', step: 1 },
                format: {
                    minorLabels: function(date, scale) {
                        return date.format(dateFormat[scale] ?? "YYYY/MM/DD");
                    },
                    majorLabels: function (date) {
                        return date.format("YYYY-M-D");
                    }
                }
            }
        };

        return timelineConfig;
    }

    #getDefaultDataObj = (data) => {
        const { id, 
            // className,
            //  title,
              content} = data;

        return {
            id: id,
            // className: className,
            // title: title,
            content: content
        }
    }

    #createItems = (data) => {
        let itemArr = [];
        let dataArr = data;

        if(data ?? false) {
            if(!Array.isArray(data)) dataArr = [ data ];

            dataArr.forEach((d) => {
                let defaultData = this.#getDefaultDataObj(d);
                // let item = { ...defaultData, ...{
                //     start: d.start,
                //     end: d.end,
                //     group: d.group ?? '',
                //     subGroup: d.subGroup ?? '',
                //     type: d.type ?? 'box'
                // }};
                
                let item = { ...defaultData, ...d};

                itemArr.push(item);
            });
        }

        return itemArr;
    }

    #createGroups = (data) => {
        let groupArr = [];
        let dataArr = data;

        if(data ?? false) {
            if(!Array.isArray(data)) dataArr = [ data ];

            dataArr.forEach((d) => {
                let defaultData = this.#getDefaultDataObj(d);
                let item = { ...defaultData, ...{
                    subgroupOrder: d.subgroupOrder,
                }};
                
                groupArr.push(item);
            });
        }

        return groupArr;
    }

    #createDataset = (dataArr) => {
        return new DataSet(dataArr);
    }

    setIncidents = (incidents) => {
        this.#config.data = this.#createDataset(this.#createItems(incidents));
    }

    addIncidents = (incidents) => {
        this.#config.data.add(this.#createItems(incidents));
    }

    updateIncidents = (incidents) => {
        this.#config.data.update(this.#createItems(incidents));
    }

    removeIncidents = (ids) => {
        this.#config.data.remove(ids);
    }

    setGroups = (incidents) => {
        this.#config.groups = this.#createDataset(this.#createGroups(incidents));
    }

    addGroups = (incidents) => {
        this.#config.groups.add(this.#createGroups(incidents));
    }

    updateGroups = (incidents) => {
        this.#config.groups.update(this.#createGroups(incidents));
    }

    removeGroups = (ids) => {
        this.#config.groups.remove(ids);
    }

    setPlotLine = (plotPos, content) => {
        var id = new Date().getTime();

        this.#timeline.addCustomTime(plotPos, id);

        if(!util.isEmpty(content)) this.#timeline.setCustomTimeMarker(content, id);
    }

    removePlotLine = (plotPos) => {
        this.#timeline.removeCustomTime(plotPos);
    }
}

export default Vis;