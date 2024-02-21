import {useContext} from 'react'
import ImageLook from '../UI/ImageLook'
import {Context} from '../../context/WebProvider'
import ExitImage from '../../assets/exit.png'

const Exit = () => {
    const {change_context} = useContext(Context)

    const onExit = () => {
        change_context('update', null, 1)
    }

    return <ImageLook onClick={onExit} src={ExitImage} min={2} max={2.2} className='icon' alt='exit' />
}

export default Exit