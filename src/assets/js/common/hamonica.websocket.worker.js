import constant from '../constant/constant'


/**
 * 웹 소켓과 연동하기 위한 워커를 구현한다.
 * 
 * @since 2020.12.16 17:34
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
class WebSocketWorker {

    /**
     * 웹소켓워커 유형
     */
    #type
    
    /**
     * 웹소켓 접근 URL
     */
    #url

    /**
     * 웹소켓을 구동 할 WebWorker 경로.
     */
    #workerPath

    /**
     * worker 객체.
     */
    #worker

    constructor(p){

        this.#type = p.type;
        this.#url = p.url;
        this.#worker = this.#initWorker(p);

        this.#initEvent();
    }

    get worker(){
        return this.#worker;
    }


    #initWorker = (p) => {

        let worker = p.worker();

        if(worker){
            worker.postMessage({
                command : constant.WEB_SOCKET_CMD_INIT,
                url : p.url
            });
        }

        return worker;
    }


    #initEvent = () => {

        this.#worker.onmessage = (event) => {
            if(event.data.command == constant.WEB_SOCKET_CMD_OPEN){
                this.onopen(event);
            } else if(event.data.command == constant.WEB_SOCKET_CMD_CLOSE){
                this.onclose(event);
            } else if(event.data.command == constant.WEB_SOCKET_CMD_ERROR){
                this.onerror(event);
            } else if(event.data.command == constant.WEB_SOCKET_CMD_MESSAGE){
                this.onmessage(event);
            } else {
                console.error('처리할 이벤트가 존재하지 않습니다.')
            }
        };

        this.#worker.onerror = (event) => {
            this.onerror(event);
        };
    }

    onopen = (event) => {
        console.log("fire event onmessage : ", event)
    };

    onmessage = (event) => {
        console.log("fire event onmessage : ", event)
    };

    onerror = (event) => {
        console.error("fire event onerror : ", event)
    };

    onclose = (event) => {
        console.error("fire event onclose : ", event)
    };


    send = (data) => {
        this.worker.postMessage({
            command : constant.WEB_SOCKET_CMD_SEND,
            data : data
        })
    };

    close = () => {
        this.worker.postMessage({
            command : constant.WEB_SOCKET_CMD_CLOSE
        })
        this.worker.terminate();
    }
    
}


const createWebsocketWorker = (param) => {

    //파라메터 전달 갑 정의.
    let p = Object.assign({
        type : null,
        url : null,
        worker : null
    },param);

    return new WebSocketWorker(p);
}


export default createWebsocketWorker;
