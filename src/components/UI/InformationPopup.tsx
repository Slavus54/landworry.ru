import React, {useState, useEffect} from 'react'
import ImageLook from '../UI/ImageLook'
import {PopupPropsType} from '../../types/types'
import InformationImage from '../../assets/information--v1.png'

const InformationPopup: React.FC<PopupPropsType> = ({text}) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        let body: any = document.body
        
        if (isOpen) {
            body.classList.add('light')
        } else {
            body.classList.remove('light')
        }

    }, [isOpen])

    return (
        <>
            <ImageLook onClick={() => setIsOpen(!isOpen)} src={InformationImage} min={2} max={2} className='icon' alt='popup icon' />
            {isOpen && <div onClick={() => setIsOpen(false)} id='modal'><h4>{text}</h4></div>}
        </>
    )
}

export default InformationPopup