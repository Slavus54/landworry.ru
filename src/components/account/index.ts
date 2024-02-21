import PersonalProfileInfo from './PersonalProfileInfo'
import GeoProfileInfo from './GeoProfileInfo'
import CommonProfileInfo from './CommonProfileInfo'
import ProfileSecurity from './ProfileSecurity'
import ProfileServices from './ProfileServices'
import ProfileComponents from './ProfileComponents'

import {AccountPageComponentType} from '../../types/types'

const components: AccountPageComponentType[] = [
    {
        title: 'Профиль',
        icon: './profile/account.png',
        component: PersonalProfileInfo
    },
    {
        title: 'Геопозиция',
        icon: './profile/geo.png',
        component: GeoProfileInfo
    },
    {
        title: 'Информация',
        icon: './profile/settings.png',
        component: CommonProfileInfo
    },
    {
        title: 'Безопасность',
        icon: './profile/security.png',
        component: ProfileSecurity
    },
    {
        title: 'Услуги',
        icon: './profile/services.png',
        component: ProfileServices
    },
    {
        title: 'Коллекции',
        icon: './profile/collections.png',
        component: ProfileComponents
    }
]

export const default_component = components[0]

export default components