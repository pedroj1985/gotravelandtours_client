<template>
 <div class="modal-backdrop">
    <div class="c-modal custom-margin">
      <div class="c-modal-body">
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
        background-color: rgba(0, 0, 0, 0.7);
    }

    .c-modal{
        position: absolute;
        top: 29%;
        background-color: white;
        width: 39.06vw;
        height: 350px;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .modal-row{
        display: flex;
    }

    .modal-logo{
        height: 22px;
    } 
    .first-column{
        float: left;
    }
    .second-column{
        float: left;
        padding-left: 60px;
    }
    .c-modal .img-container img{
        height: 120px !important;
    }
    .searching-text{
        font-size: 48px;
        line-height: 1.2;
        color: #212f3d;
    }
    .text-highlight{
        color: #bcd01d;
        text-transform: uppercase;
    }
    .c-modal-bottom{
        position: absolute;
        bottom: 15px;
    }
    .c-modal-bottom .first-column{
        margin-top: auto;
    }

</style>