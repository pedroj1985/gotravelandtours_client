<template>
    <div id="who-we-are" class="custom-margin">
        <div class="first-text hn-roman">Descubra nuevos lugares y tenga un descanso maravilloso con GT&amp;T seleccione donde usted le gustaría visitar y provea con tiempo a nuestros agentes, ellos les encontrarán y ofrecerán las excursiones y hoteles más adecuados.</div>
        <div class="second-text hn-roman">Durante nuestro trabajo, organizamos incontables viajes para nuestros clientes. Que iniciamos como agencia pequeña de excursión, y pronto expandimos nuestra lista de ofertas, hoy nosotros tenemos experiencia valiosa y le podemos aconsejar los centros vacacionales más sensacionales, ciudades y hoteles para hacer una visita.</div>
        <div class="third-text antonio-regular">"En GT&amp;T, personalmente planificamos y creamos todas nuestras excursiones para ofrecer flexibilidad e impresiones únicas para usted. Además, cada excursión está hecha a la medida para nuestros clientes para proveer la experiencia que andan buscando."</div>
        <div class="sign-text">
            <div class="sign jey">E. Velazquez</div>
            <div class="position antonio-light">Director de Go Travel &amp; Tours</div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main'; 
export default {
    name: 'IndexWhoAreWe',
    methods: {
        handleScroll(){
            let height = window.innerHeight
            if(height*0.25 > this.$el.getBoundingClientRect().top
                && height*0 < this.$el.getBoundingClientRect().top)
            {
                eventBus.$emit('componentScrolled', this.$el.id)
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