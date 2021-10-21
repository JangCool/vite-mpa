<template>
		<div class="error-page">
			<dl class="err-txt">
				<dt>500 Internal Server Error</dt>
				<dd>에러가 발생 하였습니다.<br>다시 확인후 접속해 주세요.</dd>
			</dl>
			<div class="btns">
				<span><button type="button" class="btn ln"><em>뒤로가기</em></button></span>
				<span><button type="button" class="btn"><em>홈</em></button></span>
			</div>
		</div>

</template>

<script>
// import { reactive } from "vue";
// import axios from "@/common/hamonica.axios";
// import util from "@/utils/util";

export default {
    name:'error'
};
</script>

<style></style>
