<template>
		<div class="error-page">
			<dl class="err-txt">
				<dt>403 Forbidden</dt>
				<dd>접근이 금지 되었습니다.<br>다시 확인후 접속해 주세요.</dd>
			</dl>
			<div class="btns">
				<span><button type="button" class="btn ln" onclick="javascript:history.go(-1)" ><em>뒤로가기</em></button></span>
				<span><button type="button" class="btn" @click="goHome"><em>홈</em></button></span>
			</div>
		</div>
</template>

<script>

export default {
    name:'access-denied'
};
</script>

<style></style>
