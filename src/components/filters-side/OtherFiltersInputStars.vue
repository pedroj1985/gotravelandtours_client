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
          <div class="stars-line">
              <div class="stars-align">
                <span class="star-button" ref="star" data-value=1 @click="updateValue"><i class="mdi mdi-star"></i></span>
                <span class="star-button" ref="star" data-value=2 @click="updateValue"><i class="mdi mdi-star"></i></span>
                <span class="star-button" ref="star" data-value=3 @click="updateValue"><i class="mdi mdi-star"></i></span>
                <span class="star-button" ref="star" data-value=4 @click="updateValue"><i class="mdi mdi-star"></i></span>
                <span class="star-button" ref="star" data-value=5 @click="updateValue"><i class="mdi mdi-star"></i></span>
              </div>
          </div>
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
        },
        value: {
            type: Number,
            default: 0
        }
    },
    mounted(){
        this.currentValue = this.value
    },
    data(){
        return {
            isOpen: true,
            currentValue: 0
        }
    },
    methods: {
        openClose(){
            this.isOpen = !this.isOpen
        },
        updateValue(event){
            this.currentValue = event.currentTarget.getAttribute('data-value')
            this.setActiveStars()
            this.$emit('input',event.currentTarget.getAttribute('data-value'))
        },
        setActiveStars(){
            let current = this.currentValue
            document.getElementsByClassName('star-button').forEach(function(el)
            {
                let v = el.getAttribute('data-value')
                if(v <= current){
                    el.classList.add('active')
                }
                else{
                    el.classList.remove('active')
                }
            })
        }
    }
}
</script>