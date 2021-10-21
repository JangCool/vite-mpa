<template>ddcache {{ t('common.title') }} {{t}}
    <router-view></router-view>
</template>


<script>
import { useI18n } from 'vue-i18n';

export default {
    setup(props) {
        const { t, messages } = useI18n();

console.log(messages)
        return {
            t
        }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
