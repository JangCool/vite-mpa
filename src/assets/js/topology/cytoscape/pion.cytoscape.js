import util from '../../../../utils/util';
import BaseTopology from '../base/base.topology';
import defaultOptions from './pion.cytoscape.default';
import defaultStyle from './pion.cytoscape.style';
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';
import nodeHtmlLabel from 'cytoscape-node-html-label';

cytoscape.use( klay );
nodeHtmlLabel(cytoscape);


// var roundedRectData = function (w, h, tlr, trr, brr, blr) {
//     return 'M 0 ' + tlr
//         + ' A ' + tlr + ' ' + tlr + ' 0 0 1 ' + tlr + ' 0'
//         + ' L ' + (w - trr) + ' 0'
//         + ' A ' + trr + ' ' + trr + ' 0 0 1 ' + w + ' ' + trr
//         + ' L ' + w + ' ' + (h - brr)
//         + ' A ' + brr + ' ' + brr + ' 0 0 1 ' + (w - brr) + ' ' + h
//         + ' L ' + blr + ' ' + h
//         + ' A ' + blr + ' ' + blr + ' 0 0 1 0 ' + (h - blr)
//         + ' Z';
// };

// var svg = function svg(svgStr) {

//     var parser = new DOMParser();
//     var svgText = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg><svg xmlns=\'http://www.w3.org/2000/svg\' version=\'1.1\' width=\'' + width + '\' height=\'' + height + '\'>' + svgStr + '</svg>';
//     return parser.parseFromString(svgText, 'text/xml').documentElement;
//   };


class Cytoscape extends BaseTopology {
    #topology;
    #config;

    constructor(p) {
        super();
        this.#config = p;
        // this.#config = util.object.merge(util.object.cloneDeep(DefaultConfig), p);
    
        let updatedConfig = this.#convertConfig(this.#config.getConfig());

        this.#topology = cytoscape(updatedConfig);
        
        this.#topology.nodeHtmlLabel([{
            query: '.htmlText',
            halign: "center",
            valign: "center",
            halignBox: "center",
            valignBox: "center",
            tpl: function(data) {
                let respTime = !util.isNull(data.respTime) ? data.respTime : 0;
                let progess = 0, barColor = '';
                let label = '<div id="label_' + data.id + '" class="html-text-div">';

                progess = Math.min(respTime.toFixed(2), 10)/10 * 100;

                if(respTime > 30 && respTime <= 80) {
                    barColor = 'warning';
                }else if(respTime > 80) {
                    barColor = 'danger';
                }

                label += `<div class="progress-bar-div"><div class="progress-container"><div class="progress-bar ${ barColor }" style="width: ${ progess }%"></div>`;
                label += `<p>응답시간:  ${ respTime } (ms)</p></div></div>`;

                label += `<div class="txt-box"><div class="txt-box-row"><span class="header">NAMESPACE</span><br><strong>${ data.namespace }</strong></div>`;
                label += `<div class="txt-box-row"><span class="header">ID</span><br><strong>${ data.cacheId }</strong></div></div></div></div>`;

                return label;
            }
        }]);

        this.#topology.on('click', '.htmlText, .imageNode', function(evt) {
            var node = evt.target;
            
            // 인식이 안돼서 setTimeOut 설정
            setTimeout(function() {
                node.connectedEdges().select();
            }, 10);

        });

        this.#topology.on('click', 'edge', function(evt) {
            var edge = evt.target;

            // 인식이 안돼서 setTimeOut 설정
            setTimeout(function() {
                edge.connectedNodes().select();
            }, 10);
        });
    }

    #edgesProgressAnimation = (node) => {
        let bfs = this.#topology.elements().bfs('#' + node.id(), function() {}, true);
        let pathArr = bfs.path;

        for (let i = 0; i < pathArr.length; i += 1) {
            let ele = pathArr[i];
            
            if(ele.isEdge() && !ele.animated()) {
                let animation = ele.animation({
                    style: { 
                        'lineColor': '#616262',
                        'targetArrowColor': '#616262',
                        'transitionProperty': 'background-color, line-color, target-arrow-color',
                    },
                    duration: 1000,
                    easing: 'ease-in-out-circ'
                });
    
                animation.play()
                    .promise('completed')
                    .then(function(){ // on next completed
                        animation
                            .reverse() // switch animation direction
                            .rewind() // optional but makes intent clear
                            .play(); // start again
                });
            }
        }
    }

    #convertConfig = (config) => {
        // this.#setComponentMap();
        
        // 추후 layout도 만들자(노드 배치: random, tree, circle...)
        let updatedConfig = {
            id: config.id,
            container: document.getElementById(config.id),
            // layout: config.layout,
            layout: {
                name: 'klay',
            },
            zoom: 4,
            minZoom: 1e-5,
            maxZoom: 1e50,
            zoomingEnabled: true,
            userZoomingEnabled: true,
            style: defaultStyle
        }

        return updatedConfig;
    }

    #refreshLayout = () => {
        this.#topology.nodes('[isFixed = "true"]').lock();
        this.#topology.layout(defaultOptions).run();
    }

    #createElement = (obj) => {
        return util.object.merge({ group: 'nodes'}, obj);
    }

    #createNode = (node) => {
        let obj = new Object();

        if('id' in node.data) {
            throw 'data에 id를 넣지 마세요!';
        }

        obj['data'] = node.data;
        obj['data']['id'] = node.id;

        if(!util.isEmpty(node.classes) && !util.isNull(node.classes)) obj['classes'] = node.classes;
        if(!util.isEmpty(node.isFixed) && !util.isNull(node.isFixed)) obj['data']['isFixed'] = node.isFixed;
        if(!util.isEmpty(node.position) && !util.isNull(node.position)) obj['position'] = node.position;

        return this.#createElement(obj);
    }

    connectEdge = (edgeArr) => {
        let data = edgeArr;
        let elements = new Array();

        if(!Array.isArray(data)) data = [ data ];

        data.forEach((ele) => {            
            elements.push(this.#createElement({ group: 'edges', data: { id: ele.from + '-' + ele.to, source: ele.from, target: ele.to, label: ele.label, visible: ele.visible }, grabbable: false }));
        });
        
        this.#topology.add(elements);
        this.#refreshLayout();
    }

    addNode = (nodeArr) => {
        let data = nodeArr;
        let elements = new Array();

        if(!Array.isArray(data)) data = [ data ];

        data.forEach((ele) => {
            elements.push(this.#createNode(ele));
        });
        
        this.#topology.add(elements);
        this.#refreshLayout();
    }

    removeNode = (nodeId) => {        
        this.#topology.getElementById(nodeId).remove();
    }

    updateNode = (nodeArr) => {
        let data = nodeArr;

        if(!Array.isArray(data)) data = [ data ];

        
        this.#topology.startBatch();
        data.forEach((d) => {
            let ele = this.#topology.getElementById(d.id);

            ele.data(d.data);
        });        
        this.#topology.endBatch();
    }

    updateAllNode = (node) => {
        if(!util.isEmpty(node.classes) && !util.isNull(node.classes)) {
            let obj = new Object(node.data);        

            if(!util.isEmpty(node.isFixed) && !util.isNull(node.isFixed)) obj['isFixed'] = node.isFixed;

            console.log(this.#topology.nodes("." + node.classes));

            this.#topology.nodes("." + node.classes).data(obj);
        }
    }

    hideNode = (nodeId) => {        
        let node = this.#topology.getElementById(nodeId);
        
        node.connectedEdges().forEach((ele) => {
            ele.addClass('hide');
        });
        node.addClass('hide');
    }

    showNode = (nodeId) => {        
        let node = this.#topology.getElementById(nodeId);

        node.connectedEdges().forEach((ele) => {
            ele.removeClass('hide');
        });
        node.removeClass('hide');
    }

    updateEdge = (edgeArr) => {
        let data = edgeArr;

        if(!Array.isArray(data)) data = [ data ];

        this.#topology.startBatch();
        data.forEach((d) => {
            let ele = this.#topology.getElementById(d.from + '-' + d.to);

            if(ele.length > 0) {
                let obj = new Object();

                if(!util.isNull(d.label)) obj['label'] = d.label;
                if(!util.isNull(d.visible)) obj['visible'] = d.visible;

                ele.data(obj);
            }
        });
        this.#topology.endBatch();
    }

    updateAllEdge = (data) => {
        let obj = new Object();

        if(!util.isNull(data.label)) obj['label'] = data.label;
        if(!util.isNull(data.visible)) obj['visible'] = data.visible;

        this.#topology.edges().data(obj);
    }

    isEmpty = () => {
        return this.#topology.elements().empty();
    }

    clear = () => {
        this.#topology.remove(this.#topology.elements())
    }
}

export default Cytoscape;