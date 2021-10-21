import { createCommand } from './hamonica.model'

/**
 * 웹 소켓 연결 클라이언트이다.
 * 연결 실패시 자동 재접속이 이루어지도록 보강하였다.
 * 
 * @since 2020.12.16 17:34
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
class WebSocketClient {

    /**
     * 재시도 하는 setInterval() 실행 아이디
     */
    #retryIntervalId;

    /**
     * 재시도 횟수
     */
    #retryCount = 1;

    #url;

    #protocols = null;

    #options;

    #readyState = WebSocket.CLOSED;

    #instance;


    /**
     * 생성자 호출 시 초기화 작업.
     * 
     * @param {string}} url 웹소켓 연결 url
     * @param {JSON} options WebSocketClient 설정 값.
     */
    constructor(url, options){

        this.#url = url;
            
        //파라메터 전달 갑 정의.
        this.#options = Object.assign({

            protocols : null,
            
            // debug: false,

            /** The number of milliseconds to delay before attempting to reconnect. */
            reconnectInterval: 2000,

            /** The maximum number of reconnection attempts to make. Unlimited if null. */
            maxReconnectAttempts: 5,

            /** The binary type, possible values 'blob' or 'arraybuffer', default 'blob'. */
            binaryType: 'arraybuffer'

        }, options || {} );

        this.#protocols = this.#options.protocols;

        this.#instance = this.#getInstance();

        console.log("this.#instance.", this.#instance)

        if(!this.#instance){
            this.reconnect();
        }else{
            this.#init();
        }
    
    }    

    /**
     * 연결 상태 값 반환.
     * @return {string} 연결 상태 값.
     * 
     * @since 2020.12.16 17:34
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    get readyState(){
        return this.#readyState;
    }

    /**
     * 웹 소켓 서버에 연결 여부 반환
     * @return {boolean} 연결 상태 여부.
     * 
     * @since 2020.12.16 17:34
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    isConnected(){
        return this.#readyState === WebSocket.OPEN;
    }
    
    /**
     * 웹소켓 객체 생성.
     * 
     * @return {WebSocket} 웹소켓 객체
     * 
     * @since 2020.12.16 17:34
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    #getInstance = () => {
        let websocketInstance = (this.#protocols != null) ? new WebSocket(this.#url, this.#protocols) : new WebSocket(this.#url);
        websocketInstance.binaryType = this.#options.binaryType;
        return websocketInstance;
    }
    /**
     * 웹 소켓 연결 초기화 함수.
     * WebSocket 연결 이벤트와, WebSocketClient 연결 이벤트를 연동 시킨다.
     * 
     * @since 2020.12.16 17:34
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    #init = () => {

        this.#instance.onopen = (e)=>{
            this.onopen(e);
            this.#readyState = WebSocket.OPEN;
        };
        this.#instance.onmessage = (e,flags)=>{

            //protobuf 불러오기.
            var messages = require('@/protobuf/proto/Command_pb.js');
    
            let responseData = messages.Command.deserializeBinary(e.data);
            let command = createCommand();

            //서버응답 에러 값이 true이면 onerror 함수 실행.
            if(responseData.toObject().error === true){
                e.code = "ENREQREFUSED"
                this.onerror(e);
            }else{
                this.onmessage(e, command.toObject(responseData.toObject()), responseData, flags);
            }


        };
        this.#instance.onclose =(e)=>{

            this.#readyState = WebSocket.CLOSED;

            switch (e.code){
            case 1000:	// CLOSE_NORMAL
                console.log("WebSocket: closed");
                break;
            default:	// Abnormal closure
                this.reconnect(e);
                break;
            }
            this.onclose(e);
        };
        this.#instance.onerror = (e)=>{
            console.log("error", e)
            switch (e.code){
            case 'ECONNREFUSED':
                this.reconnect(e);
                break;
            default:
                this.onerror(e);
                break;
            }
        };
    }

    /**
     * 서버에 데이터를 전달 한다.
     * 
     * @param {object} data 서버에 전달할 데이터
     * @param {*} option 
     * 
     * @since 2020.12.16 17:34
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    send(data,option){
        try{
            this.#instance.send(data,option);
        }catch (e){
            this.#instance.emit('error',e);
        }
    }
    
    /**
     * 
     * 웹 소켓 서버와 연결 불발 시 재시도 처리.
     * 
     * @param {Event} e 이벤트 객체
     * 
     * @since 2020.12.16 17:34
     * @author 장진철(zerocooldog@pionnet.co.kr)
     */
    reconnect(e){

        var that = this;

        if(that.#retryIntervalId){
            console.log('The Interval() function is already running.');
            return;
        }

        that.#retryIntervalId = setInterval(function(){

            console.log(`WebSocketClient: retry in ${that.#options.reconnectInterval}ms, count : ${that.#retryCount},`, e || "");

            if( that.#retryCount >= that.#options.maxReconnectAttempts || that.isConnected()){
                clearInterval(that.#retryIntervalId);
                that.#retryIntervalId = null;
                return;
            }

            that.#instance = that.#getInstance();
            that.#retryCount++;

        }, this.#options.reconnectInterval);
    }

    onopen (e){	console.log("WebSocketClient: open", e);	}
    onmessage(e, data, protoData, flags){	console.log("WebSocketClient: message", e, data, protoData, flags);	}
    onerror(e){	console.log("WebSocketClient: error", e);	}
    onclose(e){	console.log("WebSocketClient: closed", e);	}

}

export default WebSocketClient;