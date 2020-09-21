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

<style>
    .input-wrapper{
        line-height: 1;
        padding-bottom: 30px;
        margin-bottom: 15px;
        border-bottom: 1px solid #f5f5f5;
    }
    .input-wrapper .input-header{
        display: flex;
    }
    .input-wrapper .input-content{
        margin-top: 15px;
    }
    .input-open-close-button:hover{
        cursor: pointer;
    }
    .input-wrapper .input-label{
        font-size: 18px;
        color: #212f3d;
        font-family: 'Helvetica Neue LT Std-Roman';
    }
    .input-wrapper .currentPrices{
        text-align: center;
        color: #6d6d6d;
        font-size: 16px;
        padding-bottom: 15px;
    }
    .input-wrapper .vue-slider-process{
        background-color: #6d6d6d;
    }
    .input-wrapper .vue-slider-dot-handle{
        border-color: #6d6d6d;
    }

</style>