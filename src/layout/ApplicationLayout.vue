/* eslint-disable no-undef */
<template>
    <slot name="nav">네비게이션</slot>
    <div id="wrapper" class="wrapper side-nav-toggled">
        <!-- <slot name="header">헤더 영역</slot> -->
        <slot name="side">빈 좌/우측 메뉴 영역</slot>
        <slot name="content">내용 영역</slot>
    </div>
</template>

<script>


export default {
  name: "applicationLayout",
  setup() {},
};
</script>
<style>



</style>
