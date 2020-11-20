<template>
 <div class="c-modal-backdrop">
    <div class="c-modal custom-margin">
      <div class="c-modal-body">
          <slot name="question">
              <div><i class="mdi mdi-alert" style="color: #ff0000;"></i> {{$helpers.traducir('deleteQuestion')}}</div>
          </slot>
          <div class="form-actions text-right">
              <button type="button" @click="$emit('next')">{{$helpers.traducir('yes')}}</button>
              <button type="button" @click="$emit('closeModal')">No</button>
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
.c-modal{
    height: auto;
    font-size: 24px;
    border-radius: 10px;
}

.c-modal button{
    font-size: 16px;
    width: 50px;
    height: 30px;
    margin-left: 15px;
}
</style>