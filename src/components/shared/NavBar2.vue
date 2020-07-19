<template>
  <div id="second-nav">
        <div class="main-nav custom-margin antonio-bold">
            <div class="menu-content">
                <div class='menu-item-container'><span class="marker" :class="{'not-selected': setLinkSelected('index')}"></span><a href="#content" @click="changeSelected('index')" v-scroll-to="'#content'">inicio</a></div>
                <div class='menu-item-container'><span class="marker" :class="{'not-selected': setLinkSelected('destinies')}"></span><a href="#destinies"  @click="changeSelected('destinies')" v-scroll-to="'#destinies'">destinos</a></div>
                <div class='menu-item-container'><span class="marker" :class="{'not-selected': setLinkSelected('services-you-like')}"></span><a href="#services-you-like" @click="changeSelected('services-you-like')" v-scroll-to="'#services-you-like'">servicios</a></div>
                <div class='menu-item-container'><span class="marker" :class="{'not-selected': setLinkSelected('gtt-packages')}"></span><a href="#gtt-packages" @click="changeSelected('gtt-packages')" v-scroll-to="'#gtt-packages'">paquetes</a></div>
                <div class='menu-item-container'><span class="marker" :class="{'not-selected': setLinkSelected('who-we-are')}"></span><a href="#who-we-are" @click="changeSelected('who-we-are')" v-scroll-to="'#who-we-are'">gt&t</a></div>
            </div>
        </div>
    </div>
</template>

<script>

import {eventBus} from '../../main';

export default {
    name: "NavBar2",
    data(){
        return {
            linkSelected: 'index'
        }
    },
    methods: {
        changeSelected(item)
        {
            this.linkSelected = item;
        },
        setLinkSelected(item)
        {
            if(this.linkSelected == item)
            {
                return false;
            }
            return true;
        },
    },
    created(){
        eventBus.$on('componentScrolled', (item) => {
            this.changeSelected(item)
        })
    }
}
</script>

<style>

</style>