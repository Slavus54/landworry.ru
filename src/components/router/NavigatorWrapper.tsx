import React, {useContext} from 'react'
import {useLocation} from 'wouter'
import {Context} from '../../context/WebProvider'
import {NavigatorWrapperPropsType} from '../../types/types'

const NavigatorWrapper: React.FC<NavigatorWrapperPropsType> = ({children, isRedirect = false, id = '', url = '/'}) => {
    const {context} = useContext(Context)
    const [loc, setLoc] = useLocation()

    const onRedirect = () => setLoc(context.account_id === id ? '/' : `/profile/${id}`)

    return (
        <div onClick={() => isRedirect ? onRedirect() : setLoc(url)}>
           {children}
        </div>
    )
}

export default NavigatorWrapper