<template>
  <div class="bubble-wrapper" v-if="count>0">
      <span class="bubble">
          {{count}}
      </span>
  </div>
</template>

<script>
export default {
    props: {
        count: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style scoped>
    .bubble-wrapper{
        position: absolute;
        top: -5px;
        right: -5px;
    }
    .bubble{
        font-size: 12px;
        border-radius: 100%;
        background: rgb(188, 208, 29);
        color: #212f3d;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 4px;
        padding-right: 4px;
    }
</style>