import util from '../../../../utils/util';

const createStrSvg = (width = 100, height = 100, icon) => {

    let strSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" xmlns:xlink="http://www.w3.org/1999/xlink"> 
    <circle cx="50" cy="50" r="47" style="fill:none; 
            stroke: #ffabcb; 
            stroke-width: 2.5; 
            stroke-dashoffset: 0; 
            stroke-dasharray: none 1000">
    </circle>
    <image xlink:href="data:image/png;base64,${icon}" 
    height="55" width="55" stroke="red" x="50%" y="50%" transform="translate(-27, -27)"/></svg>`;

    return strSvg;
}

const defaultStyle = [
    // {
    //     selector: '.componentNode',
    //     css: {
    //         shape: 'round-rectangle',
    //         borderColor: '#343a40',
    //         borderWidth: 0.5,
    //         backgroundOpacity: 0,
    //         minHeight: 60,
    //         minWidth: 60
    //     }
    // },
    // {
    //     selector: '.componentNode:selected',
    //     css: {
    //         borderColor: '#fe4994',
    //         borderWidth: 3,
    //     }
    // },
    {
        selector: 'edge',
        css: {
            overlayOpacity: 0,          // element state 변환 시 뒤에 나타나는 배경색 제거
            width : 2,
            curveStyle: 'bezier',
            lineStyle: 'solid',
            lineColor: '#cccecf',
            targetArrowColor: '#cccecf',
            targetArrowShape: 'triangle',
            transitionProperty: 'background-color, line-color, target-arrow-color',
            fontSize: 11,
            minZoomedFontSize: 9,       // 줌시 최소 폰트 크기(설정 값 이하면 표시X)
            textBackgroundColor: '#ffffff',
            lineHeight: '1.5',
            textBackgroundOpacity: function(d) {
                let opacity = 0;

                if(d.data('label') != undefined && !util.text.isBlank(d.data('label')) ) {
                    opacity = 1;
                }
                return opacity;
            },
            textWrap: 'wrap',
            label: function(d) {
                return d.data('label') || '';
            },
            visibility: function(d) {
                let isVisibled = d.data('visible');
                let res = 'visible';

                if(isVisibled != 'undefined' && isVisibled != null) {
                    if(!isVisibled) {
                        res = 'hidden';
                    }
                }
                return res;
            }
        }
    },
    {
        selector: '.htmlText',
        css: {
            shape: 'round-rectangle',
            width: 305,
            height: 140,
            backgroundOpacity: 0,
            borderColor: '#d0d7df',
            borderWidth: 1.5,
            minHeight: 60,
            minWidth: 60
        }
    },
    {
        selector: '.htmlText:selected',
        css: {
            borderColor: '#fe4994',
            borderWidth: 3,
        }
    },
    {
        selector: '.imageNode',
        css: {
            // shape: 'round-rectangle',
            borderColor: '#d0d7df',
            borderWidth: 2.5,
            borderOpacity: 0.9,
            // backgroundColor: '#cccecf',
            backgroundOpacity: 0,
            padding: 3,
            width: '60',
            height: '60',
            textHalign: 'center',
            textValign: 'bottom',
            fontSize: 12,
            textMarginY: 4,
            backgroundImage: function(ele) {
                var data = 'data:image/svg+xml;utf8,' + encodeURIComponent(createStrSvg(100, 100, ele.data('path')));

                return data;
            },
            // backgroundImage: function(d) {
            //     return d.data('path');
            // },
            backgroundFit: 'cover',
            content: function(d) {
                let content = d.data('label') || '';
                return content;
            }
        }
    },
    {
        selector: '.imageNode:selected',
        css: {
            borderColor: '#fe4994',
            borderWidth: 3,
        }
    },
    {
        selector: 'edge:selected',
        css: {
            width: 3,
            lineColor: '#fe4994',
            targetArrowColor: '#fe4994',
            targetArrowShape: 'triangle',
            transitionProperty: 'background-color, line-color, target-arrow-color',
        }
    },
    {
        selector: ':grabbed',
        css: {
            overlayOpacity: 0,  // element state 변환 시 뒤에 나타나는 배경색 제거
            selectionBoxOpacity: 0,
            activeBgOpacity: 0,
            outsideTextureBgOpacity: 0
        }
    },
    {
        selector: ':selected',
        css: {
            overlayOpacity: 0,  // element state 변환 시 뒤에 나타나는 배경색 제거
            selectionBoxOpacity: 0,
            activeBgOpacity: 0,
            outsideTextureBgOpacity: 0
        }
    },
    // {
    //     selector: '.hide',
    //     css: {
    //         visibility: 'hidden'
    //     }
    // },
    // {
    //     selector: '.show',
    //     css: {
    //         visibility: 'visible'
    //     }
    // },
];

export default defaultStyle;