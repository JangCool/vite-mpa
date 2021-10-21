import util from '../../../../utils/util';
import BaseTopology from '../base/base.topology';
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';
import nodeHtmlLabel from 'cytoscape-node-html-label';

cytoscape.use( klay );
nodeHtmlLabel(cytoscape);

var options = {
    name: 'klay',
    nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
    fit: true, // Whether to fit
    padding: 20, // Padding on fit
    animate: false, // Whether to transition the node positions
    // animateFilter: function( node, i ){ return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // Duration of animation in ms if enabled
    animationEasing: undefined, // Easing of animation if enabled
    // transform: function( node, pos ){ return pos; }, // A function that applies a transform to the final node position
    ready: undefined, // Callback on layoutready
    stop: undefined, // Callback on layoutstop
    klay: {
      // Following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
      addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
      aspectRatio: 4, // The aimed aspect ratio of the drawing, that is the quotient of width by height
      borderSpacing: 20, // Minimal amount of space to be left to the border
      compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
      crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
      /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
      INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
      cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
      /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
      INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values.*/
      direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
      /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
      edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
      edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
      feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
      fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
      /* NONE Chooses the smallest layout from the four possible candidates.
      LEFTUP Chooses the left-up candidate from the four possible candidates.
      RIGHTUP Chooses the right-up candidate from the four possible candidates.
      LEFTDOWN Chooses the left-down candidate from the four possible candidates.
      RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
      BALANCED Creates a balanced layout from the four possible candidates. */
      inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
      layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
      linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
      mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
      mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
      nodeLayering:'NETWORK_SIMPLEX', // Strategy for node layering.
      /* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
      LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
      INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
      nodePlacement:'BRANDES_KOEPF', // Strategy for Node Placement
      /* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
      LINEAR_SEGMENTS Computes a balanced placement.
      INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
      SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
      randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
      routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
      separateConnectedComponents: true, // Whether each connected component should be processed separately
      spacing: 20, // Overall setting for the minimal amount of space to be left between objects
      thoroughness: 7 // How much effort should be spent to produce a nice layout..
    },
    // priority: function( edge ){ return null; }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
  };
class Cytoscape extends BaseTopology {
    #topology;
    #config;
    #cyCollection;

    constructor(p) {
        super();
        this.#config = p;
        // this.#config = util.object.merge(util.object.cloneDeep(DefaultConfig), p);
    
        let updatedConfig = this.#convertConfig(this.#config.getConfig());

        this.#topology = cytoscape(updatedConfig);
        
        this.#topology.nodeHtmlLabel([{
            query: '.htmlLabel',
            halign: "center",
            valign: "center",
            halignBox: "center",
            valignBox: "center",
            tpl: function(data) {
                let label = '<div id="label_' + data.id + '" class="textHtmlLabel">';
                
                if(!util.isEmpty(data.resp) && !util.isNull(data.resp) 
                    && !util.isEmpty(data.respTime) && !util.isNull(data.respTime)) {
                        let respHtml = '<div class="stream-box"><div class="txt-box inline-box">';
                        respHtml += '<div class="leftSide"><span class="header">' + data.resp + '</span></div>';
                        respHtml += '<div class="rightSide"><span class="header">응답시간(ms)</span><br>'
                        respHtml += '<strong>' + data.respTime + '</strong>';
                        respHtml += '</div></div>';

                        label += label + respHtml;
                    }

                label += '<div class="stream-box"><div class="txt-box"><div class="stream-row"><span class="header">package</span><br>';
                label += '<strong>' + data.package + '</strong></div>';
                label += '<div class="stream-row"><span>Class</span><br>';
                label += '<strong>' + data.class + '</strong>';
                label += '</div></div></div></div>';

                return label;
            }
        }]);


        let edgesProgressAnimation = this.#edgesProgressAnimation;
        
        this.#topology.on('click', '.componentNode', function(e){
            let clickedNode = e.target;

            edgesProgressAnimation(clickedNode);        
        });
        
        // this.#topology.on('mouseover', '.componentNode, .componentNode :child', function(e){
        //     let node = e.target;
            
        //     if(node.isChild()) {
        //         node = node.parent()[0];
        //     }

        //     node.style('backgroundOpacity', 0.4);
            
        // });

        // this.#topology.on('mouseout', '.componentNode', function(e){
        //     let node = e.target;

        //     node.style('backgroundOpacity', 0);
        // });
    }

    #positionImageNode = () => {
        // this.#topology.nodes('.htmlLabel').forEach(function(ele) {
        //     console.log("ele <<<<<<<<<<<<<<<<< ", ele, ele.id());
        // });

        this.#topology.$('.imageComponentNode').forEach(function(ele) {
            let lastSiblingBox = ele.siblings().last().boundingBox();
            let child = ele.children();

            let pos = ele.position({
                x: (lastSiblingBox.x1 + lastSiblingBox.x2)/2 - lastSiblingBox.w/2 + 45,
                y: (lastSiblingBox.y1 + lastSiblingBox.y2)/2 - lastSiblingBox.h/2 + 20
            });

            let x = pos.position().x, y = pos.position().y;

            
            // child[0].position({
            //     x: pos.position().x,
            //     y: y
            // });

            // child[1].position({
            //     x: pos.position().x + child[0].renderedBoundingBox().w,
            //     y: y 
            // });

            // child[2].position({
            //     x: pos.position().x + child[0].renderedBoundingBox().w,
            //     y: y
            // });

            child.forEach(function(childNode) {
                let box = childNode.renderedBoundingBox();
                let w = box.w;

                childNode.position({
                    x: x,
                    y: y
                });

                x = x + w + 40;
            });

            // let pos = ele.position({
            //     x: (lastSiblingBox.x1 + lastSiblingBox.x2)/2  + lastSiblingBox.w - 145,
            //     y: (lastSiblingBox.y1 + lastSiblingBox.y2)/2
            // });
            // let x = pos.position().x, y = pos.position().y - 10;

            // let child = ele.children();
            
            // child[0].position({
            //     x: pos.position().x,
            //     y: y
            // });

            // child[1].position({
            //     x: pos.position().x + child[0].renderedBoundingBox().w - 5,
            //     y: y 
            // });

            // child[2].position({
            //     x: x + 22,
            //     y: pos.position().y + child[0].renderedBoundingBox().h + 25
            // });
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
            style: [
                {
                    // selector: ':parent',
                    selector: '.componentNode',
                    css: {
                        borderColor: '#343a40',
                        borderWidth: 0.5,
                        // ghost: 'yes',
                        // ghostOffsetX: 0.6,
                        // ghostOffsetY: 1,
                        // ghostOpacity: 0.7,
                        shape: 'round-rectangle',
                        // backgroundColor: '#343a40',
                        backgroundOpacity: 0,
                        minHeight: 60,
                        minWidth: 60
                    }
                },
                {
                    selector: '.imageComponentNode',
                    css: {
                        borderOpacity: 0,
                        backgroundOpacity: 0
                    }
                },
                {
                    selector: 'edge',
                    css: {
                        width : 2,
                        curveStyle: 'bezier',
                        lineStyle: 'solid',
                        lineColor: '#cccecf',
                        targetArrowColor: '#cccecf',
                        targetArrowShape: 'triangle',
                        transitionProperty: 'background-color, line-color, target-arrow-color'
                    }
                },
                {
                    selector: '.hide',
                    css: {
                        visibility: 'hidden'
                    }
                },
                {
                    selector: '.show',
                    css: {
                        visibility: 'visible'
                    }
                },
                {
                    selector: '.textNode',
                    css: {
                        // label: 'data(content)',
                        // shape: 'rectangle',
                        textHalign: 'center',
                        textValign: 'center',
                        backgroundOpacity: 1,
                    }
                }, 
                {
                    selector: '.imageNode',
                    css: {
                        shape: 'round-rectangle',
                        backgroundImage: function(d) {
                            return d.data('content');
                        },
                        // backgroundColor: '#F1F1F5',
                        // 'backgroundImage': '/static/images/user/ico_apl_1.png',
                        backgroundImageOpacity: function(d) {
                            let opacity = 0;
                            
                            if(d.data('stateOn')) {
                                opacity = 1;
                            }
                            
                            return opacity;
                        },
                        backgroundFit: 'cover',
                        // opacity: 0.8,
                        backgroundOpacity: function(d) {
                            let opacity = 0;
                            
                            if(d.data('stateOn')) {
                                opacity = 0;
                            }
                            
                            return opacity; 
                        },
                        borderColor: '#343a40',
                        borderWidth: 0.5,
                        borderOpacity: function(d) {
                            let opacity = 0;
                            
                            if(d.data('stateOn')) {
                                opacity = 1;
                            }
                            
                            return opacity; 
                        },
                        width: 40,
                        height: 40
                    }
                },
                {
                    selector: '.sql',
                    css: {
                        width: 83
                        // 'height': 50
                    }
                },
                {
                    selector: '.htmlLabel',
                    css: {
                        width: 300,
                        height: 150,
                        backgroundOpacity: 0
                    }
                }
            ]
        }

        return updatedConfig;
    }

    #createNode = (obj) => {
        return util.object.merge({ group: 'nodes'}, obj);
    }

    #setElements = (series) => {
        let elements = new Array();

        let dataArray = series.data;

        if(!Array.isArray(dataArray)) dataArray = [dataArray];

        dataArray.forEach(node => {

            elements.push(this.#createNode({ data: { id: node.id, seriesGroup: series.seriesGroup || '' }, classes: 'componentNode' })); 

            let index = 0;
            for(const item of Object.values(this.#config.getConfig().component)) {
                let keyArr = item.id;

                if(!Array.isArray(keyArr)) {
                    keyArr = [ keyArr ];
                }
                
                if(item.nodeType == 'htmlLabel') {
                    let obj = new Object();
                    
                    obj['data'] = new Object();
                    obj['data']['id'] = node.id + '-htmlLabel-' + index;
                    obj['data']['parent'] =  node.id;
                    obj['classes'] = item.nodeType;

                    keyArr.forEach((key) => {
                        obj['data'][key] = node[key];        
                    });

                    elements.push(this.#createNode(obj));
                }
                index += 1;
            }            

            if(node.cache1 != undefined && !util.isNull(node.cache1) && node.cache2 != undefined && !util.isNull(node.cache2)
                    && node.sql != undefined && !util.isNull(node.sql)) {
                    elements.push({ group: 'nodes', data: { id: node.id + '-image', parent: node.id }, classes: 'imageComponentNode' });
                    
                    elements.push(this.#createNode({
                        data: { 
                            parent: node.id + '-image', 
                            content: '/static/images/user/sql_img_temp.png',
                            stateOn: node.sql
                        },
                        classes: 'imageNode sql'
                    }));
                    
                    elements.push(this.#createNode({
                        data: { 
                            parent: node.id + '-image', 
                            content: '/static/images/user/ico_apl_1.png',
                            stateOn: node.cache1
                        },
                        classes: 'imageNode'
                    }));
                    
                    elements.push(this.#createNode({
                        data: { 
                            parent: node.id + '-image', 
                            content: '/static/images/user/ico_apl_2.png',
                            stateOn: node.cache2
                        },
                        classes: 'imageNode'
                    }));
                }

            if(!util.text.isEmpty(node.parent)) {
                elements.push(this.#createNode({ group: 'edges', data: { source: node.parent, target: node.id }}));
            }
        });

        return elements;
    }

    // #setElements = (seriesArray) => {
    //     let elements = new Array();

    //     seriesArray.forEach(series => {
    //         let dataArray = series.data;

    //         if(!Array.isArray(dataArray)) dataArray = [dataArray];

    //         dataArray.forEach(node => {
    //             elements.push({ group: 'nodes', data: { id: node.id, seriesGroup: series.seriesGroup || '' }, classes: 'componentNode' });

    //             for(const obj of Object.values(this.#config.getConfig().component)) {
    //                 let contnet = node[obj.id];

    //                 if(!util.isEmpty(contnet)) {
    //                     if(obj.nodeType != 'imageNode') {
    //                         elements.push(util.object.merge(
    //                             this.#createNode(), 
    //                             {
    //                                 data: { 
    //                                     id: node.id + '-' + obj.id, 
    //                                     parent: node.id, 
    //                                     content: contnet,
    //                                     nodeInfo: new Object(obj)
    //                                 },
    //                                 classes: obj.nodeType, 
    //                                 // grabbable: false 
    //                             }));
    //                     }
    //                     // else {
    //                     //     if(Array.isArray(contnet)) {
    //                     //         elements.push({ group: 'nodes', data: { id: node.id + '-' + obj.id, parent: node.id }, classes: 'imageComponentNode' });

    //                     //         contnet.forEach((data, index) => {
    //                     //             // console.log("___________________________________________")
    //                     //             // console.log(data, index);

    //                     //             elements.push(util.object.merge(
    //                     //                 this.#createNode(), 
    //                     //                 {
    //                     //                     data: { 
    //                     //                         id: node.id + '-' + obj.id + index, 
    //                     //                         parent: node.id + '-' + obj.id, 
    //                     //                         content: data,
    //                     //                         nodeInfo: new Object(obj)
    //                     //                     },
    //                     //                     classes: obj.nodeType
    //                     //                 }));
    //                     //         });
    //                     //     }
    //                     // }
    //                 }
    //             }

    //             elements.push({ group: 'nodes', data: { id: node.id + '-image', parent: node.id }, classes: 'imageComponentNode' });
    //             elements.push(util.object.merge(this.#createNode(), 
    //             {
    //                 data: { 
    //                     parent: node.id + '-image', 
    //                     content: '/static/images/user/ico_apl_1.png'
    //                 },
    //                 classes: 'imageNode'
    //             }));

    //             elements.push(util.object.merge(this.#createNode(), 
    //             {
    //                 data: { 
    //                     parent: node.id + '-image', 
    //                     content: '/static/images/user/ico_apl_2.png'
    //                 },
    //                 classes: 'imageNode'
    //             }));

    //             elements.push(util.object.merge(this.#createNode(), 
    //             {
    //                 data: { 
    //                     parent: node.id + '-image', 
    //                     content: '/static/images/user/sql_img_temp.png'
    //                 },
    //                 classes: 'imageNode sql'
    //             }));

    //             if(!util.text.isEmpty(node.parent)) {
    //                 elements.push(util.object.merge( this.#createNode(), { group: 'edges', data: { source: node.parent, target: node.id }} ));
    //             }
    //         });
    //     });

    //     return elements;
    // }
    
    addSeries = (seriesInfo) => {
        let data = seriesInfo;

        // if(!Array.isArray(data)) data = [data];

        let elements = this.#setElements(data);

        // this.#topology.startBatch();
        this.#topology.add(elements);
        // this.#topology.endBatch();

        this.#topology.layout( options ).run();

        this.#positionImageNode();

        // this.#topology.zoom(1);
    }

    removeSeries = (seriesId) => {        
        this.#topology.elements('node[seriesGroup = "' + seriesId + '"]').remove();
    }

    hideSeries = (seriesId) => {        
        this.#topology.elements('node[seriesGroup = "' + seriesId + '"]').forEach((node) => {
            node.connectedEdges().forEach((ele) => {
                // node.removeClass('show');
                ele.addClass('hide');
            });
            // node.removeClass('show');
            node.addClass('hide');
        });
    }

    showSeries = (seriesId) => {        
        this.#topology.elements('node[seriesGroup = "' + seriesId + '"]').forEach((node) => {
            node.connectedEdges().forEach((ele) => {
                ele.removeClass('hide');
                // ele.addClass('show');
            });
            node.removeClass('hide');
            // node.addClass('show');
        });
    }
}

export default Cytoscape;