import moment from 'moment';
import {eventDiffDays} from '../main'

export function constructDate(date){
           return moment(date).locale('es').format('DD MMM YYYY');
}

export function calculateNights(min, max){
    return moment(min).diff(moment(max), 'days');
}

export function constructDisplay(d){
    let s = '';
    Object.keys(d).forEach(element => {
        s = s+' · '+d[element].value+' '+d[element].display
    });

    return s.substring(2);
}

export function verifyDifferentsDates(itemToCompare){

    let lcart = localStorage.getItem('gttCart') 
    if(lcart){
        let list = JSON.parse(lcart).map(i=>{return i.orderVehiculo})
        eventDiffDays.$emit('diffDays', checkDifferentDates(itemToCompare, list))
    }
}

export function verifyDifferentsDatesNoCartReturnBoolean(itemToCompare, list){
    return checkDifferentDates(itemToCompare, list.map(i => { return i.orderVehiculo}))
}

export function checkDifferentDates(item, list){
    let listDates = list.map( i => {
        return {
            end: i.FechaEntrega,
            start: i.FechaRecogida
        }
    })

    let n = false
    let c = 0
    while(!n && c<listDates.length){
        let temp = listDates[c]

        if(inBetween(item.FechaEntrega, temp.start, temp.end) ||
            inBetween(item.FechaRecogida, temp.start, temp.end)){
                n = true
        }
        else if(inBetween(temp.start, item.FechaRecogida, item.FechaEntrega) ||
                inBetween(temp.end, item.FechaRecogida, item.FechaEntrega))
                {
                    n = true
                }
        else if(item.FechaRecogida == temp.start && 
                item.FechaEntrega == temp.end){
                    n = true
        }

        c+=1
    }

    return n
}

function inBetween(item, start, end){
    return moment(item) > moment(start) && moment(item) < moment(end)
}

export function overflowText(text, l = 30){
            if(text.length > l){
                return `${text.substring(0, l)}...`
            }
            return text
        }

export const transmissionTypes = [
                {
                    nombre: 'Automatico',
                    display: 'Automático'
                },
                {
                    nombre: 'Manual',
                    display: 'Manual'
                },
                {
                    nombre: 'Automatico S/Seguro',
                    display: 'Automático S/Seguro'
                },
                {
                    nombre: 'Manual S/Seguro',
                    display: 'Manual S/Seguro'
                }
]
