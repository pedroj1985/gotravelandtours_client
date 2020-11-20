<template>
 <div class="c-modal-backdrop">
    <div class="c-modal custom-margin">
      <div class="c-modal-body">
          <div class="modal-row">
              <div class="first-column img-container">
                  <slot name="image"></slot>
              </div>
              <div class="second-column">
                  <slot name="searching-text"></slot>
                  <div class="progression-bar">
                      <BarLoader
                        :color="'#bcd01d'"
                        :loading="loading"
                        :width="100"
                        :widthUnit="'%'"
                      ></BarLoader>
                  </div>
              </div>
          </div>
          <div class="modal-row c-modal-bottom">
              <div class="first-column">
                  <img class="modal-logo" src="img/logo_gtt_color.svg" alt="">
              </div>
              <div class="second-column">
                  <slot name="searching-fields"></slot>
              </div>
          </div>
      </div>
    </div>
  </div> 
</template>

<script>
import { BarLoader } from '@saeris/vue-spinners'

export default {
    components: {
        BarLoader
    },
    data(){
        return {
            loading: true
        }
    },
    created(){
        // setTimeout(()=>{
        //     this.$emit('searchingFinished',false)
        // },2000)
    }
}
</script>

<style>

</style>