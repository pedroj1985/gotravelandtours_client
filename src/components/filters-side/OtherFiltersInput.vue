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