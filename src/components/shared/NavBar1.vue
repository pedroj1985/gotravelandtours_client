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
                        <div class="user-name antonio-bold">{{ user.name }}</div>
                    </div>
                    <div class="user-photo">
                        <img :src="user.photo" v-if="user.photo" alt="">
                        <i v-else class="mdi mdi-account"></i>
                    </div>
                    <div class="vl"></div>
                    <div class="reservations hn-roman"><a href="#">Mis reservas <i class="mdi mdi-timetable"></i></a></div>
                    <div class="bills hn-roman"><a href="#">Mis facturas <i class="mdi mdi-file-document-outline"></i></a></div>
                    <div class="shopping-cart"><a href="#"><i class="mdi mdi-cart"></i></a></div>
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
export default {
    name: "NavBar1",
    props: {
        user: Object,
        isUserLogged: {
            type: Boolean,
            default: false
        }
    },
}
</script>
<style scoped>
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
    .user-photo{
        font-size: 30px;
        text-align: center;
        width: 40px;
        height: 40px;
        line-height: 1.2;
        margin-top: 10px;
        color: #bcd01d;
        border-radius: 100%;
        padding-left: 1px;
        padding-right: 1px;
        padding-top: 0;
        padding-bottom: 0;
        margin-left: 5px;
        margin-right: 3px;
        border: 1px solid #bcd01d;
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

    @media(max-width: 1368px){
        .user-photo{
            font-size: 20px;
            width: 30px;
            height: 30px;
        }
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