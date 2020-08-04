<template>
    <div id="home-banner">
        <Slick
            class="home-carousel"
            :slidesToShow="1"
            :arrows="false"
            :dots="false"
            :autoplay="true"
            :swipe="true"
        >
            <div class="image-review">
                <img src="img/home_carrusel_01.jpg" alt="playa">
                <div class="review custom-margin">
                    <div class="home-banner-title antonio-bold">península de Hicacos "Varadero"</div>
                    <div class="home-banner-description hn-roman">
                        Con 30Km de extensión de los cuales 22Km son de playas. Una de las mejores playas del mundo para el snorkel y el buceo. 
                    </div>
                    <div class="home-banner-location hn-ltcn"><i class="mdi mdi-map-marker"></i><span class="home-location">Varadero, Cuba</span></div>
                    <div class="home-banner-weather hn-ltcn"><i class="mdi mdi-weather-sunny"></i><span class="home-grade">32°C</span></div>
                </div>
            </div>
            <div>
                <img src="img/home_carrusel_02.jpg" alt="hotel">
            </div>
            <div>
                <img src="img/home_carrusel_03.jpg" alt="habana">
            </div>
        </Slick>
        <div class="navs-wrapper">
            <NavBar2 :menuLinks="menuLinks"></NavBar2>
        </div>
        <div class="home-banner-login">
            <div class="form-login-container">
                <div class="form-logo">
                    <img src="img/logo_gtt_color.svg" alt="go travel and tours">
                    <hr>
                    <div class="form-inicio-sesion-text antonio-bold">inicio de sesión para agencias</div>
                </div>
                <form action="/login" method="POST">
                    <div class="form-group inputs-container hn-roman">
                        <input type="text" class="form-control" name="username" id="username-input" placeholder="Usuario">
                        <input type="text" class="form-control" name="password" id="password-input" placeholder="Contraseña">
                    </div>
                    <div class="form-password-forgotten hn-roman">¿Haz olvidado tu <a href="#">contraseña</a>?</div>
                    <div class="home-actions antonio-regular">
                        <button class="btn home-sign-up" type="button">registrarse</button>
                        <router-link tag="button" class="btn home-login-btn" to="/logged">entrar</router-link>                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import NavBar2 from "../shared/NavBar2"
    import { eventBus } from '../../main';
    import Slick from 'vue-slick-carousel'

    export default {
        name: "IndexBanner",
        components: {
            NavBar2,
            Slick
        },
        data(){
            return {
                menuLinks: [
                    {
                        name: 'index',
                        displayName: 'Inicio',
                        id: 'content'
                    },
                    {
                        name: 'destinies',
                        displayName: 'Destinos',
                        id: 'destinies'
                    },
                    {
                        name: 'services-you-like',
                        displayName: 'Servicios',
                        id: 'services-you-like'
                    },
                    {
                        name: 'gtt-packages',
                        displayName: 'Paquetes',
                        id: 'gtt-packages'
                    },
                    {
                        name: 'who-we-are',
                        displayName: 'GT&T',
                        id: 'who-we-are'
                    },
                ]
            }
        },
        methods: {
            handleScroll(){
                let height = window.innerHeight
                if(height*0.25 > this.$el.getBoundingClientRect().top
                    && height*0 < this.$el.getBoundingClientRect().top)
                {
                    eventBus.$emit('componentScrolled', 'index')
                }
            }
        },
        created () {
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed () {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }
</script>