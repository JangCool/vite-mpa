import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
// import html from 'highlight.js/lib/languages/htmlbars';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import properties from 'highlight.js/lib/languages/properties';
import 'highlight.js/styles/atom-one-light.css' // Import code highlight style 
// import 'highlight.js/styles/atom-one-dark.css' // Import code highlight style 

hljs.registerLanguage('json', json);
// hljs.registerLanguage('html', html);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('java', java);
hljs.registerLanguage('properties', properties);

const DirectiveHighlight = {


    /**
     * 해당 코드들은 전부 highlight.js를 적용 시킨다.
     * code 내용들은 보기 좋게 표현 된다.
     * @param {*} el HTMLElement
     * @since 2020.12.16 17:34
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    mounted (el) {
        const blocks = el.querySelectorAll('pre code');
        blocks.forEach((block) => {
            hljs.highlightElement(block)
        })
    }
  }
  
  export default DirectiveHighlight;
  