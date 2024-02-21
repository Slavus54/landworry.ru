import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CreateArea from '../pages/CreateArea'
import Areas from '../pages/Areas'
import Area from '../pages/Area'
import CreateProduct from '../pages/CreateProduct'
import Products from '../pages/Products'
import Product from '../pages/Product'
import CreateCleaning from '../pages/CreateCleaning'
import Cleanings from '../pages/Cleanings'
import Cleaning from '../pages/Cleaning'
import Profiles from '../pages/Profiles'
import Profile from '../pages/Profile'

import {RouteType} from '../../types/types'

export const routes: RouteType[] = [
    {
        title: 'Главная',
        access_value: 0,
        url: '/',
        component: Home,
        isVisible: true
    },
    {
        title: 'Мой Аккаунт',
        access_value: -1,
        url: '/login',
        component: Login,
        isVisible: true
    },
    {
        title: 'Участки',
        access_value: 1,
        url: '/areas',
        component: Areas,
        isVisible: true
    },
    {
        title: 'Товары',
        access_value: 1,
        url: '/products',
        component: Products,
        isVisible: true
    },
    {
        title: 'Чистки',
        access_value: 1,
        url: '/cleanings',
        component: Cleanings,
        isVisible: true
    },
    {
        title: 'Пользователи',
        access_value: 1,
        url: '/profiles',
        component: Profiles,
        isVisible: true
    },
    {
        title: '',
        access_value: -1,
        url: '/register',
        component: Register,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-area/:id',
        component: CreateArea,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/area/:id',
        component: Area,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/profile/:id',
        component: Profile,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-product/:id',
        component: CreateProduct,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/product/:id',
        component: Product,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-cleaning/:id',
        component: CreateCleaning,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/cleaning/:id',
        component: Cleaning,
        isVisible: false
    }
]