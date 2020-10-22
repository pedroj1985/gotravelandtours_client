import {es} from '../lang/es'
import {en} from '../lang/en'

export const helpers = {
    traducir: (data,locale = 'es') => {
        if(locale == 'es'){
            return es[data] || data
        }
        return en[data] || data
    },
    findTransmissionLocale(str){
        if(str == 'Automatico S/Seguro'){
            return 'AutomaticoSinSeguro'
        }

        return str
    }
}