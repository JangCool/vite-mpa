/**
 * Front-end에서 사용할 공통 상수 값을 정의한다.
 * constant.속성명 형식으로 접근한다.
 * 
 * @author 장진철(zerocooldog@pionnet.co.kr)
 * @since 2020.06.29
 */
export default {
    //샘플용
    SAMPLE_ALL : process.env.VUE_APP_SAMPLE_ALL,
    SAMPLE : process.env.VUE_APP_SAMPLE,
    //end 샘플용

    BOOLEAN_TRUE: 'Y',
    BOOLEAN_FALSE: 'N',
    
    VUE_APP_PROFILES_ACTIVE: process.env.VUE_APP_PROFILES_ACTIVE,

    STATE_KEY : "_hmc_state",

    PATH_NAME_IMS: '/ims',
    PATH_NAME_WAS: '/was',
    PATH_NAME_SETTINGS: '/settings',
    PATH_NAME_OS: '/os',
    PATH_NAME_DB: '/db',
    PATH_NAME_CACHE: '/cache',


    COOKIE_SKIP_MAIN: "skipMain",

    COOKIE_STARTUP_APPLICATION: "startupApplication",

    APPLICATION_ID_IMD : 'APP000',
    APPLICATION_ID_WAS : 'APP001',
    APPLICATION_ID_CACHE : 'APP002',
    APPLICATION_ID_OS : 'APP003',
    APPLICATION_ID_DB : 'APP004',


    //통합모니터링 대시보드
    APPLICATION_IMD_URL: "/imd",
    //웹 어플리케이션 서버
    APPLICATION_WAS_URL: "/was",
    //캐시
    APPLICATION_CACHE_URL: "/cache",
    //OS
    APPLICATION_OS_URL: "/os",
    //DB
    APPLICATION_DB_URL: "/db",



    //상위 메뉴 아이디 : Cache 메뉴
    PARENT_MENU_ID_CACHE : 'MEU0000001',

    //상위 메뉴 아이디 : Was 메뉴
    PARENT_MENU_ID_WAS : 'MEU0000019',

    //상위 메뉴 아이디 : OS 메뉴
    PARENT_MENU_ID_OS : 'MEU0000019',

    //상위 메뉴 아이디 : DB 메뉴
    PARENT_MENU_ID_DB : 'MEU0000019',

    //상위 메뉴 아이디 : 환경 설정 메뉴
    PARENT_MENU_ID_SETTINGS : 'MEU0000036',

    //vuex에 웹소켓 객체를 저장할 cache 이름.
    WEB_SOCKET_CACHE : 'WEB_SOCKET_CACHE',
    //vuex에 웹소켓 객체를 저장할 cacheRealtime 이름.
    WEB_SOCKET_CACHE_REALTIME : 'WEB_SOCKET_CACHE_REALTIME', 
    //vuex에 웹소켓 객체를 저장할 cacheRealtime 이름.
    WEB_SOCKET_CACHE_ENGINE_REALTIME : 'WEB_SOCKET_CACHE_ENGINE_REALTIME', 
    //제어 -> 활성/비활성 메뉴 웹소켓 구분값
    WEB_SOCKET_CACHE_CONTROL_ACTIVATE: 'WEB_SOCKET_CACHE_CONTROL_ACTIVATE',
    //제어 -> 활성/비활성 메뉴 실시간 웹소켓 구분값
    WEB_SOCKET_CACHE_REALITME_CONTROL_ACTIVATE: 'WEB_SOCKET_CACHE_REALITME_CONTROL_ACTIVATE',
    //vuex에 웹소켓 객체를 저장할 was 이름.
    WEB_SOCKET_WAS : 'WEB_SOCKET_WAS',
    //vuex에 웹소켓 객체를 저장할 wasRealtime 이름.
    WEB_SOCKET_WAS_REALTIME : 'WEB_SOCKET_WAS_REALTIME',
    //제어 -> 활성/비활성 웹소켓 캐시 분석 흐름 구분값
    WEB_SOCKET_CACHE_ANALYSIS_ANALYSIS_STREAM: 'WEB_SOCKET_CACHE_ANALYSIS_ANALYSIS_STREAM',
    //제어 -> 알람 웹소켓 구분값
    WEB_SOCKET_ALARM: 'WEB_SOCKET_ALARM',

    //webworker를 통하여 웹 소켓 통신을 하기위한 명령 정의.
    //웹소켓 초기화
    WEB_SOCKET_CMD_INIT : 'init',
    //웹소켓 전송
    WEB_SOCKET_CMD_SEND : 'send',
    //웹소켓 응답 메세지.
    WEB_SOCKET_CMD_MESSAGE : 'message',
    //웹소켓 연결 성공.
    WEB_SOCKET_CMD_OPEN : 'open',
    //웹소켓 연결 닫힘.
    WEB_SOCKET_CMD_CLOSE : 'close',
    //웹소켓 연결 에러.
    WEB_SOCKET_CMD_ERROR : 'error',

    CACHE_SCAN_TYPE_SERVICE: 'service',

    CACHE_SCAN_TYPE_MYBATIS : 'mybatis',

    VIEW_TYPE_CARD : 'card',

    VIEW_TYPE_GRID : 'grid',

    SERVER_TYPE_AGENT : 'AGENT',
    
    SERVER_TYPE_COLLECTOR : 'COLLECTOR',
    
    SERVER_TYPE_CACHE : 'CACHE',

    GROUP_LINK_TYPE_CD_AGENT : 'SYS003001',

    GROUP_LINK_TYPE_CD_CACHE : 'SYS003002',


    METRIC_DATA_INPUT_TYPE_CD_SLID : 'MTR002001',
    METRIC_DATA_INPUT_TYPE_CD_TEXT : 'MTR002002',
    METRIC_DATA_INPUT_TYPE_CD_NONE : 'MTR002003',    
    
	/**
	 * 측정지표, 서버 호출 유형 : 서비스 그룹.
	 */
	MEASUREMENT_TYPE_SERVICE_GROUP : "MSMTT_SG",
	
	/**
	 * 측정지표, 서버 호출 유형 : 엔진 그룹.
	 */
	MEASUREMENT_TYPE_ENGINE_GROUP : "MSMTT_EG",
	
	/**
	 * 측정지표, 서버 호출 유형 : 수집 서버.
	 */
	MEASUREMENT_TYPE_COLLECTOR : "MSMTT_CT",

    /**
	 * 측정지표, 서버 호출 유형 : 서버 아이디
     */
    MEASUREMENT_TYPE_SERVER_ID: "MSMTT_SI",

    CACHE_APPLY_LOG_POSITION_SQL: 'SQL',
    CACHE_APPLY_LOG_POSITION_SERVICE: 'SERVICE',
    
	/**
	 * 서버 적용 전 준비
	 */
	APPLY_STATUS_READY : 'READY',
	
	/**
	 * 적용 요청 후 응답 대기
	 */
	APPLY_STATUS_WAITING_RESPONSE : 'WAITING_RESPONSE',
	
	/**
	 * 완료
	 */
	APPLY_STATUS_COMPLETE : 'COMPLETE',
	
	/**
	 * 실패
	 */
    APPLY_STATUS_FAIL : 'REFAILADY',
    
    SERVER_STATUS_RUNNING: 'RUNNING',

    SERVER_STATUS_WAITING: 'WAITING',

    SERVER_STATUS_SHUTDOWN: 'SHUTDOWN',

    SERVER_STATUS_NO_LICENSE: 'NO_LICENSE',

    SERVER_STATUS_UNRECOGNIZED: 'UNRECOGNIZED',

    DEFAULT_SLOT_NAME : "타이틀을 입력해 주세요.",

    /**
     * 1차 캐시 단계 구분 값.
     */
    CACHE_STEP_PRIMARY: "PRIMARY",
    /**
     * 2차 캐시 단계 구분 값.
     */
    CACHE_STEP_SECONDARY: "SECONDARY",

    /**
     * 1차 캐시 활성
     */
    CACHE_INACTIVATE: "INACTIVATE",
    /**
     * 2차 캐시 비 활성.
     */
    CACHE_DEACTIVATE: "DEACTIVE",
    
   	/**
	 *  알림 위험 유형 ( ) 
	 */
	NOTIFICATION_THRESHOLD_CD_WARNING : "NTI003001",
	NOTIFICATION_THRESHOLD_CD_DANGER  : "NTI003002",


    /*
    * 알림유형  ( )
    */
    NOTIFICATION_TYPE_APPLICATION : "NTI002001" ,   //어플리케이션 알림
    NOTIFICATION_TYPE_COMMON : "NTI002002" ,   // 공통
    
    
    /**
     * 메인 대시보드 아이디
     */    
    DASHBOARD_CACHE_MAIN : "DSH0000019", //케시 메인 대시보드


}