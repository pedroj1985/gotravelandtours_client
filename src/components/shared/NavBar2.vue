<template>
  <div id="second-nav">
        <div class="main-nav custom-margin antonio-bold">
            <div class="menu-content">
                <div v-for="menuLink in menuLinks" :key="menuLink.name" class='menu-item-container'>
                    <span class="marker" :class="{'not-selected': setLinkSelected(menuLink.name)}"></span>
                    <a href="#content" @click="changeSelected(menuLink.name)" v-scroll-to="'#'+menuLink.id">{{ menuLink.displayName }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {eventBus} from '../../main';

export default {
    name: "NavBar2",
    props: {
        menuLinks: Array
    },
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
            console.log(item)
            this.changeSelected(item)
        })
    }
}
</script>

<style>

</style>