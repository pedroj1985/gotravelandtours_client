<template>
  <span class="gtt-tooltip" :data-tooltip="adults + ' adulto(s) y ' + kids + ' niño(s)'">
    <i class="mdi mdi-account-box" v-for="a in adults" :key="a.id"></i>
    <i class="mdi mdi-account-box-outline" v-for="k in kids" :key="k.id"></i>
  </span>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "a-k"
    },
    adults: {
      type: Number,
      default: 1
    },
    kids: {
      type: Number,
      default: 0
    }
  }
};
</script>
