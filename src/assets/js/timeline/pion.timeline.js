import util from '../../../utils/util';
import BaseTimeline from './base/base.timeline';
import Vis from './extends/pion.vis';
import DefaultConfig from './base/base.timeline.config.js'

class TimelineFactory {
    static createTimeline(factory, p) {
        return factory.createTimeline(p); 
    }
}

class VisFactory { 
    static createTimeline (p) { 
        return new Vis(p); 
    }
}

class Config {
    #config;

    constructor(p){
        const defaultConfig = util.object.cloneDeep(DefaultConfig);
        const mergeConfig = util.object.merge(defaultConfig, p);
        this.#config = util.object.cloneDeep(mergeConfig);
    }

    getConfig(){
        return this.#config;
    }
}

class PionTimeline extends BaseTimeline{
    #timeline;
    #config;

    constructor(p){
        super();
        this.#config = new Config(p);
        this.#timeline = TimelineFactory.createTimeline(VisFactory, this.#config);
    }
    
    /**
     * 
     * @author 송철현(sochu89@pionnet.co.kr)
     */
    
    /**
     * 
     */
    addNode = (nodeArr) => {
        this.#timeline.addNode(nodeArr);
    }

    /**
     * nodeId를 가지고 노드를 삭제한다.
     */
    removeNode = (nodeId) => {
        this.#timeline.removeNode(nodeId);
    }

    updateNode = (nodeArr) => {
        this.#timeline.updateNode(nodeArr);
    }

    updateAllNode = (node) => {
        this.#timeline.updateAllNode(node);
    }

    /**
     * seriesId에 해당하는 series를 숨긴다.
     */
    hideNode = (nodeId) => {
        this.#timeline.hideSeries(nodeId);
    }

    /**
     * seriesId에 해당하는 series를 보여준다.
     */
    showNode = (nodeId) => {
        this.#timeline.showSeries(nodeId);
    }
    
    connectEdge = (edgesArr) => {
        this.#timeline.connectEdge(edgesArr);
    }

    updateEdge = (edgesArr) => {
        this.#timeline.updateEdge(edgesArr);
    }

    updateAllEdge = (data) => {
        this.#timeline.updateAllEdge(data);
    }

    isEmpty = () => {
        return this.#timeline.isEmpty();
    }

    clear = () => {
        this.#timeline.clear();
    }
}

const createTimeline = function(p){
    return new PionTimeline(p);
}
export { createTimeline }