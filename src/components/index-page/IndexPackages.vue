<template>
 <div id="gtt-packages" class="custom-margin">
    <div class="gtt-packages-title section-title hn-bdcn">Con Go Travel &amp; Tours te ofrecemos estos paquetes</div>
    <div class="packages-container">
        <div class="package" v-for="(indexPackage, index) in packages" :class="{'no-last': isNotLastPackage(index)}" :key="indexPackage.id">
            <img :src="'img/'+indexPackage.icon" alt="">
            <div class="package-name hn-roman">{{indexPackage.name}}</div>
            <div class="package-desc hn-roman">{{indexPackage.description}}</div>
        </div>
    </div>
</div> 
</template>

<script>
import {eventBus} from '../../main';
export default {
    name: "IndexPackages",
    data(){
        return {
            packages: [
                {
                name: 'Alojamiento',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
                icon: 'icopaq_alojamiento_color.svg'
            },
            {
                name: 'Renta de Autos',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
                icon: 'icopaq_renta_color.svg'
            },
            {
                name: 'Traslados',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
                icon: 'icopaq_traslado_color.svg'
            },
            {
                name: 'Actividades y Excursiones',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
                icon: 'icopaq_excursiones_color.svg'
            }
            ]
        }
    },
    methods: {
        isNotLastPackage(index){
            let s = this.packages.length

            return index !== s-1; 
        },
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