<template>
    <div class="gtt__select_form">
        <button class="gtt__toggle"
                ref="buttonToggle"
                @click="toggleClicked"
                :value="uValue"
                >
                <div class="gtt__toggle_content">
                    <div class="gtt__toggle_text">
                        <div class="gtt__toggle_text_first_column">
                            <slot name="iconSelectedValue"></slot>
                        </div>
                        <div class="gtt__toggle_text_second_column twoRows">
                            <div class="small">
                                <slot name="placeholder">
                                    Seleccione
                                </slot>
                            </div>
                            <div>
                                {{ constructDisplay(emitValue) }}
                            </div>
                        </div>
                    </div>
                    <div class="gtt__toggle_arrow"><i class="mdi" :class="{'mdi-menu-down': !isVisible, 'mdi-menu-up': isVisible}"></i></div>
                </div>
        </button>
        <div class="gtt__list_area_wrapper" :class="{isVisible: isVisible}" v-click-outside="handleFocusOut">
            <span class="arrow" v-if="arrow"></span>
            <div class="gtt__form">
                <div class="gtt__item row" v-for="item in finalValue" :key="item.id">
                    <div class="gtt__item_label col-md-6">
                        {{ item.label }}
                    </div>
                    <div class="col-md-2">
                        <button class="gtt__picker_button" :class="{disabled: item.value<=0}" :disabled="item.value<=0" @click="remove(item, item.step)"><i class="mdi mdi-minus"></i></button>
                    </div>
                    <div class="col-md-1">
                        <p class="gtt__picker_value">{{ item.value }}</p>
                    </div>
                    <div class="col-md-2">
                        <button class="gtt__picker_button" @click="add(item, item.step)"><i class="mdi mdi-plus"></i></button>
                    </div>
                </div>
                <div class="gtt__item gtt__itemKids row" v-if="kids.length > 0">
                    <div class="col-md-6 gtt__kidsSelect" v-for="(kid, i) in kids" :key="kid.id">
                        <gtt-select :options="kidsAgeList" v-model="kid.age">
                            <span slot="placeholder">Edad del menor {{i+1}}</span>
                            <template v-slot:selectedValue="selectedValue">
                                {{selectedValue.selectedValue}} años
                            </template>
                        </gtt-select>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import ClickOutside from 'vue-click-outside';
import GttSelect from '../custom-elements/GttSelect';

export default {
    components: {
        GttSelect
    },
    directives: {
        ClickOutside
    },
    mounted(){
        this.popupItem = this.$el
    },
    props: {
        options: Array,
        value: {
            type: Object,
            default: null
        }
    },
    created(){
        if(!this.value){
            for (let index = 0; index < this.options.length; index++) {
                let code = this.options[index].code;
                let d = this.options[index].default;
                this.finalValue.push(
                    {
                        code: code,
                        label: this.options[index].label,
                        display: this.options[index].display,
                        value: d
                    }
                    );
            }
        }
        else{
            for(const item of Object.entries(this.value)){
                this.finalValue.push(
                    item[1]
                )
            }
        }

        this.finalValue.forEach(element => {
        this.updateValue(element) 
        });
    },
    data(){
        return {
            kids: [],
            kidsAgeList: [
                0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
            ],
            isChanged: false,
            isVisible: false,
            arrow: true,
            emitValue: {},
            finalValue: []
        }
    },
    methods: {
        toggleClicked(){
            this.isVisible = !this.isVisible;
        },
        handleFocusOut(){
            this.isVisible = false;
        },
        uValue(){
            this.emitValue = this.value;
        },
        updateValue(item){
            this.$set(this.emitValue,item.code, {
                display: item.display,
                code: item.code,
                label: item.label,
                value: item.value
            })
            this.$emit('input',this.emitValue);
        },
        constructDisplay(d){
            let s = '';
            Object.keys(d).forEach(element => {
                s = s+' · '+d[element].value+' '+d[element].display
            });

            return s.substring(2);
        },
        add(item, step = 1){
            if(item.code == "kids")
            {
                this.kids.push({
                    age: null
                    })
            }
            item.value+=step
            this.isChanged = true;
            this.updateValue(item)
        },
        remove(item, step = 1){
            if(item.code == "kids")
            {
                this.kids.pop()
            }
            let r = item.value - step
            if(r >= 1 && item.code != "kids")
            {
                item.value-=step
                this.isChanged = true;
                this.updateValue(item)
            }
            else if(r >= 0 && item.code == "kids"){
                item.value-=step
                this.isChanged = true;
                this.updateValue(item)
            }
        },
    }
}
</script>

<style scoped>
    .gtt__select_form{
        width: 100%;
        position: relative;
        margin-bottom: 15px;
    }

    .gtt__toggle{
        width: 100%;
        padding-left: 15px; 
        padding-right: 15px; 
        height: 50px;
        background-color: #ffffff;
        border: 1px solid #c4c4c4;
        border-radius: 5px;
        font-family: 'Helvetica Neue LT Std-Roman';
        font-size: 16px;
        margin-bottom: 30px;
        cursor: pointer;
    }
    .gtt__toggle:focus{
        outline: none;
        box-shadow: 0px 0px 2px #212f3d;
    }
    .gtt__toggle_content{
        display: flex;
    }
    .gtt__toggle_text{
        float: left;
        display: flex;
    }
    .gtt__toggle_text_first_column, .gtt__toggle_text_second_column{
        padding-top: 11px;
    }
    .gtt__toggle_text_second_column{
        text-align: left;
        padding-left: 5px;
    }

    .twoRows{
        padding-top: 2px;
    }
    .gtt__toggle_arrow{
        margin-left: auto;
        font-size: 30px;
    }
    .gtt__list_area_wrapper{
        position: absolute;
        border-radius: 10px;
        z-index: 3;
        top: 45px;
        margin-top: 30px;
        box-shadow: 0.5px -1px 15px rgba(0, 0, 0, 50%);
        display: none;
    }
    .gtt__itemKids{
        margin-top: 30px;
    }
    .gtt__kidsSelect{
        padding-right: 5px;
        padding-left: 0;
        height: 50px;
        margin-bottom: 5px;
    }
    .isVisible{
        display: block;
    }
    .arrow{
        position: absolute;
        z-index: 1000;
        top: -15px;
        left: 10%;
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid #ffffff;
    }

    .gtt__form{
        padding: 30px;
        position: relative;
        background: #ffffff;
        min-width: 450px;
        min-height: 150px;
        border-radius: 10px;
        font-family: 'Helvetica Neue LT Std-Roman';
        color: #212f3d;
        font-size: 14px;
        line-height: 1.2;
    }
    .gtt__item{
        display: flex;
        margin-bottom: 5px;
    }
    .gtt__item_v_picker{
        display: flex;
    }
    .gtt__picker_button{
        width: 48px;
        height: 48px;
        border-radius: 100%;
        border: 1px solid #212f3d;
        background: #ffffff;
        font-size: 14px;
        font-family: 'Helvetica Neue LT Std-Roman';
        color: #212f3d;
    }
    .gtt__item_label, .gtt__picker_value{
        padding-top: 15px; 
    }
    .gtt__picker_value{
        text-align: center;
    }


    .gtt__picker_button.disabled{
        color: #c4c4c4;
        border: 1px solid #c4c4c4;
    }

    .gtt__picker_button:focus{
        outline: none;
    }
    .gtt__picker_button:hover{
        color: #c4c4c4;
        border: 1px solid #c4c4c4;
    }

    @media(max-width: 1440px)
    {
        .gtt__toggle{
            height: 35px;
            margin-bottom: 20px;
            font-size: 12px;
            padding-left: 8px; 
            padding-right: 8px; 
        }
        .arrow{
            top: -12px;
        }
        .gtt__toggle_text{
            padding-top: 0px;
        }
        .gtt__toggle_text_first_column, .gtt__toggle_text_second_column{
            padding-top: 5px;
        }
        .twoRows{
            padding-top: 0px;
        }
        .gtt__toggle_arrow{
            font-size: 20px;
        }
        .gtt__list_area_wrapper{
            top: 30px;
            margin-top: 20px;
        }
        .gtt__form{
            padding: 15px;
            font-size: 12px;
        }
        .gtt__picker_button{
            width: 36px;
            height: 36px;
            font-size: 12px;
        }
        .gtt__itemKids{
            margin-top: 30px;
            width: 100%;
            margin-left: 0px;
        }
        .gtt__kidsSelect{
            padding-right: 5px;
            padding-left: 0;
            height: 50px;
            margin-bottom: 5px;
        }
    }

</style>