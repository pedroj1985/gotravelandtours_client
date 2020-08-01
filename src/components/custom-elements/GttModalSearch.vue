<template>
 <div class="modal-backdrop">
    <div class="c-modal custom-margin">
      <div class="modal-body">
          <div class="modal-row">
              <div class="first-column img-container">
                  <slot name="image"></slot>
              </div>
              <div class="second-column">
                  <slot name="searching-text"></slot>
                  <div class="progression-bar">
                      <hr>
                  </div>
              </div>
          </div>
          <div class="modal-row">
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
export default {

}
</script>

<style scoped>
    .modal-backdrop{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .c-modal{
        position: absolute;
        top: 29%;
        background-color: white;
        width: 39.06vw;
        height: 350px;
    }
    .modal-row{
        display: flex;
    }

    .modal-logo{
        height: 30px;
    } 
    .first-column{
        float: left;
    }
    .second-column{
        float: left;
    }
    .c-modal .img-container img{
        height: 100px !important;
    }
</style>