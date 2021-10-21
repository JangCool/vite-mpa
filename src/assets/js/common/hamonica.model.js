// import constant from '@/common/constant/constant.js'


class Command {

    #object = {

        aid : [],
        commandType : null,
        parameter : {},
        data : null,
        success : false,
        message : null
    };


    /**
     * 에이전트 아이디 설정.
     * 
     * @param {String, Array} aid 문자열 및 배열로 작성된 에이전트 아이디.
     */
    setAid = (aid) => {

        if(typeof(aid) == "string"){
            this.addAid(aid);
        }else if(aid instanceof Array){
            this. #object.aid = aid;
        }
    };

    
    /**
     * 에이전트 아이디 추가.
     * 
     * @param {String} aid 에이전트 아이디
     */
    addAid = (aid) => {
        this. #object.aid.push(aid);
     };

     /**
      * 서버에 지시할 명령 유형 지정.
      * 
      * @param {String} commandType 명령 유형.
      */
    setCommandType = (commandType) => {
        this. #object.commandType = commandType;
    };

    /**
     * 파라메터 추가.
     * 
     * @param {String} key 파라메터 명.
     * @param {Object} value 파라메터 값.
     */
    addParameter = (key, value) => {
        this. #object.parameter[key] = value;
    };

    /**
     * 응답 데이터 또는 전송시 필요한 데이터 전송.
     * 
     * @param {*} data 
     */
    setData = (data) => {
        this. #object.data = data;
    };

    /**
     * 요청 성공 여부 설정.
     * 
     * @param {*} data 
     */
    setSuccess = (success) => {
        this. #object.success = success;
    };

    /**
     * 응답 메세지 설정.
     * 
     * @param {*} message 
     */
    setMessage = (message) => {
        this. #object.message = message;
    };

    /**
     * Json Object 반환
     * @param protoData protobuf 데이터
     * @return {JSON} command object
     */
    toObject = (protoData) => {
   
        //protobuf 객체를 Command 객체로 변환.
        if(protoData){

            this.#object.aid = protoData.agentidList;
            this.#object.commandType = protoData.commandtype;
            this.#object.data = protoData.data;
            this.#object.success = protoData.success;
            this.#object.message = protoData.message;

            let protoParameters = protoData.parameterMap;

            if(protoParameters && protoParameters.length > 0) {
                for (let i = 0; i < protoParameters.length; i++) {
                    const parameter = protoParameters[i];
                    this.addParameter(parameter[0], parameter[1]);
                }
            }
        }

        return this.#object;
    };

}

/**
 * Command 객체 생성.
 */
const createCommand = () => {
    return new Command();
}

export {
    createCommand  
} 
