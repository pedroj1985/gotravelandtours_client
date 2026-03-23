<template>
  <div class="input-wrapper">
      <div class="input-header">
          <div class="input-label mr-auto">{{label}}</div>
          <div class="input-open-close-button ml-auto" @click="openClose">
              <i class="mdi" :class="{'mdi-chevron-up':isOpen,
                                      'mdi-chevron-down':!isOpen}"></i>
          </div>
      </div>
      <div class="input-content" v-show="isOpen">
          <div class="currentPrices hn-roman">
              {{constructPrices()}}
          </div>
          <VueSlider :min="min" :max="max" v-model="value" :lazy="true"></VueSlider>
      </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
export default {
    components: {
        VueSlider
    },
    watch: {
        value: function(value){
            this.updateValue(value)
        }
    },
    props: {
        label: {
            default: 'Nombre'
        },
        value: {
            type: Array
        },
        min:{
            type: Number,
            default: 0
        },
        max:{
            type: Number,
            default: 100
        }
    },
    data(){
        return {
            isOpen: true
        }
    },
    methods: {
        openClose(){
            this.isOpen = !this.isOpen
        },
        updateValue(value){
            this.$emit('input', value);
        },
        constructPrices(){
            return this.value[0] + ' USD - ' + this.value[1] + ' USD'
        }
    }
}
</script>