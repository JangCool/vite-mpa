
//import util from '@/utils/util.js'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from "virtual:generated-pages";

export const createHamonicaRouter = function(p){
    const router = createRouter({
        history: createWebHashHistory(), 
        routes: [...new Set([...routes])] ,
       /* scrollBehavior: function (to) {            
            if (to.hash) {
              return {
                selector: to.hash,
                behavior: 'smooth',
              }
            }
          }*/
    });


    return router;
}

