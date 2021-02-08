<template>
    <div class="gtt__button_modal">
        <div class="gtt__button" 
                :class="classToButton"
                ref="buttonModal"
                @click="toggleClicked"
                >
                <i class="mdi mdi-account"></i>
        </div>

        <div class="gtt__list_area_wrapper" :class="{isVisible: isVisible}" v-click-outside="handleFocusOut">
            <span class="arrow" v-if="arrow"></span>
            <div class="gtt__list_area">
                <div class="client-actions-wrapper">
                    <div class="client-actions-item" @click="activeRegisterModal">Registrar cliente</div>
                    <div class="button-close-session-wrapper">
                        <button class="btn btn-danger button-close-session" type="button" @click="closeSession">Cerrar sesión</button>
                    </div>
                </div>
            </div>
        </div>
        <RegisterModal v-if="modalActive" @closeModal="activeRegisterModal"></RegisterModal>
    </div>

</template>

<script>
import ClickOutside from 'vue-click-outside';
import {closeSession} from '../../utils/auth'
import RegisterModal from '../shared/Register'
import {eventBus} from "../../main"

export default {
    components:{
        RegisterModal
    },
    directives: {
        ClickOutside
    },
    mounted(){
        this.popupItem = this.$el
    },
    props: {
        classToButton: {
            type: String
        },
        value: null,
        arrow: {
            default: true
        },
        user: {
            type: Object
        }
    },
    data(){
        return {
            isVisible: false,
            modalActive: false
        }
    },
    methods: {
        toggleClicked(){
            this.isVisible = !this.isVisible;
        },
        handleFocusOut(){
            this.isVisible = false;
        },
        activeRegisterModal(){
            this.handleFocusOut()
            return this.modalActive = !this.modalActive;
        },
        closeSession(){
            this.handleFocusOut()
            eventBus.$emit('userLogin',null)
            closeSession(this)
        }
    }
}
</script>

<style scoped>
    .gtt__button_modal{
        position: relative;
    }
    .gtt__list_area_wrapper{
        position: absolute;
        border-radius: 10px;
        z-index: 12;
        top: 45px;
        margin-top: 30px;
        box-shadow: 0.5px -1px 15px rgba(0, 0, 0, 50%);
        display: none;
        left: -20px;
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

    div.gtt__list_area{
        min-height: 100px;
        max-height: 300px;
        min-width: 300px;
        list-style: none;
        text-align: left;
        border-radius: 10px;
        overflow: auto;
        padding-top: 15px;
        padding-left: 15px;
        padding-right: 15px;
        padding-bottom: 15px;
        background-color: #ffffff;
        margin-bottom: 0;
        color: #212f3d;
        font-family: 'Helvetica Neue LT Std-Roman';
        font-size: 14px;
    }
    @media(max-width: 1440px){
        .arrow{
            top: -12px;
        }
        .gtt__list_area_wrapper{
            top: 30px;
            margin-top: 20px;
        }
        div.gtt__list_area{
            font-size: 10px;
            padding-top: 7px;
            padding-bottom: 7px;
        }
    }

</style>