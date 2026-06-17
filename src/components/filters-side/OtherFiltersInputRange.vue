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
      <div class="currentPrices hn-roman">
        {{ constructPrices() }}
      </div>
      <div class="range-inputs">
        <label>{{ localMin }} USD</label>
        <input type="range" :min="min" :max="max" :value="localMin" @input="onMinInput" />
        <input type="range" :min="min" :max="max" :value="localMax" @input="onMaxInput" />
        <label>{{ localMax }} USD</label>
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
    value: {
      type: Array
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  emits: ["input"],
  data() {
    return {
      isOpen: true,
      localMin: this.value ? this.value[0] : this.min,
      localMax: this.value ? this.value[1] : this.max
    };
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.localMin = newVal[0];
          this.localMax = newVal[1];
        }
      },
      deep: true
    }
  },
  methods: {
    openClose() {
      this.isOpen = !this.isOpen;
    },
    onMinInput(event) {
      this.localMin = Number(event.target.value);
      this.$emit("input", [this.localMin, this.localMax]);
    },
    onMaxInput(event) {
      this.localMax = Number(event.target.value);
      this.$emit("input", [this.localMin, this.localMax]);
    },
    constructPrices() {
      return this.value[0] + " USD - " + this.value[1] + " USD";
    }
  }
};
</script>
