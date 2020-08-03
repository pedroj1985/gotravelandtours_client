import { eventBus } from '../main';

export const handleScrollMixin = {
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