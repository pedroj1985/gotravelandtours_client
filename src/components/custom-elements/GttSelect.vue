<template>
    <div class="gtt__select">
        <button class="gtt__toggle"
                ref="buttonToggle"
                @click="toggleClicked"
                :value="updateValue"
                >
                <div class="gtt__toggle_content">
                    <div class="gtt__toggle_text">
                        <slot name="placeholder" v-if="!selectedValue">
                            Seleccione
                        </slot>
                        <slot name="selectedValue" v-else>
                            {{ selectedValue }}
                        </slot>
                    </div>
                    <div class="gtt__toggle_arrow"><i class="mdi" :class="{'mdi-menu-down': !isVisible, 'mdi-menu-up': isVisible}"></i></div>
                </div>
        </button>

        <div class="gtt__list_area_wrapper" :class="{isVisible: isVisible}" v-click-outside="handleFocusOut">
            <span class="arrow" v-if="arrow"></span>
            <ul class="gtt__list_area">
                <li class="gtt__item" v-for="option in options" :key="option.id" @click="
                                                                                        if(option.hasOwnProperty('value')){
                                                                                            setSelectedValue(option.value)
                                                                                        }
                                                                                        else{
                                                                                            setSelectedValue(option)
                                                                                            }">
                    <slot name="option">{{ option }}</slot>
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
    directives: {
        ClickOutside
    },
    mounted(){
        this.popupItem = this.$el
    },
    props: {
        options: Array,
        value: {
            type: String
        }
    },
    data(){
        return {
            isVisible: false,
            arrow: true,
            selectedValue: ''
        }
    },
    methods: {
        toggleClicked(){
            this.isVisible = !this.isVisible;
        },
        setSelectedValue(item){
            this.$refs['buttonToggle'].focus()
            this.selectedValue = item;
            this.emitValue(this.selectedValue);
            this.isVisible = false;
        },
        handleFocusOut(){
            this.isVisible = false;
        },
        updateValue(){
            this.selectedValue = this.value;
        },
        emitValue(value){
            this.$emit('input', value)
        }
    }
}
</script>

<style scoped>
    .gtt__select{
        width: 100%;
        position: relative;
    }

    .gtt__toggle{
        width: 100%;
        padding-left: 15px; 
        padding-right: 15px; 
        height: 50px;
        background-color: #ffffff;
        border: 1px solid #c4c4c4;
        border-radius: 5px;
        font-family: 'Helvetica Neue LT Std-Roman';
        font-size: 16px;
        margin-bottom: 30px;
        cursor: pointer;
    }
    .gtt__toggle:focus{
        outline: none;
        box-shadow: 0px 0px 2px #212f3d;
    }
    .gtt__toggle_content{
        display: flex;
    }
    .gtt__toggle_text{
        float: left;
        padding-top: 11px;
    }
    .gtt__toggle_arrow{
        margin-left: auto;
        font-size: 30px;
    }
    .gtt__list_area_wrapper{
        position: absolute;
        border-radius: 10px;
        z-index: 2;
        top: 45px;
        margin-top: 30px;
        box-shadow: 0.5px -1px 15px rgba(0, 0, 0, 50%);
        display: none;
    }
    .isVisible{
        display: block;
    }
    .arrow{
        position: absolute;
        z-index: 1000;
        top: -15px;
        left: 10%;
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid #ffffff;
    }
    ul.gtt__list_area{
        height: 200px;
        width: 400px;
        list-style: none;
        text-align: left;
        border-radius: 10px;
        overflow: auto;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #ffffff;
        color: #212f3d;
        padding-left: 0;
        font-family: 'Helvetica Neue LT Std-Roman';
        font-size: 14px;
    }
    li.gtt__item{
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 15px;
        padding-top: 15px;
        cursor: default;
    }

    li.gtt__item:hover{
        background: #212f3d;
        color: #ffffff;
    }

</style>