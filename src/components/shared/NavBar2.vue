<template>
  <div id="second-nav">
        <div class="main-nav custom-margin antonio-bold">
            <div class="menu-content">
                <div v-for="menuLink in menuLinks" :key="menuLink.name" class='menu-item-container'>
                    <span class="marker" :class="{'not-selected': setLinkSelected(menuLink.name)}"></span>
                    <router-link :to="{name: 'indexLogged', params: {
                                            idPage: menuLink.id
                                        }}"
                                 @click="changeSelected(menuLink.name)"
                                 v-scroll-to="'#'+menuLink.id"
                                 >
                        {{ menuLink.displayName }}
                    </router-link>
                    <!-- <a href="#content" @click="changeSelected(menuLink.name)" v-scroll-to="'#'+menuLink.id">{{ menuLink.displayName }}</a> -->
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
            this.changeSelected(item)
        })
    },
    mounted(){
        let id = this.$route.params.idPage
        if(id){
            let elment = document.getElementById(id)
            console.log(elment)
            this.$scrollTo(elment)
        }
    }
}
</script>