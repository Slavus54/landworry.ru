import React from 'react'
import {Link} from 'wouter'
import {RouteType} from '../../types/types'

const RouterItem: React.FC<RouteType> = ({url, title}) => {
    return <Link href={url} className='nav_item'>{title}</Link>
}

export default RouterItem