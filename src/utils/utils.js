import moment from 'moment';

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
