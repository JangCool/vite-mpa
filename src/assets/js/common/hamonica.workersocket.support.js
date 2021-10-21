import constant from '../constant/constant'
import WebSocketClient from '../common/hamonica.websocket'

/**
 * 웹소켓 통신 연결 된 상태일 때 웹 워커에 전달 한다.
 * @param {Event} e 이벤트 객체
 * @param {JSON} data 사용자가 임의로 데이터를 전달하고 싶을 때 사용하는 json 객체  
 * 
 * @since 2020.12.16 17:34
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const openMessage = (e, data) => {
    
    console.log(e);
    postMessage({
        command : constant.WEB_SOCKET_CMD_OPEN,
        data : data || null
    });
}

/**
 * 웹소켓 연결 서버에 데이터 전송후 응답이 발생 하였을 때 웹 워커에 전달 한다.
 * @param {Event} e 이벤트 객체
 * @param {JSON} data 사용자가 임의로 데이터를 전달하고 싶을 때 사용하는 json 객체  
 * 
 * @since 2020.12.16 17:34
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const responseMessage = (e, data) => {
    postMessage({
        command : constant.WEB_SOCKET_CMD_MESSAGE,
        data : data || null
    });
}

/**
 * 웹소켓 연결이 끊어져 종료 되었을 때 웹 워커에 전달 한다.
 * @param {Event} e 이벤트 객체
 * @param {JSON} data 사용자가 임의로 데이터를 전달하고 싶을 때 사용하는 json 객체  
 * 
 * @since 2020.12.16 17:34
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const closeMessage = (e, data) => {
    console.log(e);
    postMessage({
        command : constant.WEB_SOCKET_CMD_CLOSE,
        data : data || null
    });
}

/**
 * 웹소켓 통신 연굴 후 에러가 발생 하였을 때 웹 워커에 전달 한다.
 * @param {Event} e 이벤트 객체
 * @param {JSON} data 사용자가 임의로 데이터를 전달하고 싶을 때 사용하는 json 객체  
 * 
 * @since 2020.12.16 17:34
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const errorMessage = (e, data) => {
    console.log(e);
    postMessage({
        command : constant.WEB_SOCKET_CMD_ERROR,
        data : data || null
    });
}

let socket = null;

/**
 * 웹 워커 데이터 주고 받을때 웹소켓을 이용할 수 있도록 연동 처리.
 * 
 * @param {object`  } message 웹워커에서 받은 데이터 객체
 * @param {function} initSocket 소켓 연결후 초기화 처리하는 함수.
 * @param {function} request  워커에서 요청이 들어올 경우 처리하는 함수.
 * 
 * @since 2020.12.16 17:34
 * @author 장진철(zerocooldog@pionnet.co.kr)
 */
const process = (message, initSocket, request) => {

    let data = message.data;

    if(data && data.command === constant.WEB_SOCKET_CMD_INIT){
        socket = new WebSocketClient(data.url);
        initSocket(socket);
    }else if(data && data.command === constant.WEB_SOCKET_CMD_SEND){

        //서버에 전달 하기 위해 protobuf 객체에 설정.
        var messages = require('@/protobuf/proto/Command_pb.js');
        let command =  new messages.Command();

        command.setAgentidList(data.data.aid);
        command.setCommandtype(data.data.commandType);

        let parameter = command.getParameterMap();

        for( let key in data.data.parameter){
            parameter.set(key, data.data.parameter[key]);
        }

        command.setData(data.data.data);


        request(socket, data, command);
    }
}

export {
    process,
    openMessage,
    responseMessage,
    closeMessage,
    errorMessage
}