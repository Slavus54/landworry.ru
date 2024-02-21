import {useState} from 'react'
import {useMutation} from '@apollo/client'
import ProfilePhoto from '../../assets/profile_photo.jpg'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfilePersonalInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const PersonalProfileInfo = ({profile, context}: AccountPageComponentProps) => {
    const [image, setImage] = useState(profile.main_photo === '' ? ProfilePhoto : profile.main_photo)

    const [updateProfilePersonalInfo] = useMutation(updateProfilePersonalInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateProfilePersonalInfo) 
        }
    })

    const onUpdate = () => {
        updateProfilePersonalInfo({
            variables: {
                account_id: context.account_id, main_photo: image
            }
        })
    }
 
    return (
        <>
            <ImageLook src={image} className='photo_item' alt='account photo' />
            <h3>{profile.username}</h3>
            <ImageLoader setImage={setImage} />

            <button onClick={onUpdate}>Обновить</button> 
        </> 
    )
}

export default PersonalProfileInfo