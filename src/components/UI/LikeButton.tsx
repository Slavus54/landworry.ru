import React from 'react'
import ImageLook from './ImageLook'
import {SimpleTriggerProps} from '../../types/types'
import LikeImage from '../../assets/like_btn.png'

const LikeButton: React.FC<SimpleTriggerProps> = ({onClick}) => {
    return <ImageLook onClick={onClick} src={LikeImage} min={2} max={2} className='icon' alt='like button' />
}

export default LikeButton