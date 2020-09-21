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
          <b-input-group>
              <b-input-group-prepend>
                    <b-input-group-text>
                        <slot name="prepend">
                            <i class="mdi mdi-magnify"></i>
                        </slot>
                    </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input
                    class="otherFiltersInput"
                    :placeholder="placeholder"
              ></b-form-input>
          </b-input-group>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        label: {
            default: 'Nombre'
        },
        placeholder: {
            default: 'Nombre'
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
    .input-wrapper .input-group-text{
        background-color: #ffffff;
        border-color: #c4c4c4;
        font-family: 'Helvetica Neue LT Std-Roman';
    }
    .input-wrapper input{
        height: 50px;
        border-color: #c4c4c4;
        font-family: 'Helvetica Neue LT Std-Roman';
    }

</style>