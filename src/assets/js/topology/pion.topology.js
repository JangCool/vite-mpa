import util from '../../../utils/util';
import BaseTopology from './base/base.topology';
import Cytoscape from './cytoscape/pion.cytoscape';
import DefaultConfig from './base/base.topology.config.js'

class TopologyFactory {
    static createTopology(factory, p) {
        return factory.createTopology(p); 
    }
}

class CytoscapeFactory { 
    static createTopology (p) { 
        return new Cytoscape(p); 
    }
}

class Config {
    #config;         //토폴로지 현재설정

    constructor(p){
        const defaultConfig = util.object.cloneDeep(DefaultConfig);
        const mergeConfig = util.object.merge(defaultConfig, p);
        this.#config = util.object.cloneDeep(mergeConfig);
    }

    getConfig(){
        return this.#config;
    }
}

class PionToplogy extends BaseTopology{
    #topology;
    #config;

    constructor(p){
        super();
        this.#config = new Config(p);
        this.#topology = TopologyFactory.createTopology(CytoscapeFactory, this.#config);
    }
    
    /**

     * 
     * 
     * @author 송철현(sochu89@pionnet.co.kr)
     */
    
    /**
     * 
     */
    addNode = (nodeArr) => {
        this.#topology.addNode(nodeArr);
    }

    /**
     * nodeId를 가지고 노드를 삭제한다.
     */
    removeNode = (nodeId) => {
        this.#topology.removeNode(nodeId);
    }

    updateNode = (nodeArr) => {
        this.#topology.updateNode(nodeArr);
    }

    updateAllNode = (node) => {
        this.#topology.updateAllNode(node);
    }

    /**
     * seriesId에 해당하는 series를 숨긴다.
     */
    hideNode = (nodeId) => {
        this.#topology.hideSeries(nodeId);
    }

    /**
     * seriesId에 해당하는 series를 보여준다.
     */
    showNode = (nodeId) => {
        this.#topology.showSeries(nodeId);
    }
    
    connectEdge = (edgesArr) => {
        this.#topology.connectEdge(edgesArr);
    }

    updateEdge = (edgesArr) => {
        this.#topology.updateEdge(edgesArr);
    }

    updateAllEdge = (data) => {
        this.#topology.updateAllEdge(data);
    }

    isEmpty = () => {
        return this.#topology.isEmpty();
    }

    clear = () => {
        this.#topology.clear();
    }
}

const createTopology = function(p){
    return new PionToplogy(p);
}
export { createTopology }