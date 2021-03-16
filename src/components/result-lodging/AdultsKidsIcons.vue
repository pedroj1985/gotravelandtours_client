<template>
    <span>
        <span :id="id">
            <i class="mdi mdi-account-box" v-for="k in adults" :key="k"></i>
            <i class="mdi mdi-account-box-outline" v-for="k in kids" :key="k"></i>
        </span>
        <b-tooltip :target="id" triggers="hover">
            {{ adults }} adulto(s) y {{ kids }} niño(s)
        </b-tooltip>
    </span>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: 'a-k'
        },
        adults: {
            type: Number,
            default: 1
        },
        kids: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style>

</style>