<template>
  <div class="selected-room row">
      <div class="col-md-5 room-name">
          {{item.habitacion.Habitacion.Nombre}}
      </div>
      <div class="col-md-5 room-layout">
          {{item.CantAdultos}} Adultos, {{item.CantidadMenores}} Niños
      </div>
      <div class="col-md-2 room-buttons">
        <button type="button" class="antonio-regular" @click="remove"><i class="mdi mdi-trash-can"></i></button>
      </div>
  </div>
</template>

<script>
export default {
    // mounted(){
    //     console.log(this.item)
    //     console.log('room aqui')
    // },
    props: {
        item: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    methods: {
        remove(){
            this.$emit('removeFromList', this.item)
        }
    }

}
</script>

<style>

</style>