<template>
  <div class="input-wrapper">
    <div class="input-header">
      <div class="input-label mr-auto">{{ label }}</div>
      <div class="input-open-close-button ml-auto" @click="openClose">
        <i
          class="mdi"
          :class="{ 'mdi-chevron-up': isOpen, 'mdi-chevron-down': !isOpen }"
        ></i>
      </div>
    </div>
    <div class="input-content" v-show="isOpen">
      <div class="gtt-input-group">
        <span class="gtt-input-group-prepend">
          <span class="gtt-input-group-text">
            <slot name="prepend">
              <i class="mdi mdi-magnify"></i>
            </slot>
          </span>
        </span>
        <input
          class="otherFiltersInput form-control"
          :placeholder="placeholder"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      default: "Nombre"
    },
    placeholder: {
      default: "Nombre"
    }
  },
  data() {
    return {
      isOpen: true
    };
  },
  methods: {
    openClose() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>
