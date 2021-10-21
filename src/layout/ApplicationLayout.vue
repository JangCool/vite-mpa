/* eslint-disable no-undef */
<template>
    <slot name="nav">Nav</slot>
    <div id="wrapper" class="wrapper side-nav-toggled">
        <!-- <slot name="header">/slot> -->
        <slot name="side">Side</slot>
        <slot name="content">Content</slot>
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
