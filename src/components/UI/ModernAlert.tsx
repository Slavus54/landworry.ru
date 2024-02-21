import {AlertPropsType} from '../../types/types'

export const ModernAlert: AlertPropsType = (text, time = 800) => {
    alert(text) 

    setTimeout(() => {
        window.location.reload()
    }, time) 
}        