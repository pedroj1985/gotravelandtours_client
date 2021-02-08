<template>
    <div id="first-nav">
        <div id="first-nav-content" class="custom-margin">
            <router-link to="/" id="logo_link">
                <img class="logo" src="img/logo_gtt_blanco.svg" alt="Go Travel and Tours">
            </router-link>
            <div class="right-side-navbar">
                <div class="auth-user-menu" v-if="isUserLogged">
                    <div class="user-name-hello">
                        <div class="hello antonio-light">Buenas tardes</div>
                        <div class="user-name antonio-bold"><span>{{ user.name }}</span><span class="antonio-light"> de </span><span>{{user.clienteNombre}}</span></div>
                    </div>
                    <GttButtonModal :user="user" :classToButton="'user-photo'">
                    </GttButtonModal>
                    <div class="vl"></div>
                    <div class="reservations hn-roman">
                        <router-link :to="{name: 'myreservations'}">
                            Mis reservas <i class="mdi mdi-timetable"></i>
                        </router-link>
                    </div>
                    <div class="bills hn-roman"><a href="#">Mis facturas <i class="mdi mdi-file-document-outline"></i></a></div>
                    <div class="shopping-cart">
                        <router-link :to="{name: 'reservation'}">
                            <div class="shopping-cart-wrapper">
                                <i class="mdi mdi-cart"></i>
                                <GttBubbleNotification :count="itemsInCart"></GttBubbleNotification>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div id="language_selector">
                    <i class="mdi mdi-web"></i><span class="l_letters hn-roman">ES</span>
                </div>
                <div class="search" v-if="isUserLogged"><i class="mdi mdi-magnify"></i></div>
            </div>
        </div>
    </div> 
</template>

<script>
import GttButtonModal from '../custom-elements/GttButtonModal'
import GttBubbleNotification from '../custom-elements/GttBubbleNotification'

export default {
    components: {
        GttButtonModal,
        GttBubbleNotification
    },
    name: "NavBar1",
    props: {
        itemsInCart: {
            type: Number,
            default: 0
        },
        user: Object,
        isUserLogged: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        emitUserLogin(value)
        {
            this.$emit('userLogin', value)
        }
    },
}
</script>
<style scoped>
    .shopping-cart-wrapper{
        position: relative;
    }
    .right-side-navbar{
        display: flex;
        float: right;
        height: 100%;
    }

    .auth-user-menu{
        display: flex;
    }

    .vl{
        height: 100%;
        border-left: 1px solid #c4c4c4;
    }

    .user-name-hello{
        margin-top: 10px;
    }
    .hello, .user-name{
        padding: 0;
        line-height: 1.2;
        text-align: right;
        color: #bcd01d;
        font-size: 18px;
    }
    #language_selector{
        margin-top: 18px;
        color: #c4c4c4;
        line-height: 1.2;
        float: right;
        font-size: 24px;
        padding-right: 30px;
    }
    .reservations{
        padding-left: 15px;
    }
    .reservations, .bills, .shopping-cart, .search{
        padding-right: 30px;
        line-height: 1.2;
        margin-top: 18px;
    }
    .reservations i, .bills i, .shopping-cart i, .search i{
        font-size: 24px;
    }
    .search{
        color: #c4c4c4;
    }
    .reservations a, .bills a, .shopping-cart a{
        text-transform: uppercase;
        color: #c4c4c4;
        font-size: 16px;
    }

    @media(max-width: 1440px){
        .hello, .user-name{
            font-size: 14px;
        }
        .reservations i, .bills i, .shopping-cart i, .search i{
            font-size: 14px;
        }
        .reservations a, .bills a, .shopping-cart a{
            font-size: 14px;
        }
        #language_selector{
            font-size: 14px;
        }
    }
</style>