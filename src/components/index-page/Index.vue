<template>
    <div id="content">
        <IndexBanner></IndexBanner>
        <Destinies></Destinies>
        <IndexServices></IndexServices>
        <IndexPackages></IndexPackages>
        <IndexOtherServices></IndexOtherServices>
        <IndexWhoAreWe></IndexWhoAreWe>
        <IndexOffers></IndexOffers>
    </div>
</template>

<script>
import IndexBanner from './IndexBanner'
import Destinies from './Destinies'
import IndexServices from './IndexServices'
import IndexPackages from './IndexPackages'
import IndexOtherServices from './IndexOtherServices'
import IndexOffers from './IndexOffers'
import IndexWhoAreWe from './IndexWhoAreWe'

export default {
    name: "Index",
    components: {
        IndexBanner,
        Destinies,
        IndexServices,
        IndexPackages,
        IndexOtherServices,
        IndexOffers,
        IndexWhoAreWe
    },
    methods: {
    }
};
</script>